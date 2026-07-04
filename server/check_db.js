const mysql = require('mysql2/promise');

async function check() {
  const c = await mysql.createConnection({
    host: 'people-e-sheba-people-e-sheba.c.aivencloud.com',
    port: 18004, user: 'avnadmin',
    password: 'AVNS_LXmaVTJsLwgbMwJ1gQF',
    database: 'people_e_sheba',
    ssl: { rejectUnauthorized: false }
  });
  
  // Test the exact failing query
  try {
    const [r] = await c.execute(
      `SELECT j.*, u.name AS poster_name, u.is_verified AS poster_verified,
       (SELECT COUNT(*) FROM job_applications a WHERE a.job_id=j.id) AS applicants
       FROM jobs j JOIN users u ON j.user_id=u.id
       WHERE j.status = 'active' ORDER BY j.created_at DESC LIMIT 12 OFFSET 0`
    );
    console.log('Jobs query OK, count:', r.length);
  } catch(e) {
    console.log('Jobs query ERROR:', e.message);
  }
  
  try {
    const [jobs] = await c.execute('SELECT COUNT(*) as cnt FROM jobs');
    console.log('Total jobs in DB:', jobs[0].cnt);
  } catch(e) { console.log('Jobs table error:', e.message); }

  // Check the DB tables
  const tables = ['users','jobs','donations','blood_donors','volunteers','emergency_services','doctors','pharmacies','notices','education_institutions','scholarships','site_settings'];
  for(const t of tables) {
    try {
      const [[{cnt}]] = await c.execute(`SELECT COUNT(*) as cnt FROM ${t}`);
      console.log(`  ${t}: ${cnt} rows`);
    } catch(e) {
      console.log(`  ${t}: ERROR - ${e.message}`);
    }
  }
  
  await c.end();
}

check().catch(e => console.error('Fatal:', e.message));
