const db = require('../config/db');
const { ok, err } = require('../utils/response');
const { getPagination, runPaginated } = require('../utils/pagination');

const ALLOWED_CATEGORIES = ['hospital', 'service', 'government', 'finance'];

function assertCategory(category) {
  return ALLOWED_CATEGORIES.includes(category);
}

/* ── Public: list listings for one category ─────────────────── */
exports.getAll = async (req, res) => {
  try {
    const { category, subtype, district, division, search } = req.query;
    if (!category || !assertCategory(category)) {
      return err(res, `category is required and must be one of ${ALLOWED_CATEGORIES.join(', ')}`, 400);
    }

    const { page, limit } = getPagination(req.query, 40);
    const where  = ['d.category = ?', 'd.is_active = 1'];
    const params = [category];

    if (subtype)  { where.push('d.subtype = ?');    params.push(subtype); }
    if (district) { where.push('d.district LIKE ?'); params.push(`%${district}%`); }
    if (division) { where.push('d.division LIKE ?'); params.push(`%${division}%`); }
    if (search)   { where.push('(d.name LIKE ? OR d.area LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }

    const cond = where.join(' AND ');
    const result = await runPaginated(
      db,
      `SELECT d.* FROM directory_listings d
       WHERE ${cond}
       ORDER BY d.is_verified DESC, d.rating DESC, d.name ASC`,
      `SELECT COUNT(*) AS total FROM directory_listings d WHERE ${cond}`,
      params,
      { page, limit }
    );

    ok(res, result);
  } catch (e) {
    err(res, 'Failed to fetch listings', 500);
  }
};

exports.getOne = async (req, res) => {
  const [[row]] = await db.execute('SELECT * FROM directory_listings WHERE id=?', [req.params.id]);
  row ? ok(res, row) : err(res, 'Not found', 404);
};

/* ── Admin: full CRUD across all categories ──────────────────── */
exports.adminGetAll = async (req, res) => {
  try {
    const { category, search } = req.query;
    const { page, limit } = getPagination(req.query, 20);
    const where  = ['1=1'];
    const params = [];

    if (category && assertCategory(category)) { where.push('category = ?'); params.push(category); }
    if (search) { where.push('name LIKE ?'); params.push(`%${search}%`); }

    const cond = where.join(' AND ');
    const result = await runPaginated(
      db,
      `SELECT * FROM directory_listings WHERE ${cond}
       ORDER BY created_at DESC`,
      `SELECT COUNT(*) AS total FROM directory_listings WHERE ${cond}`,
      params,
      { page, limit }
    );
    ok(res, result);
  } catch (e) {
    err(res, 'Failed to fetch listings', 500);
  }
};

exports.adminCreate = async (req, res) => {
  try {
    const {
      category, subtype, name, description, area, district, division,
      address, phone, website, rating, badge_key, price_info, features, is_verified,
    } = req.body;

    if (!category || !assertCategory(category)) return err(res, 'Valid category is required', 400);
    if (!name) return err(res, 'Name is required', 400);

    const [r] = await db.execute(
      `INSERT INTO directory_listings
       (category, subtype, name, description, area, district, division, address, phone, website, rating, badge_key, price_info, features, is_verified, created_by)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [category, subtype || 'other', name, description || null, area || null, district || null,
       division || null, address || null, phone || null, website || null, rating || 0,
       badge_key || null, price_info || null, features || null, is_verified ? 1 : 0, req.user.id]
    );
    const [[row]] = await db.execute('SELECT * FROM directory_listings WHERE id=?', [r.insertId]);
    ok(res, row, 'Listing created', 201);
  } catch (e) {
    err(res, 'Failed to create listing', 500);
  }
};

exports.adminUpdate = async (req, res) => {
  try {
    const {
      category, subtype, name, description, area, district, division,
      address, phone, website, rating, badge_key, price_info, features, is_verified, is_active,
    } = req.body;

    if (category && !assertCategory(category)) return err(res, 'Invalid category', 400);

    await db.execute(
      `UPDATE directory_listings SET
        category=COALESCE(?,category), subtype=?, name=?, description=?, area=?, district=?,
        division=?, address=?, phone=?, website=?, rating=?, badge_key=?, price_info=?, features=?, is_verified=?, is_active=?
       WHERE id=?`,
      [category || null, subtype || 'other', name, description || null, area || null, district || null,
       division || null, address || null, phone || null, website || null, rating || 0,
       badge_key || null, price_info || null, features || null, is_verified ? 1 : 0, is_active === undefined ? 1 : (is_active ? 1 : 0),
       req.params.id]
    );
    ok(res, null, 'Listing updated');
  } catch (e) {
    err(res, 'Failed to update listing', 500);
  }
};

exports.adminRemove = async (req, res) => {
  await db.execute('DELETE FROM directory_listings WHERE id=?', [req.params.id]);
  ok(res, null, 'Listing deleted');
};
