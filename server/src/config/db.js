const mysql = require('mysql2/promise');
require('dotenv').config();


const dbConfig = {
  host:            process.env.DB_HOST,
  port:            process.env.DB_PORT || 18004,
  database:        process.env.DB_NAME,
  user:            process.env.DB_USER,
  password:        process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit:    20,
  queueLimit:         0,
  enableKeepAlive:    true,
  keepAliveInitialDelay: 0,
  ssl: {
    rejectUnauthorized: false
  }
};

let activePool = null;
let initPromise = null;

async function initPool() {
  if (activePool) return activePool;
  if (initPromise) return initPromise;
  
  initPromise = (async () => {
    try {
      const pool = mysql.createPool(dbConfig);
      const conn = await pool.getConnection();
      console.log(`✅ Connected to LIVE MySQL Database (${dbConfig.host})`);
      conn.release();
      activePool = pool;
      return pool;
    } catch (err) {
      console.error('❌ MySQL connection failed:', err.stack || err.message);
      // Reset so a later request can retry instead of being stuck with a
      // permanently-rejected cached promise.
      initPromise = null;
      throw err;
    }
  })();

  return initPromise;
}

// Trigger init immediately on startup. We swallow the rejection here only to
// avoid an unhandled-rejection crash at boot — the error is already logged
// inside initPool, and any subsequent query will retry and surface the error.
initPool().catch(() => {});

module.exports = {
  query: async (...args) => (await initPool()).query(...args),
  execute: async (...args) => (await initPool()).execute(...args),
  getConnection: async () => (await initPool()).getConnection(),
  end: async () => (await initPool()).end()
};
