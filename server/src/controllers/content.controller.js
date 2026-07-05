// ── controllers/content.controller.js ─────────────────────────
// Handles: Doctors, Pharmacies, Notices, Education, Scholarships
const db = require('../config/db');
const { ok, err } = require('../utils/response');

/* ═══════════════════════ DOCTORS ═══════════════════════════ */

exports.getDoctors = async (req, res) => {
  try {
    const { search, specialty, district, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = ['is_active = 1'];
    const params = [];
    if (search) { where.push('(name LIKE ? OR specialty LIKE ? OR area LIKE ?)'); params.push(`%${search}%`, `%${search}%`, `%${search}%`); }
    if (specialty) { where.push('specialty = ?'); params.push(specialty); }
    if (district)  { where.push('district = ?');  params.push(district); }
    const [rows] = await db.execute(
      `SELECT * FROM doctors WHERE ${where.join(' AND ')} ORDER BY is_verified DESC, rating DESC, created_at DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`,
      params
    );
    const [[{ total }]] = await db.execute(`SELECT COUNT(*) AS total FROM doctors WHERE ${where.join(' AND ')}`, params);
    ok(res, { rows, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (e) { console.error(e); err(res, 'Failed', 500); }
};

exports.getDoctorById = async (req, res) => {
  const [[row]] = await db.execute('SELECT * FROM doctors WHERE id=? AND is_active=1', [req.params.id]);
  if (!row) return err(res, 'Not found', 404);
  ok(res, row);
};

/* ═══════════════════════ PHARMACIES ═════════════════════════ */

exports.getPharmacies = async (req, res) => {
  try {
    const { search, district, is_24h, type, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = ['is_active = 1'];
    const params = [];
    if (search)  { where.push('(name LIKE ? OR area LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }
    if (district){ where.push('district = ?'); params.push(district); }
    if (is_24h)  { where.push('is_24h = 1'); }
    if (type)    { where.push('type = ?'); params.push(type); }
    const [rows] = await db.execute(
      `SELECT * FROM pharmacies WHERE ${where.join(' AND ')} ORDER BY is_verified DESC, is_24h DESC, created_at DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`,
      params
    );
    const [[{ total }]] = await db.execute(`SELECT COUNT(*) AS total FROM pharmacies WHERE ${where.join(' AND ')}`, params);
    ok(res, { rows, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (e) { console.error(e); err(res, 'Failed', 500); }
};

/* ═══════════════════════ NOTICES ════════════════════════════ */

exports.getNotices = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = ['is_active = 1'];
    const params = [];
    if (search)   { where.push('(title LIKE ? OR source LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }
    if (category) { where.push('category = ?'); params.push(category); }
    const [rows] = await db.execute(
      `SELECT * FROM notices WHERE ${where.join(' AND ')} ORDER BY created_at DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`,
      params
    );
    const [[{ total }]] = await db.execute(`SELECT COUNT(*) AS total FROM notices WHERE ${where.join(' AND ')}`, params);
    ok(res, { rows, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (e) { console.error(e); err(res, 'Failed', 500); }
};

/* ═══════════════════════ EDUCATION ═══════════════════════════ */

exports.getEducation = async (req, res) => {
  try {
    const { search, type, subtype, district, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = ['is_active = 1'];
    const params = [];
    if (search)   { where.push('(name LIKE ? OR address LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }
    if (type)     { where.push('type = ?');     params.push(type); }
    if (subtype)  { where.push('subtype = ?');  params.push(subtype); }
    if (district) { where.push('district = ?'); params.push(district); }
    const [rows] = await db.execute(
      `SELECT * FROM education_institutions WHERE ${where.join(' AND ')} ORDER BY is_verified DESC, created_at DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`,
      params
    );
    const [[{ total }]] = await db.execute(`SELECT COUNT(*) AS total FROM education_institutions WHERE ${where.join(' AND ')}`, params);
    ok(res, { rows, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (e) { console.error(e); err(res, 'Failed', 500); }
};

/* ═══════════════════════ SCHOLARSHIPS ════════════════════════ */

exports.getScholarships = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = ['is_active = 1'];
    const params = [];
    if (search)   { where.push('(title LIKE ? OR provider LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }
    if (category) { where.push('category = ?'); params.push(category); }
    const [rows] = await db.execute(
      `SELECT * FROM scholarships WHERE ${where.join(' AND ')} ORDER BY deadline ASC, created_at DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`,
      params
    );
    const [[{ total }]] = await db.execute(`SELECT COUNT(*) AS total FROM scholarships WHERE ${where.join(' AND ')}`, params);
    ok(res, { rows, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (e) { console.error(e); err(res, 'Failed', 500); }
};

/* ═══════════════════ ADMIN — DOCTORS ═══════════════════════ */
exports.adminGetDoctors = async (req, res) => {
  try {
    const { search, specialty, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = ['1=1']; const params = [];
    if (search)    { where.push('(name LIKE ? OR specialty LIKE ? OR area LIKE ?)'); params.push(`%${search}%`, `%${search}%`, `%${search}%`); }
    if (specialty) { where.push('specialty = ?'); params.push(specialty); }
    const [rows] = await db.execute(`SELECT * FROM doctors WHERE ${where.join(' AND ')} ORDER BY created_at DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`, params);
    const [[{ total }]] = await db.execute(`SELECT COUNT(*) AS total FROM doctors WHERE ${where.join(' AND ')}`, params);
    ok(res, { rows, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch { err(res, 'Failed', 500); }
};
exports.adminCreateDoctor = async (req, res) => {
  try {
    const { name, specialty, area, district, division, phone, hours, rating, is_verified } = req.body;
    if (!name || !specialty) return err(res, 'Name and specialty required', 400);
    const [r] = await db.execute(
      'INSERT INTO doctors (name,specialty,area,district,division,phone,hours,rating,is_verified,created_by) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [name, specialty, area||null, district||null, division||null, phone||null, hours||null, rating||0, is_verified?1:0, req.user.id]
    );
    const [[row]] = await db.execute('SELECT * FROM doctors WHERE id=?', [r.insertId]);
    ok(res, row, 'Created', 201);
  } catch { err(res, 'Failed', 500); }
};
exports.adminUpdateDoctor = async (req, res) => {
  try {
    const { name, specialty, area, district, division, phone, hours, rating, is_verified, is_active } = req.body;
    await db.execute('UPDATE doctors SET name=?,specialty=?,area=?,district=?,division=?,phone=?,hours=?,rating=?,is_verified=?,is_active=? WHERE id=?',
      [name, specialty, area||null, district||null, division||null, phone||null, hours||null, rating||0, is_verified?1:0, is_active!==false?1:0, req.params.id]);
    ok(res, null, 'Updated');
  } catch { err(res, 'Failed', 500); }
};
exports.adminDeleteDoctor = async (req, res) => {
  await db.execute('DELETE FROM doctors WHERE id=?', [req.params.id]);
  ok(res, null, 'Deleted');
};

/* ═══════════════════ ADMIN — PHARMACIES ════════════════════ */
exports.adminGetPharmacies = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = ['1=1']; const params = [];
    if (search) { where.push('(name LIKE ? OR area LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }
    const [rows] = await db.execute(`SELECT * FROM pharmacies WHERE ${where.join(' AND ')} ORDER BY created_at DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`, params);
    const [[{ total }]] = await db.execute(`SELECT COUNT(*) AS total FROM pharmacies WHERE ${where.join(' AND ')}`, params);
    ok(res, { rows, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch { err(res, 'Failed', 500); }
};
exports.adminCreatePharmacy = async (req, res) => {
  try {
    const { name, area, district, division, phone, hours, type, is_24h, is_verified } = req.body;
    if (!name) return err(res, 'Name required', 400);
    const [r] = await db.execute('INSERT INTO pharmacies (name,area,district,division,phone,hours,type,is_24h,is_verified,created_by) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [name, area||null, district||null, division||null, phone||null, hours||null, type||'retail', is_24h?1:0, is_verified?1:0, req.user.id]);
    const [[row]] = await db.execute('SELECT * FROM pharmacies WHERE id=?', [r.insertId]);
    ok(res, row, 'Created', 201);
  } catch { err(res, 'Failed', 500); }
};
exports.adminUpdatePharmacy = async (req, res) => {
  try {
    const { name, area, district, division, phone, hours, type, is_24h, is_verified, is_active } = req.body;
    await db.execute('UPDATE pharmacies SET name=?,area=?,district=?,division=?,phone=?,hours=?,type=?,is_24h=?,is_verified=?,is_active=? WHERE id=?',
      [name, area||null, district||null, division||null, phone||null, hours||null, type||'retail', is_24h?1:0, is_verified?1:0, is_active!==false?1:0, req.params.id]);
    ok(res, null, 'Updated');
  } catch { err(res, 'Failed', 500); }
};
exports.adminDeletePharmacy = async (req, res) => {
  await db.execute('DELETE FROM pharmacies WHERE id=?', [req.params.id]);
  ok(res, null, 'Deleted');
};

/* ════════════════════ ADMIN — NOTICES ══════════════════════ */
exports.adminGetNotices = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = ['1=1']; const params = [];
    if (search)   { where.push('title LIKE ?'); params.push(`%${search}%`); }
    if (category) { where.push('category = ?'); params.push(category); }
    const [rows] = await db.execute(
      `SELECT n.*, u.name AS creator_name FROM notices n LEFT JOIN users u ON n.created_by=u.id WHERE ${where.join(' AND ')} ORDER BY n.created_at DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`, params);
    const [[{ total }]] = await db.execute(`SELECT COUNT(*) AS total FROM notices n WHERE ${where.join(' AND ')}`, params);
    ok(res, { rows, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch { err(res, 'Failed', 500); }
};
exports.adminCreateNotice = async (req, res) => {
  try {
    const { title, category, source, link, description, is_urgent, is_active } = req.body;
    if (!title) return err(res, 'Title required', 400);
    const [r] = await db.execute('INSERT INTO notices (title,category,source,link,description,is_urgent,is_active,created_by) VALUES (?,?,?,?,?,?,?,?)',
      [title, category||'general', source||null, link||null, description||null, is_urgent?1:0, is_active!==false?1:0, req.user.id]);
    const [[row]] = await db.execute('SELECT * FROM notices WHERE id=?', [r.insertId]);
    ok(res, row, 'Created', 201);
  } catch { err(res, 'Failed', 500); }
};
exports.adminUpdateNotice = async (req, res) => {
  try {
    const { title, category, source, link, description, is_urgent, is_active } = req.body;
    await db.execute('UPDATE notices SET title=?,category=?,source=?,link=?,description=?,is_urgent=?,is_active=? WHERE id=?',
      [title, category||'general', source||null, link||null, description||null, is_urgent?1:0, is_active?1:0, req.params.id]);
    ok(res, null, 'Updated');
  } catch { err(res, 'Failed', 500); }
};
exports.adminDeleteNotice = async (req, res) => {
  await db.execute('DELETE FROM notices WHERE id=?', [req.params.id]);
  ok(res, null, 'Deleted');
};

/* ═══════════════════ ADMIN — EDUCATION ═════════════════════ */
exports.adminGetEducation = async (req, res) => {
  try {
    const { search, type, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = ['1=1']; const params = [];
    if (search) { where.push('name LIKE ?'); params.push(`%${search}%`); }
    if (type)   { where.push('type = ?'); params.push(type); }
    const [rows] = await db.execute(`SELECT * FROM education_institutions WHERE ${where.join(' AND ')} ORDER BY created_at DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`, params);
    const [[{ total }]] = await db.execute(`SELECT COUNT(*) AS total FROM education_institutions WHERE ${where.join(' AND ')}`, params);
    ok(res, { rows, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch { err(res, 'Failed', 500); }
};
exports.adminCreateEducation = async (req, res) => {
  try {
    const { name, type, subtype, district, division, address, phone, website, description, is_verified } = req.body;
    if (!name) return err(res, 'Name required', 400);
    const [r] = await db.execute('INSERT INTO education_institutions (name,type,subtype,district,division,address,phone,website,description,is_verified,created_by) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
      [name, type||'school', subtype||'other', district||null, division||null, address||null, phone||null, website||null, description||null, is_verified?1:0, req.user.id]);
    const [[row]] = await db.execute('SELECT * FROM education_institutions WHERE id=?', [r.insertId]);
    ok(res, row, 'Created', 201);
  } catch { err(res, 'Failed', 500); }
};
exports.adminUpdateEducation = async (req, res) => {
  try {
    const { name, type, subtype, district, division, address, phone, website, description, is_verified, is_active } = req.body;
    await db.execute('UPDATE education_institutions SET name=?,type=?,subtype=?,district=?,division=?,address=?,phone=?,website=?,description=?,is_verified=?,is_active=? WHERE id=?',
      [name, type||'school', subtype||'other', district||null, division||null, address||null, phone||null, website||null, description||null, is_verified?1:0, is_active!==false?1:0, req.params.id]);
    ok(res, null, 'Updated');
  } catch { err(res, 'Failed', 500); }
};
exports.adminDeleteEducation = async (req, res) => {
  await db.execute('DELETE FROM education_institutions WHERE id=?', [req.params.id]);
  ok(res, null, 'Deleted');
};

/* ═══════════════════ ADMIN — SCHOLARSHIPS ══════════════════ */
exports.adminGetScholarships = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = ['1=1']; const params = [];
    if (search)   { where.push('(title LIKE ? OR provider LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }
    if (category) { where.push('category = ?'); params.push(category); }
    const [rows] = await db.execute(`SELECT * FROM scholarships WHERE ${where.join(' AND ')} ORDER BY created_at DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`, params);
    const [[{ total }]] = await db.execute(`SELECT COUNT(*) AS total FROM scholarships WHERE ${where.join(' AND ')}`, params);
    ok(res, { rows, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch { err(res, 'Failed', 500); }
};
exports.adminCreateScholarship = async (req, res) => {
  try {
    const { title, provider, deadline, amount, link, description, category, is_active } = req.body;
    if (!title) return err(res, 'Title required', 400);
    const [r] = await db.execute('INSERT INTO scholarships (title,provider,deadline,amount,link,description,category,is_active,created_by) VALUES (?,?,?,?,?,?,?,?,?)',
      [title, provider||null, deadline||null, amount||null, link||null, description||null, category||'general', is_active!==false?1:0, req.user.id]);
    const [[row]] = await db.execute('SELECT * FROM scholarships WHERE id=?', [r.insertId]);
    ok(res, row, 'Created', 201);
  } catch { err(res, 'Failed', 500); }
};
exports.adminUpdateScholarship = async (req, res) => {
  try {
    const { title, provider, deadline, amount, link, description, category, is_active } = req.body;
    await db.execute('UPDATE scholarships SET title=?,provider=?,deadline=?,amount=?,link=?,description=?,category=?,is_active=? WHERE id=?',
      [title, provider||null, deadline||null, amount||null, link||null, description||null, category||'general', is_active?1:0, req.params.id]);
    ok(res, null, 'Updated');
  } catch { err(res, 'Failed', 500); }
};
exports.adminDeleteScholarship = async (req, res) => {
  await db.execute('DELETE FROM scholarships WHERE id=?', [req.params.id]);
  ok(res, null, 'Deleted');
};

