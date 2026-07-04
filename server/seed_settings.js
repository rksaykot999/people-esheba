const mysql = require('mysql2/promise');

async function seed() {
  const c = await mysql.createConnection({
    host: 'people-e-sheba-people-e-sheba.c.aivencloud.com',
    port: 18004, user: 'avnadmin',
    password: 'AVNS_LXmaVTJsLwgbMwJ1gQF',
    database: 'people_e_sheba',
    ssl: { rejectUnauthorized: false }
  });

  const settings = [
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

  let count = 0;
  for (const [k, v] of settings) {
    await c.execute(
      `INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
      [k, v]
    );
    count++;
  }

  console.log(`Seeded ${count} site settings.`);
  
  // Verify
  const [rows] = await c.execute('SELECT setting_key, setting_value FROM site_settings');
  console.log('Current settings:');
  rows.forEach(r => console.log(` ${r.setting_key} = ${r.setting_value?.substring(0, 60)}`));
  
  await c.end();
}

seed().catch(e => console.error('Fatal:', e.message));
