require('dotenv').config()
const { Pool } = require('pg')
const crypto = require('crypto')

function md5Hash(str) {
  return crypto.createHash('md5').update(str).digest('hex')
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

async function connectDB() {
  try {
    console.log('\n📡 Connecting to Supabase PostgreSQL...')
    const client = await pool.connect()
    console.log('✅ Connected to Supabase PostgreSQL!')
    client.release()

    await createTables()
    return pool
  } catch (err) {
    console.error('❌ Supabase connection failed:', err.message)
    throw err
  }
}

async function createTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100),
        full_name VARCHAR(100),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `)

    const adminPassword = md5Hash('admin123')
    await pool.query(`
      INSERT INTO users (id, username, password, email, full_name, is_active)
      VALUES ('admin-001', 'admin', $1, 'admin@farmerapp.com', 'Administrator', TRUE)
      ON CONFLICT (username) DO NOTHING
    `, [adminPassword])

    await pool.query(`
      CREATE TABLE IF NOT EXISTS dealers (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        address TEXT,
        city VARCHAR(100),
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS items (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        unit VARCHAR(50) DEFAULT 'kg',
        rate DECIMAL(10, 2) DEFAULT 0,
        category VARCHAR(100) DEFAULT 'Vegetable',
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS sales (
        id VARCHAR(50) PRIMARY KEY,
        date VARCHAR(10) NOT NULL,
        rate DECIMAL(10, 2),
        first_kg DECIMAL(10, 2) DEFAULT 0,
        second_kg DECIMAL(10, 2) DEFAULT 0,
        first_amount DECIMAL(10, 2) DEFAULT 0,
        second_rate DECIMAL(10, 2) DEFAULT 0,
        second_amount DECIMAL(10, 2) DEFAULT 0,
        total_amount DECIMAL(10, 2) DEFAULT 0,
        dealer_id VARCHAR(50),
        dealer_name VARCHAR(255),
        item_id VARCHAR(50),
        item_name VARCHAR(255),
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS advances (
        id VARCHAR(50) PRIMARY KEY,
        date VARCHAR(10) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        description VARCHAR(255),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `)

    console.log('✅ Database tables created/verified')
  } catch (err) {
    console.error('Table creation error:', err.message)
    throw err
  }
}

function getPool() {
  return pool
}

function isConnected() {
  return pool && pool.totalCount >= 0
}

module.exports = {
  connectDB,
  getPool,
  isConnected,
  query: (text, params) => pool.query(text, params)
}
