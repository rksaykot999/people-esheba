const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const { exec } = require('child_process');
const { ok, err } = require('../utils/response');

/* ── GET /admin/backup/download ──────────────────────────────
   Creates a zip of the project (excluding node_modules/.git/uploads)
   + a SQL dump of the database, then streams it as a download.
────────────────────────────────────────────────────────────── */
exports.downloadBackup = async (req, res) => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename  = `people-esheba-backup-${timestamp}.zip`;

    // Set streaming headers
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    const archive = archiver('zip', { zlib: { level: 6 } });
    archive.on('error', (e) => { console.error('Archiver error:', e); });
    archive.pipe(res);

    // ── 1. Add the server source files (not node_modules / .git)
    const serverRoot = path.join(__dirname, '../../');
    const projectRoot = path.resolve(serverRoot, '../');

    archive.glob('**/*', {
      cwd: serverRoot,
      ignore: [
        'node_modules/**',
        '.git/**',
        'uploads/**',      // can be large
        '*.log',
        '.env',            // security
      ],
      prefix: 'server',
    });

    // ── 2. Add the client source files
    const clientRoot = path.resolve(projectRoot, 'client');
    if (fs.existsSync(clientRoot)) {
      archive.glob('**/*', {
        cwd: clientRoot,
        ignore: ['node_modules/**', '.git/**', 'dist/**', '*.log'],
        prefix: 'client',
      });
    }

    // ── 3. Add README.md
    const readmePath = path.join(projectRoot, 'README.md');
    if (fs.existsSync(readmePath)) {
      archive.file(readmePath, { name: 'README.md' });
    }

    // ── 3. Try to add a DB dump (mysqldump)
    //  Requires mysqldump to be available in PATH. If not, we skip gracefully.
    const dbDumpPromise = new Promise((resolve) => {
      const {
        DB_HOST = 'localhost',
        DB_PORT = '3306',
        DB_USER = 'root',
        DB_PASSWORD = '',
        DB_NAME,
      } = process.env;

      if (!DB_NAME) return resolve(null);

      const cmd = `mysqldump -h ${DB_HOST} -P ${DB_PORT} -u ${DB_USER} ${DB_PASSWORD ? `-p${DB_PASSWORD}` : ''} ${DB_NAME} 2>NUL`;

      const child = exec(cmd, { maxBuffer: 500 * 1024 * 1024 }, (error, stdout) => {
        if (error || !stdout) return resolve(null);
        resolve(stdout);
      });
    });

    const sqlDump = await dbDumpPromise;
    if (sqlDump) {
      archive.append(sqlDump, { name: `database_${timestamp}.sql` });
    } else {
      // Add a readme explaining that mysqldump wasn't available
      archive.append(
        'mysqldump was not available on this server. Please backup the database manually.\n',
        { name: 'DATABASE_BACKUP_README.txt' }
      );
    }

    await archive.finalize();
  } catch (e) {
    console.error('Backup failed:', e);
    if (!res.headersSent) {
      err(res, 'Backup generation failed. Please try again.', 500);
    }
  }
};

/* ── GET /admin/backup/status ─────────────────────────────── */
exports.getBackupStatus = async (req, res) => {
  try {
    // Check mysqldump availability
    const hasMysqldump = await new Promise((resolve) => {
      exec('mysqldump --version', (error) => resolve(!error));
    });

    ok(res, {
      mysqldump_available: hasMysqldump,
      db_name: process.env.DB_NAME || 'Not configured',
      server_time: new Date().toISOString(),
    });
  } catch {
    err(res, 'Status check failed', 500);
  }
};

/* ── POST /admin/backup/restore ─────────────────────────────
   Extracts an uploaded zip file directly into the project root
────────────────────────────────────────────────────────────── */
exports.restoreBackup = async (req, res) => {
  try {
    if (!req.file) {
      return err(res, 'No backup file provided', 400);
    }
    const zipPath = req.file.path;
    const projectRoot = path.resolve(__dirname, '../../../');
    
    // Extract using tar (available in Windows 10+)
    const cmd = `tar -xf "${zipPath}" -C "${projectRoot}"`;
    exec(cmd, (error, stdout, stderr) => {
      // Remove uploaded file
      fs.unlink(zipPath, () => {});
      
      if (error) {
        console.error('Extraction error:', error);
        return err(res, 'Failed to restore backup', 500);
      }
      
      ok(res, { message: 'Backup restored successfully! Server will restart with new files.' });
    });
  } catch (e) {
    console.error('Restore error:', e);
    err(res, 'Restore failed', 500);
  }
};
