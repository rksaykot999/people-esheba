const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { ok, err } = require('../utils/response');

/* ── GET /admin/backup/download ──────────────────────────────
   Creates a zip of the project (excluding node_modules/.git/uploads)
   + a SQL dump of the database, then streams it as a download.
────────────────────────────────────────────────────────────── */
exports.downloadBackup = async (req, res) => {
  try {
    // VERCEL FIX: Archiver and file system backups are not supported in a Vercel Serverless environment.
    // The filesystem is read-only and source files are not available.
    return err(res, 'File backup is not supported in Vercel Serverless environment. Please use Database backups directly from your database provider.', 403);


    // The remaining implementation has been removed as it requires file system access which Vercel Serverless Functions do not provide.
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
