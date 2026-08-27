const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

let pool = null;

function getPool() {
  if (!pool) {
    const config = {
      host: process.env.PGHOST || process.env.DB_HOST || '127.0.0.1',
      port: parseInt(process.env.PGPORT || process.env.DB_PORT || '5432', 10),
      database: process.env.PGDATABASE || process.env.DB_NAME || 'zazele',
      user: process.env.PGUSER || process.env.DB_USER || 'postgres',
      password: process.env.PGPASSWORD || process.env.DB_PASSWORD || '',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    };

    if (process.env.DATABASE_URL) {
      pool = new Pool({ connectionString: process.env.DATABASE_URL });
    } else {
      pool = new Pool(config);
    }

    pool.on('error', (err) => {
      console.error('[PostgreSQL] Unexpected error on idle client:', err.message);
    });
  }
  return pool;
}

async function query(text, params) {
  const start = Date.now();
  const res = await getPool().query(text, params);
  const duration = Date.now() - start;
  if (process.env.DEBUG_SQL === 'true') {
    console.log('[SQL Query]', { text, duration: `${duration}ms`, rows: res.rowCount });
  }
  return res;
}

async function initSchema() {
  const schemaPath = path.join(__dirname, '../db/schema.sql');
  if (fs.existsSync(schemaPath)) {
    const sql = fs.readFileSync(schemaPath, 'utf8');
    await query(sql);
    console.log('[PostgreSQL] Database schema initialized successfully');
  }
}

async function testConnection() {
  try {
    const res = await query('SELECT NOW() as now, current_database() as db');
    return {
      connected: true,
      database: res.rows[0].db,
      timestamp: res.rows[0].now
    };
  } catch (err) {
    return {
      connected: false,
      error: err.message
    };
  }
}

module.exports = {
  getPool,
  query,
  initSchema,
  testConnection
};
