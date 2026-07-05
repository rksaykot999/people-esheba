const db = require('../config/db');
const { ok, err } = require('../utils/response');

/* ── GET /admin/dashboard ─────────────────────────────────── */
exports.getDashboard = async (req, res) => {
  try {
    const [[stats]] = await db.execute(`
      SELECT
        (SELECT COUNT(*) FROM users WHERE role='user')          AS total_users,
        (SELECT COUNT(*) FROM users WHERE role='admin')         AS total_admins,
        (SELECT COUNT(*) FROM users WHERE is_active=0)          AS blocked_users,
        (SELECT COUNT(*) FROM users WHERE DATE(created_at)=CURDATE()) AS new_users_today,
        (SELECT COUNT(*) FROM jobs WHERE status='active')       AS active_jobs,
        (SELECT COUNT(*) FROM jobs)                             AS total_jobs,
        (SELECT COUNT(*) FROM donations WHERE status='pending') AS pending_donations,
        (SELECT COUNT(*) FROM donations WHERE status='approved')AS active_donations,
        (SELECT COALESCE(SUM(amount),0) FROM donation_transactions) AS total_donated,
        (SELECT COUNT(*) FROM blood_donors WHERE is_available=1) AS available_donors,
        (SELECT COUNT(*) FROM volunteers WHERE is_active=1)     AS active_volunteers,
        (SELECT COUNT(*) FROM emergency_services)               AS emergency_services,
        (SELECT COUNT(*) FROM job_applications)                 AS total_applications,
        (SELECT COUNT(*) FROM reports WHERE status='pending')   AS pending_reports
    `);

    const [recent_users] = await db.execute(
      'SELECT id,name,email,role,is_active,created_at FROM users ORDER BY created_at DESC LIMIT 8'
    );
    const [pending_donations] = await db.execute(
      `SELECT d.*,u.name AS poster_name FROM donations d
       JOIN users u ON d.user_id=u.id WHERE d.status='pending' ORDER BY d.created_at DESC LIMIT 8`
    );
    const [recent_jobs] = await db.execute(
      `SELECT j.id,j.title,j.company,j.type,j.status,j.created_at,u.name AS poster
       FROM jobs j JOIN users u ON j.user_id=u.id ORDER BY j.created_at DESC LIMIT 6`
    );

    // Monthly new users (last 6 months)
    const [monthlyUsers] = await db.execute(`
      SELECT DATE_FORMAT(created_at,'%b %Y') AS month, COUNT(*) AS count
      FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY month ORDER BY MIN(created_at)
    `);

    ok(res, { stats, recent_users, pending_donations, recent_jobs, monthly_users: monthlyUsers });
  } catch (e) {
    console.error(e);
    err(res, 'Dashboard failed', 500);
  }
};

