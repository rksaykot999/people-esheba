const bcrypt  = require('bcryptjs');
const db      = require('../config/db');
const { signToken } = require('../utils/jwt');
const { ok, err }   = require('../utils/response');

/* ── POST /auth/register ───────────────────────────────────── */
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, division, district, blood_group } = req.body;

    if (!name || !email || !password || !blood_group)
      return err(res, 'Name, email, password and blood group are required', 400);

    if (password.length < 6)
      return err(res, 'Password must be at least 6 characters', 400);

    const [[existing]] = await db.execute(
      'SELECT id FROM users WHERE email = ?', [email]
    );
    if (existing) return err(res, 'Email is already registered', 409);

    const hash = await bcrypt.hash(password, 12);
    const [result] = await db.execute(
      `INSERT INTO users (name, email, phone, password_hash, division, district)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name.trim(), email.toLowerCase().trim(), phone || null, hash, division || null, district || null]
    );

    const userId = result.insertId;
    if (blood_group) {
      await db.execute(
        `INSERT INTO blood_donors (user_id, blood_group, division, district, is_available)
         VALUES (?, ?, ?, ?, 1)`,
        [userId, blood_group, division || null, district || null]
      );
    }

    const [[user]] = await db.execute(
      'SELECT id, name, email, phone, role, avatar, division, district, is_verified, created_at FROM users WHERE id = ?',
      [userId]
    );

    const token = signToken({ id: user.id, role: user.role });
    return ok(res, { token, user }, 'Registration successful', 201);
  } catch (e) {
    console.error(e);
    return err(res, 'Registration failed', 500);
  }
};

/* ── POST /auth/login ──────────────────────────────────────── */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return err(res, 'Email and password required', 400);

    const [[user]] = await db.execute(
      'SELECT id, name, email, phone, role, avatar, division, district, is_verified, is_active, password_hash FROM users WHERE email = ?',
      [email.toLowerCase().trim()]
    );

    if (!user) return err(res, 'Invalid credentials', 401);
    if (!user.is_active) return err(res, 'Your account has been suspended', 403);

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return err(res, 'Invalid credentials', 401);

    const { password_hash, is_active, ...safeUser } = user;
    const token = signToken({ id: user.id, role: user.role });
    return ok(res, { token, user: safeUser }, 'Login successful');
  } catch (e) {
    console.error('[LOGIN ERROR]', e.message, e.stack);
    return err(res, 'Login failed', 500);
  }
};


/* ── GET /auth/me ──────────────────────────────────────────── */
exports.getMe = async (req, res) => {
  try {
    const [[user]] = await db.execute(
      'SELECT id, name, email, phone, role, avatar, division, district, upazila, is_verified, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    return ok(res, user);
  } catch {
    return err(res, 'Could not fetch user', 500);
  }
};
