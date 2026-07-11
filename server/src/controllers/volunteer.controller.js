const db = require('../config/db');
const { ok, err } = require('../utils/response');
const { getPagination, runPaginated } = require('../utils/pagination');

exports.getAll = async (req, res) => {
  try {
    const { category, district, search } = req.query;
    const { page, limit } = getPagination(req.query, 16);
    let   where  = ['v.is_active = 1'];
    const params = [];

    if (category) { where.push('v.category = ?');      params.push(category); }
    if (district) { where.push('v.district LIKE ?');   params.push(`%${district}%`); }
    if (search)   { where.push('u.name LIKE ?');       params.push(`%${search}%`); }

    const cond = where.join(' AND ');
    const result = await runPaginated(
      db,
      `SELECT v.*, u.name, u.avatar, u.is_verified
       FROM volunteers v JOIN users u ON v.user_id=u.id
       WHERE ${cond} ORDER BY v.created_at DESC`,
      `SELECT COUNT(*) AS total FROM volunteers v JOIN users u ON v.user_id=u.id WHERE ${cond}`,
      params,
      { page, limit }
    );
    ok(res, result);
  } catch { err(res, 'Failed', 500); }
};

exports.register = async (req, res) => {
  try {
    const { skills, availability, category, division, district, bio } = req.body;
    const [[existing]] = await db.execute('SELECT id FROM volunteers WHERE user_id=?', [req.user.id]);
    if (existing) return err(res, 'Already registered', 409);

    const [r] = await db.execute(
      `INSERT INTO volunteers (user_id,skills,availability,category,division,district,bio,is_active)
       VALUES (?,?,?,?,?,?,?,?)`,
      [req.user.id, skills||null, availability||null, category||'general', division||null, district||null, bio||null, 0]
    );
    const [[row]] = await db.execute(
      'SELECT v.*, u.name, u.avatar FROM volunteers v JOIN users u ON v.user_id=u.id WHERE v.id=?',
      [r.insertId]
    );
    ok(res, row, 'Registration submitted for admin review', 201);
  } catch { err(res, 'Failed', 500); }
};

exports.updateVolunteer = async (req, res) => {
  try {
    const { skills, availability, category, district, bio } = req.body;
    await db.execute(
      'UPDATE volunteers SET skills=?,availability=?,category=?,district=?,bio=? WHERE user_id=?',
      [skills||null, availability||null, category||'general', district||null, bio||null, req.user.id]
    );
    ok(res, null, 'Updated');
  } catch { err(res, 'Failed', 500); }
};

exports.deactivate = async (req, res) => {
  await db.execute('UPDATE volunteers SET is_active=0 WHERE user_id=?', [req.user.id]);
  ok(res, null, 'Deactivated');
};

exports.getMyVolunteer = async (req, res) => {
  const [[row]] = await db.execute('SELECT * FROM volunteers WHERE user_id=?', [req.user.id]);
  row ? ok(res, row) : err(res, 'Not registered', 404);
};
