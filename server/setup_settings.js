require('dotenv').config();
const mysql = require('mysql2/promise');

async function run() {
  const c = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 18004,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
  });

  await c.execute(`
    CREATE TABLE IF NOT EXISTS site_settings (
      setting_key   VARCHAR(100) PRIMARY KEY,
      setting_value TEXT,
      updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB
  `);

  const defaults = [
    ['site_name', 'People E-Sheba'],
    ['contact_email', 'admin@peopleesheba.com'],
    ['contact_phone', '+880-1700-000000'],
    ['site_description', 'A community platform for service and donation.'],
    ['hero_title', 'Empowering Citizens'],
    ['hero_highlight', 'Connecting Communities'],
    ['hero_subtitle', 'Join the largest digital service platform in Bangladesh. Access emergency services, healthcare, jobs, and more — all in one place.'],
    ['hero_badge', 'Bangladesh No.1 Citizen Platform'],
    ['about_title', 'Essential support for citizens, organized in one place'],
    ['about_text', 'People E-Sheba is a comprehensive platform designed to bridge the gap between citizens and essential services across Bangladesh.'],
    ['cta_title', 'Join People E-Sheba Today'],
    ['cta_sub', 'Become part of a growing community helping each other with verified information and fast connections.'],
    ['stat_services', '500+'],
    ['stat_donors', '10K+'],
    ['stat_helped', '50K+'],
    ['footer_text', 'Empowering Bangladeshi citizens with fast, reliable, community-driven services.'],
    ['social_facebook', 'https://facebook.com/peopleesheba'],
    ['social_twitter', ''],
    ['maintenance_mode', '0'],
    ['registration_enabled', '1'],
  ];

  for (const [k, v] of defaults) {
    await c.execute(
      'INSERT IGNORE INTO site_settings (setting_key, setting_value) VALUES (?, ?)',
      [k, v]
    );
  }

  console.log('Done! site_settings table created and seeded with', defaults.length, 'settings.');
  await c.end();
}

run().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
