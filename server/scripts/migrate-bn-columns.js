/**
 * Idempotent migration: adds Bengali (_bn) columns for dual-language support.
 *
 * Safe to run multiple times and safe to run directly against the live
 * Aiven database — it checks INFORMATION_SCHEMA before adding each column,
 * so it will never error or duplicate a column that already exists.
 *
 * Usage:
 *   cd server
 *   node scripts/migrate-bn-columns.js
 */
const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 18004,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
};

// table -> [{ column, definition }]
const BN_COLUMNS = {
  doctors: [
    { column: 'name_bn', definition: 'VARCHAR(200) NULL AFTER name' },
    { column: 'specialty_bn', definition: 'VARCHAR(100) NULL AFTER specialty' },
    { column: 'area_bn', definition: 'VARCHAR(100) NULL AFTER area' },
  ],
  pharmacies: [
    { column: 'name_bn', definition: 'VARCHAR(200) NULL AFTER name' },
    { column: 'area_bn', definition: 'VARCHAR(100) NULL AFTER area' },
  ],
  notices: [
    { column: 'title_bn', definition: 'VARCHAR(300) NULL AFTER title' },
    { column: 'description_bn', definition: 'TEXT NULL AFTER description' },
  ],
  education_institutions: [
    { column: 'name_bn', definition: 'VARCHAR(200) NULL AFTER name' },
    { column: 'address_bn', definition: 'VARCHAR(255) NULL AFTER address' },
    { column: 'description_bn', definition: 'TEXT NULL AFTER description' },
  ],
  scholarships: [
    { column: 'title_bn', definition: 'VARCHAR(300) NULL AFTER title' },
    { column: 'provider_bn', definition: 'VARCHAR(200) NULL AFTER provider' },
    { column: 'description_bn', definition: 'TEXT NULL AFTER description' },
  ],
  jobs: [
    { column: 'title_bn', definition: 'VARCHAR(200) NULL AFTER title' },
    { column: 'company_bn', definition: 'VARCHAR(150) NULL AFTER company' },
    { column: 'description_bn', definition: 'TEXT NULL AFTER description' },
  ],
  emergency_services: [
    { column: 'name_bn', definition: 'VARCHAR(150) NULL AFTER name' },
    { column: 'address_bn', definition: 'VARCHAR(255) NULL AFTER address' },
  ],
};

async function columnExists(conn, table, column) {
  const [rows] = await conn.execute(
    `SELECT COUNT(*) AS cnt FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [dbConfig.database, table, column]
  );
  return rows[0].cnt > 0;
}

async function tableExists(conn, table) {
  const [rows] = await conn.execute(
    `SELECT COUNT(*) AS cnt FROM INFORMATION_SCHEMA.TABLES
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
    [dbConfig.database, table]
  );
  return rows[0].cnt > 0;
}

async function run() {
  console.log(`Connecting to ${dbConfig.host}:${dbConfig.port}/${dbConfig.database} ...`);
  const conn = await mysql.createConnection(dbConfig);

  let added = 0;
  let skipped = 0;
  let missingTables = 0;

  try {
    for (const [table, columns] of Object.entries(BN_COLUMNS)) {
      if (!(await tableExists(conn, table))) {
        console.log(`⚠  Table "${table}" does not exist — skipping.`);
        missingTables++;
        continue;
      }

      for (const { column, definition } of columns) {
        const exists = await columnExists(conn, table, column);
        if (exists) {
          console.log(`•  ${table}.${column} already exists — skipping`);
          skipped++;
          continue;
        }
        const sql = `ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`;
        await conn.execute(sql);
        console.log(`✓  Added ${table}.${column}`);
        added++;
      }
    }

    console.log('\n──────────────────────────────');
    console.log(`Done. Added: ${added}, already existed: ${skipped}, missing tables: ${missingTables}`);
  } finally {
    await conn.end();
  }
}

run().catch((e) => {
  console.error('Migration failed:', e.message);
  process.exit(1);
});
