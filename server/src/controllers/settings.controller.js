const db = require('../config/db');
const { ok, err } = require('../utils/response');

/* ── GET /settings ─────────────────────────────────────────── */
// Returns all site settings as a flat key-value object
exports.getSettings = async (req, res) => {
  const [rows] = await db.execute('SELECT setting_key, setting_value FROM site_settings');
  const settings = {};
  rows.forEach(r => { settings[r.setting_key] = r.setting_value; });
  ok(res, settings);
};

/* ── PUT /admin/settings ───────────────────────────────────── */
// Upserts multiple settings from body { key: value, ... }
exports.updateSettings = async (req, res) => {
  const updates = req.body; // expected: { hero_title: '...', hero_subtitle: '...', ... }
  if (!updates || typeof updates !== 'object') return err(res, 'Invalid data', 400);

  const entries = Object.entries(updates);
  if (entries.length === 0) return err(res, 'No settings provided', 400);

  for (const [key, value] of entries) {
    await db.execute(
      `INSERT INTO site_settings (setting_key, setting_value)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
      [key, value === null || value === undefined ? null : String(value)]
    );
  }

  ok(res, null, `Updated ${entries.length} settings`);
};