/* ── GET /admin/users ─────────────────────────────────────── */
exports.getUsers = async (req, res) => {
  try {
    const { search, role, status, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let   where  = ['1=1'];
    const params = [];

    if (search) { where.push('(name LIKE ? OR email LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }
    if (role)   { where.push('role = ?');   params.push(role); }
    if (status === 'active')   where.push('is_active = 1');
    if (status === 'blocked')  where.push('is_active = 0');

    const [rows] = await db.execute(
      `SELECT id,name,email,phone,role,avatar,division,district,is_active,is_verified,created_at
       FROM users WHERE ${where.join(' AND ')} ORDER BY created_at DESC
       LIMIT ${parseInt(limit)} OFFSET ${offset}`,
      params
    );
    const [[{ total }]] = await db.execute(
      `SELECT COUNT(*) AS total FROM users WHERE ${where.join(' AND ')}`, params
    );
    ok(res, { rows, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch { err(res, 'Failed', 500); }
};

/* ── PUT /admin/users/:id/toggle ──────────────────────────── */
exports.toggleUser = async (req, res) => {
  const [[user]] = await db.execute('SELECT id,is_active,role FROM users WHERE id=?', [req.params.id]);
  if (!user) return err(res, 'Not found', 404);
  if (user.role === 'admin') return err(res, 'Cannot block admin', 403);
  await db.execute('UPDATE users SET is_active=? WHERE id=?', [user.is_active ? 0 : 1, req.params.id]);
  ok(res, { is_active: !user.is_active }, user.is_active ? 'User blocked' : 'User unblocked');
};

/* ── PUT /admin/users/:id/role ────────────────────────────── */
exports.changeRole = async (req, res) => {
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) return err(res, 'Invalid role', 400);
  await db.execute('UPDATE users SET role=? WHERE id=?', [role, req.params.id]);
  ok(res, null, 'Role updated');
};

/* ── DELETE /admin/users/:id ──────────────────────────────── */
exports.deleteUser = async (req, res) => {
  if (parseInt(req.params.id) === req.user.id) return err(res, 'Cannot delete yourself', 400);
  await db.execute('DELETE FROM users WHERE id=?', [req.params.id]);
  ok(res, null, 'User deleted');
};

/* ── Donations management ─────────────────────────────────── */
exports.getDonations = async (req, res) => {
  try {
    const { status, page = 1, limit = 15 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let   where  = ['1=1'];
    const params = [];
    if (status) { where.push('d.status = ?'); params.push(status); }
    const [rows] = await db.execute(
      `SELECT d.*, u.name AS poster_name, u.email AS poster_email
       FROM donations d JOIN users u ON d.user_id=u.id
       WHERE ${where.join(' AND ')} ORDER BY d.created_at DESC
       LIMIT ${parseInt(limit)} OFFSET ${offset}`,
      params
    );
    const [[{ total }]] = await db.execute(
      `SELECT COUNT(*) AS total FROM donations d WHERE ${where.join(' AND ')}`, params
    );
    ok(res, { rows, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch { err(res, 'Failed', 500); }
};

exports.updateDonationStatus = async (req, res) => {
  const { status } = req.body;
  if (!['approved','rejected','completed'].includes(status)) return err(res, 'Invalid status', 400);
  await db.execute('UPDATE donations SET status=? WHERE id=?', [status, req.params.id]);
  ok(res, null, `Donation ${status}`);
};

exports.deleteDonation = async (req, res) => {
  await db.execute('DELETE FROM donations WHERE id=?', [req.params.id]);
  ok(res, null, 'Deleted');
};

/* ── Jobs management ──────────────────────────────────────── */
exports.getAllJobs = async (req, res) => {
  try {
    const { page = 1, limit = 15 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const [rows] = await db.execute(
      `SELECT j.*, u.name AS poster_name,
       (SELECT COUNT(*) FROM job_applications a WHERE a.job_id=j.id) AS applicants
       FROM jobs j JOIN users u ON j.user_id=u.id
       ORDER BY j.created_at DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`
    );
    const [[{ total }]] = await db.execute('SELECT COUNT(*) AS total FROM jobs');
    ok(res, { rows, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch { err(res, 'Failed', 500); }
};

exports.deleteJob = async (req, res) => {
  await db.execute('DELETE FROM jobs WHERE id=?', [req.params.id]);
  ok(res, null, 'Deleted');
};

exports.createJob = async (req, res) => {
  try {
    const { title, company, description, type, location, division, district, salary, salary_min, salary_max, deadline, is_active } = req.body;
    if (!title || !company) return err(res, 'Title and company required', 400);
    // Support both salary (string) and salary_min/salary_max (numbers) from different form layouts
    const sMin = salary_min || null;
    const sMax = salary_max || null;
    const desc = description || (salary ? `Salary: ${salary}` : '') || '';
    const dist = district || location || null;
    const status = (is_active === false || is_active === 0) ? 'draft' : 'active';
    const [r] = await db.execute(
      `INSERT INTO jobs (user_id,title,company,description,type,salary_min,salary_max,division,district,deadline,status)
       VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [req.user.id, title, company, desc, type||'full-time', sMin, sMax, division||null, dist, deadline||null, status]
    );
    const [[job]] = await db.execute(
      `SELECT j.*, u.name AS poster_name FROM jobs j JOIN users u ON j.user_id=u.id WHERE j.id=?`,
      [r.insertId]
    );
    ok(res, job, 'Job posted', 201);
  } catch (e) { console.error(e); err(res, 'Failed to post job', 500); }
};

exports.updateJob = async (req, res) => {
  try {
    const { title, company, description, type, location, division, district, salary, salary_min, salary_max, deadline, is_active, status } = req.body;
    const [[job]] = await db.execute('SELECT id FROM jobs WHERE id=?', [req.params.id]);
    if (!job) return err(res, 'Not found', 404);
    const sMin = salary_min || null;
    const sMax = salary_max || null;
    const desc = description || '';
    const dist = district || location || null;
    const jobStatus = status || ((is_active === false || is_active === 0) ? 'draft' : 'active');
    await db.execute(
      `UPDATE jobs SET title=?,company=?,description=?,type=?,salary_min=?,salary_max=?,division=?,district=?,deadline=?,status=? WHERE id=?`,
      [title, company, desc, type||'full-time', sMin, sMax, division||null, dist, deadline||null, jobStatus, req.params.id]
    );
    ok(res, null, 'Job updated');
  } catch (e) { console.error(e); err(res, 'Failed to update job', 500); }
};

/* ── Reports ──────────────────────────────────────────────── */
exports.getReports = async (req, res) => {
  const [rows] = await db.execute(
    `SELECT r.*, u.name AS reporter_name FROM reports r
     JOIN users u ON r.reporter_id=u.id ORDER BY r.created_at DESC LIMIT 50`
  );
  ok(res, rows);
};

exports.resolveReport = async (req, res) => {
  await db.execute('UPDATE reports SET status="resolved" WHERE id=?', [req.params.id]);
  ok(res, null, 'Resolved');
};

/* ── Announcements ────────────────────────────────────────── */
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !body) return err(res, 'Title and body required', 400);
    await db.execute(
      'INSERT INTO announcements (admin_id, title, body) VALUES (?,?,?)',
      [req.user.id, title, body]
    );
    // Notify all users
    const [users] = await db.execute('SELECT id FROM users WHERE is_active=1');
    const inserts = users.map(u => [u.id, title, body, 'announcement', null]);
    if (inserts.length) {
      await db.query(
        'INSERT INTO notifications (user_id, title, body, type, link) VALUES ?', [inserts]
      );
    }
    ok(res, null, `Announcement sent to ${users.length} users`, 201);
  } catch { err(res, 'Failed', 500); }
};

/* ── Blood donors (admin view) ────────────────────────────── */
exports.getBloodDonors = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const [rows] = await db.execute(
      `SELECT b.*, u.name, u.email, u.phone, u.is_verified
       FROM blood_donors b JOIN users u ON b.user_id=u.id
       ORDER BY b.created_at DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`
    );
    const [[{ total }]] = await db.execute('SELECT COUNT(*) AS total FROM blood_donors');
    ok(res, { rows, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch { err(res, 'Failed', 500); }
};

/* ── Volunteers (admin view) ──────────────────────────────── */
exports.getVolunteers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const [rows] = await db.execute(
      `SELECT v.*, u.name, u.email, u.phone
       FROM volunteers v JOIN users u ON v.user_id=u.id
       ORDER BY v.created_at DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`
    );
    const [[{ total }]] = await db.execute('SELECT COUNT(*) AS total FROM volunteers');
    ok(res, { rows, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch { err(res, 'Failed', 500); }
};

/* ── Emergency services management ───────────────────────── */
exports.getEmergencyServices = async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM emergency_services ORDER BY created_at DESC');
  ok(res, rows);
};

exports.createEmergencyService = async (req, res) => {
  try {
    const { name, type, address, division, district, phone, latitude, longitude, is_24h } = req.body;
    const [r] = await db.execute(
      `INSERT INTO emergency_services (name,type,address,division,district,phone,latitude,longitude,is_24h,is_verified,created_by)
       VALUES (?,?,?,?,?,?,?,?,?,1,?)`,
      [name,type,address||null,division||null,district||null,phone||null,latitude||null,longitude||null,is_24h||0,req.user.id]
    );
    const [[row]] = await db.execute('SELECT * FROM emergency_services WHERE id=?', [r.insertId]);
    ok(res, row, 'Created', 201);
  } catch { err(res, 'Failed', 500); }
};

exports.updateEmergencyService = async (req, res) => {
  const { name, type, address, division, district, phone, is_verified, is_24h } = req.body;
  await db.execute(
    'UPDATE emergency_services SET name=?,type=?,address=?,division=?,district=?,phone=?,is_verified=?,is_24h=? WHERE id=?',
    [name,type,address||null,division||null,district||null,phone||null,is_verified||0,is_24h||0,req.params.id]
  );
  ok(res, null, 'Updated');
};

exports.deleteEmergencyService = async (req, res) => {
  await db.execute('DELETE FROM emergency_services WHERE id=?', [req.params.id]);
  ok(res, null, 'Deleted');
};

/* ── Analytics ────────────────────────────────────────────── */
exports.getAnalytics = async (req, res) => {
  try {
    const [topJobs] = await db.execute(
      'SELECT title, company, views, type FROM jobs ORDER BY views DESC LIMIT 5'
    );
    const [topDonations] = await db.execute(
      'SELECT title, amount_needed, amount_raised, category FROM donations WHERE status="approved" ORDER BY amount_raised DESC LIMIT 5'
    );
    const [bloodByGroup] = await db.execute(
      'SELECT blood_group, COUNT(*) AS count FROM blood_donors WHERE is_available=1 GROUP BY blood_group'
    );
    const [volunteerByCategory] = await db.execute(
      'SELECT category, COUNT(*) AS count FROM volunteers WHERE is_active=1 GROUP BY category'
    );
    ok(res, { topJobs, topDonations, bloodByGroup, volunteerByCategory });
  } catch { err(res, 'Failed', 500); }
};

/* ── Blood donors extras ──────────────────────────────────── */
exports.deleteBloodDonor = async (req, res) => {
  await db.execute('DELETE FROM blood_donors WHERE id=?', [req.params.id]);
  ok(res, null, 'Deleted');
};
exports.verifyBloodDonor = async (req, res) => {
  await db.execute('UPDATE users u JOIN blood_donors b ON u.id=b.user_id SET u.is_verified=1 WHERE b.id=?', [req.params.id]);
  ok(res, null, 'Verified');
};

/* ── Volunteers extras ────────────────────────────────────── */
exports.deleteVolunteer = async (req, res) => {
  await db.execute('DELETE FROM volunteers WHERE id=?', [req.params.id]);
  ok(res, null, 'Deleted');
};
exports.verifyVolunteer = async (req, res) => {
  await db.execute('UPDATE users u JOIN volunteers v ON u.id=v.user_id SET u.is_verified=1 WHERE v.id=?', [req.params.id]);
  ok(res, null, 'Verified');
};

/* ── Jobs extras ──────────────────────────────────────────── */
exports.updateJobStatus = async (req, res) => {
  const { status } = req.body;
  if (!['active','closed','draft'].includes(status)) return err(res, 'Invalid status', 400);
  await db.execute('UPDATE jobs SET status=? WHERE id=?', [status, req.params.id]);
  ok(res, null, `Job ${status}`);
};

/* ── Bulk Import ──────────────────────────────────────────── */
exports.bulkImport = async (req, res) => {
  try {
    const { table, rows } = req.body;
    if (!table || !Array.isArray(rows) || rows.length === 0) return err(res, 'Invalid data', 400);

    const allowedTables = ['doctors', 'pharmacies', 'notices', 'education_institutions', 'scholarships', 'jobs'];
    if (!allowedTables.includes(table)) return err(res, 'Invalid table', 400);

    const columns = Object.keys(rows[0]).filter(k => k !== 'id');
    
    // Most content tables expect a created_by column
    if (!columns.includes('created_by')) {
      columns.push('created_by');
      rows.forEach(r => r.created_by = req.user.id);
    }

    const placeholders = columns.map(() => '?').join(',');
    const query = `INSERT INTO ${table} (${columns.join(',')}) VALUES (${placeholders})`;

    let successCount = 0;
    for (const row of rows) {
      const values = columns.map(col => {
        let val = row[col];
        if (val === undefined || val === '') return null;
        if (typeof val === 'boolean') return val ? 1 : 0;
        return val;
      });
      try {
        await db.execute(query, values);
        successCount++;
      } catch (e) {
        console.error(`Failed to insert row:`, e.message);
      }
    }

    ok(res, { successCount, total: rows.length }, `Imported ${successCount}/${rows.length} records`);
  } catch (e) {
    console.error(e);
    err(res, 'Import failed', 500);
  }
};

