const { verifyToken }  = require('../utils/jwt');
const { err }          = require('../utils/response');
const db               = require('../config/db');

/* ── Authenticate any logged-in user ─────────────────────── */
const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer '))
      return err(res, 'No token provided', 401);

    const token   = header.split(' ')[1];
    const decoded = verifyToken(token);

    const [[user]] = await db.execute(
      'SELECT id, name, email, role, is_active FROM users WHERE id = ?',
      [decoded.id]
    );
    if (!user)            return err(res, 'User not found', 401);
    if (!user.is_active)  return err(res, 'Account is suspended', 403);

    req.user = user;
    next();
  } catch {
    return err(res, 'Invalid or expired token', 401);
  }
};

/* ── Admin only ──────────────────────────────────────────── */
const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin')
    return err(res, 'Admin access required', 403);
  next();
};

module.exports = { protect, adminOnly };
