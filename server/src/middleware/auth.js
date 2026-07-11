const { verifyToken }  = require('../utils/jwt');
const { err }          = require('../utils/response');
const db               = require('../config/db');
const asyncHandler     = require('../utils/asyncHandler');

/* ── Authenticate any logged-in user ─────────────────────── */
const protectHandler = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer '))
    return err(res, 'No token provided', 401);

  const token = header.split(' ')[1];

  // Only token verification failures should map to a 401. Any other error
  // (e.g. a database failure) must propagate so it is not masked as an
  // authentication problem.
  let decoded;
  try {
    decoded = verifyToken(token);
  } catch {
    return err(res, 'Invalid or expired token', 401);
  }

  const [[user]] = await db.execute(
    'SELECT id, name, email, role, is_active FROM users WHERE id = ?',
    [decoded.id]
  );
  if (!user)            return err(res, 'User not found', 401);
  if (!user.is_active)  return err(res, 'Account is suspended', 403);

  req.user = user;
  next();
};

// Wrap so DB / unexpected errors are forwarded to the global error handler
// instead of surfacing as an unhandled promise rejection.
const protect = asyncHandler(protectHandler);

/* ── Admin only ──────────────────────────────────────────── */
const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin')
    return err(res, 'Admin access required', 403);
  next();
};

module.exports = { protect, adminOnly };
