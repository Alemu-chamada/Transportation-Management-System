// =============================================================================
// NEON DATABASE CONNECTION CONFIGURATION
// Transportation Management System - Production
// =============================================================================

const { Pool } = require("pg");
const logger = require("../backend/src/shared/utils/logger.js");

// Neon PostgreSQL Configuration
const neonConfig = {
  // Connection string from Neon (recommended approach)
  connectionString: process.env.DATABASE_URL,
  
  // OR individual parameters
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT) || 5432,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  
  // SSL Configuration (REQUIRED for Neon)
  ssl: {
    rejectUnauthorized: false, // Neon uses managed SSL
  },
  
  // Connection Pool Settings
  max: 20, // Maximum number of clients in the pool
  min: 2,  // Minimum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Wait 10 seconds for connection
  
  // Statement timeout (prevent long-running queries)
  statement_timeout: 60000, // 60 seconds max per query
  
  // Query timeout
  query_timeout: 60000,
  
  // Connection retry configuration
  connectionRetryAttempts: 3,
  connectionRetryDelay: 2000, // 2 seconds between retries
};

// Create connection pool
const pool = new Pool(neonConfig);

// Pool error handling
pool.on('error', (err, client) => {
  logger.error('Unexpected database pool error', {
    error: err.message,
    stack: err.stack,
  });
});

pool.on('connect', (client) => {
  logger.info('New database connection established');
});

pool.on('remove', (client) => {
  logger.info('Database connection removed from pool');
});

// Query wrapper with logging
const query = async (sql, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(sql, params);
    const duration = Date.now() - start;
    
    if (duration > 1000) {
      logger.warn('Slow query detected', {
        duration: `${duration}ms`,
        sql: sql.substring(0, 100), // Log first 100 chars
        rows: result.rowCount,
      });
    }
    
    return result;
  } catch (error) {
    logger.error('Database query error', {
      error: error.message,
      sql: sql.substring(0, 100),
      params: params,
    });
    throw error;
  }
};

// Transaction wrapper
const transaction = async (callback) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Transaction rolled back', {
      error: error.message,
    });
    throw error;
  } finally {
    client.release();
  }
};

// Connection health check
const connectDb = async () => {
  try {
    // Test query
    const result = await query('SELECT NOW() as current_time, current_database() as database');
    
    logger.info('PostgreSQL connected successfully', {
      host: neonConfig.host || 'Using connection string',
      database: result.rows[0].database,
      time: result.rows[0].current_time,
      ssl: 'enabled',
    });
    
    return true;
  } catch (error) {
    logger.error('PostgreSQL connection failed', {
      error: error.message,
      host: neonConfig.host,
      database: neonConfig.database,
    });
    throw error;
  }
};

// Graceful shutdown
const closeDb = async () => {
  try {
    await pool.end();
    logger.info('Database pool has been closed');
  } catch (error) {
    logger.error('Error closing database pool', {
      error: error.message,
    });
    throw error;
  }
};

// Connection pool stats
const getPoolStats = () => {
  return {
    total: pool.totalCount,
    idle: pool.idleCount,
    waiting: pool.waitingCount,
  };
};

module.exports = {
  pool,
  query,
  transaction,
  connectDb,
  closeDb,
  getPoolStats,
};

// =============================================================================
// USAGE EXAMPLES
// =============================================================================

/*
// Basic query
const { query } = require('./neon-db-config');

const users = await query('SELECT * FROM users WHERE email = $1', ['user@example.com']);

// Transaction
const { transaction } = require('./neon-db-config');

await transaction(async (client) => {
  await client.query('INSERT INTO users (email) VALUES ($1)', ['user@example.com']);
  await client.query('INSERT INTO audit_logs (action) VALUES ($1)', ['USER_CREATED']);
});

// Connection test
const { connectDb } = require('./neon-db-config');

await connectDb(); // Logs success or throws error

// Get pool stats
const { getPoolStats } = require('./neon-db-config');

console.log(getPoolStats()); // { total: 5, idle: 3, waiting: 0 }

// Graceful shutdown
const { closeDb } = require('./neon-db-config');

process.on('SIGTERM', async () => {
  await closeDb();
  process.exit(0);
});
*/
