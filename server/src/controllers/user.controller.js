const bcrypt = require('bcryptjs');
const db     = require('../config/db');
const { ok, err } = require('../utils/response');

/* ── GET /users/profile ───────────────────────────────────── */
exports.getProfile = async (req, res) => {
  const [[user]] = await db.execute(
    'SELECT id, name, email, phone, role, avatar, division, district, upazila, is_verified, created_at FROM users WHERE id = ?',
    [req.user.id]
  );
  ok(res, user);
};

/* ── PUT /users/profile ───────────────────────────────────── */
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, division, district, upazila } = req.body;
    await db.execute(
      'UPDATE users SET name=?, phone=?, division=?, district=?, upazila=? WHERE id=?',
      [name, phone || null, division || null, district || null, upazila || null, req.user.id]
    );
    const [[user]] = await db.execute(
      'SELECT id, name, email, phone, role, avatar, division, district, upazila, is_verified FROM users WHERE id = ?',
      [req.user.id]
    );
    ok(res, user, 'Profile updated');
  } catch {
    err(res, 'Update failed', 500);
  }
};

/* ── DELETE /users/profile ────────────────────────────────── */
exports.deleteProfile = async (req, res) => {
  try {
    await db.execute('DELETE FROM users WHERE id=?', [req.user.id]);
    ok(res, null, 'Account deleted successfully');
  } catch {
    err(res, 'Account deletion failed', 500);
  }
};

/* ── POST /users/avatar ───────────────────────────────────── */
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return err(res, 'No file uploaded', 400);
    const path = `/uploads/avatars/${req.file.filename}`;
    await db.execute('UPDATE users SET avatar=? WHERE id=?', [path, req.user.id]);
    ok(res, { avatar: path }, 'Avatar updated');
  } catch {
    err(res, 'Avatar upload failed', 500);
  }
};

/* ── PUT /users/password ──────────────────────────────────── */
exports.changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) return err(res, 'Both fields required', 400);
    if (new_password.length < 6) return err(res, 'Password too short', 400);

    const [[user]] = await db.execute('SELECT password_hash FROM users WHERE id=?', [req.user.id]);
    const valid = await bcrypt.compare(current_password, user.password_hash);
    if (!valid) return err(res, 'Current password is incorrect', 400);

    const hash = await bcrypt.hash(new_password, 12);
    await db.execute('UPDATE users SET password_hash=? WHERE id=?', [hash, req.user.id]);
    ok(res, null, 'Password changed successfully');
  } catch {
    err(res, 'Password change failed', 500);
  }
};

/* ── GET /users/notifications ─────────────────────────────── */
exports.getNotifications = async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 30',
      [req.user.id]
    );
    ok(res, rows);
  } catch {
    err(res, 'Failed to fetch notifications', 500);
  }
};

/* ── PUT /users/notifications/read ───────────────────────── */
exports.markNotificationsRead = async (req, res) => {
  await db.execute('UPDATE notifications SET is_read=1 WHERE user_id=?', [req.user.id]);
  ok(res, null, 'Marked as read');
};

/* ── GET /users/bookmarks ─────────────────────────────────── */
exports.getBookmarks = async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM bookmarks WHERE user_id=? ORDER BY created_at DESC',
      [req.user.id]
    );
    ok(res, rows);
  } catch {
    err(res, 'Failed', 500);
  }
};

/* ── POST /users/bookmarks ────────────────────────────────── */
exports.toggleBookmark = async (req, res) => {
  try {
    const { entity_type, entity_id } = req.body;
    const [[existing]] = await db.execute(
      'SELECT id FROM bookmarks WHERE user_id=? AND entity_type=? AND entity_id=?',
      [req.user.id, entity_type, entity_id]
    );
    if (existing) {
      await db.execute('DELETE FROM bookmarks WHERE id=?', [existing.id]);
      return ok(res, { bookmarked: false }, 'Bookmark removed');
    }
    await db.execute(
      'INSERT INTO bookmarks (user_id, entity_type, entity_id) VALUES (?,?,?)',
      [req.user.id, entity_type, entity_id]
    );
    ok(res, { bookmarked: true }, 'Bookmarked');
  } catch {
    err(res, 'Bookmark failed', 500);
  }
};
