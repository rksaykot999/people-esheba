const mysql = require('mysql2/promise');
require('dotenv').config();

const localConfig = {
  host:            process.env.DB_HOST     || 'localhost',
  port:            process.env.DB_PORT     || 3306,
  database:        process.env.DB_NAME     || 'people_esheba',
  user:            process.env.DB_USER     || 'root',
  password:        process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit:    20,
  queueLimit:         0,
  enableKeepAlive:    true,
  keepAliveInitialDelay: 0,
};

const liveConfig = {
  host:            process.env.LIVE_DB_HOST,
  port:            process.env.LIVE_DB_PORT     || 3306,
  database:        process.env.LIVE_DB_NAME,
  user:            process.env.LIVE_DB_USER,
  password:        process.env.LIVE_DB_PASSWORD,
  waitForConnections: true,
  connectionLimit:    20,
  queueLimit:         0,
  enableKeepAlive:    true,
  keepAliveInitialDelay: 0,
};

let activePool = null;
let initPromise = null;

async function initPool() {
  if (activePool) return activePool;
  if (initPromise) return initPromise;
  
  initPromise = (async () => {
    // Try local
    try {
      const pool = mysql.createPool(localConfig);
      const conn = await pool.getConnection();
      console.log('✅ Connected to LOCAL MySQL Database');
      conn.release();
      activePool = pool;
      return pool;
    } catch (err) {
      console.log('⚠️ Local MySQL failed, trying LIVE Database...');
      try {
        const pool = mysql.createPool(liveConfig);
        const conn = await pool.getConnection();
        console.log('✅ Connected to LIVE MySQL Database');
        conn.release();
        activePool = pool;
        return pool;
      } catch (liveErr) {
        console.error('❌ Both Local and Live MySQL connections failed:', liveErr.message);
        console.warn('⚠️ Running without database connection.');
        const dummyPool = {
          query: async () => [[], []],
          execute: async () => [[], []],
          getConnection: async () => ({ release: () => {}, query: async () => [[], []], execute: async () => [[], []] }),
          end: async () => {}
        };
        activePool = dummyPool;
        return dummyPool;
      }
    }
  })();
  
  return initPromise;
}

// Trigger init immediately on startup
initPool();

module.exports = {
  query: async (...args) => (await initPool()).query(...args),
  execute: async (...args) => (await initPool()).execute(...args),
  getConnection: async () => (await initPool()).getConnection(),
  end: async () => (await initPool()).end()
};
