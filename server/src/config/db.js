const mysql = require('mysql2/promise');
require('dotenv').config();


const dbConfig = {
  host:            process.env.DB_HOST,
  port:            process.env.DB_PORT || 18004,
  database:        process.env.DB_NAME,
  user:            process.env.DB_USER,
  password:        process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit:    2,
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
      console.error('❌ MySQL connection failed:', err.message);
      throw err;
    }
  })();
  
  return initPromise;
}

// Trigger init immediately on startup
initPool().catch(() => {});

module.exports = {
  query: async (...args) => (await initPool()).query(...args),
  execute: async (...args) => (await initPool()).execute(...args),
  getConnection: async () => (await initPool()).getConnection(),
  end: async () => (await initPool()).end()
};
