const db = require('../config/db');
const { ok, err } = require('../utils/response');
const { getPagination, runPaginated } = require('../utils/pagination');

exports.getAll = async (req, res) => {
  try {
    const { type, district, division, search } = req.query;
    const { page, limit } = getPagination(req.query, 20);
    let   where  = ['1=1'];
    const params = [];

    if (type)     { where.push('e.type = ?');              params.push(type); }
    if (district) { where.push('e.district LIKE ?');       params.push(`%${district}%`); }
    if (division) { where.push('e.division LIKE ?');       params.push(`%${division}%`); }
    if (search)   { where.push('e.name LIKE ?');           params.push(`%${search}%`); }

    const cond = where.join(' AND ');
    const result = await runPaginated(
      db,
      `SELECT e.*, u.name AS added_by
       FROM emergency_services e
       LEFT JOIN users u ON e.created_by = u.id
       WHERE ${cond}
       ORDER BY e.is_verified DESC, e.name ASC`,
      `SELECT COUNT(*) AS total FROM emergency_services e WHERE ${cond}`,
      params,
      { page, limit }
    );

    ok(res, result);
  } catch (e) {
    err(res, 'Failed to fetch services', 500);
  }
};

exports.getOne = async (req, res) => {
  const [[row]] = await db.execute('SELECT * FROM emergency_services WHERE id=?', [req.params.id]);
  row ? ok(res, row) : err(res, 'Not found', 404);
};

exports.create = async (req, res) => {
  try {
    const { name, type, address, division, district, upazila, phone, latitude, longitude, is_24h } = req.body;
    if (!name || !type) return err(res, 'Name and type required', 400);

    const [r] = await db.execute(
      `INSERT INTO emergency_services (name,type,address,division,district,upazila,phone,latitude,longitude,is_24h,created_by)
       VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [name, type, address||null, division||null, district||null, upazila||null, phone||null,
       latitude||null, longitude||null, is_24h||0, req.user.id]
    );
    const [[row]] = await db.execute('SELECT * FROM emergency_services WHERE id=?', [r.insertId]);
    ok(res, row, 'Service added', 201);
  } catch {
    err(res, 'Failed to create service', 500);
  }
};

exports.update = async (req, res) => {
  try {
    const { name, type, address, division, district, upazila, phone, latitude, longitude, is_24h, is_verified } = req.body;
    await db.execute(
      `UPDATE emergency_services SET name=?,type=?,address=?,division=?,district=?,upazila=?,phone=?,
       latitude=?,longitude=?,is_24h=?,is_verified=? WHERE id=?`,
      [name,type,address||null,division||null,district||null,upazila||null,phone||null,
       latitude||null,longitude||null,is_24h||0,is_verified||0, req.params.id]
    );
    ok(res, null, 'Updated');
  } catch {
    err(res, 'Update failed', 500);
  }
};

exports.remove = async (req, res) => {
  await db.execute('DELETE FROM emergency_services WHERE id=?', [req.params.id]);
  ok(res, null, 'Deleted');
};

exports.getSOS = async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM sos_contacts WHERE is_active=1 ORDER BY id');
  ok(res, rows);
};
