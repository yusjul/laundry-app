import pkg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const { Pool } = pkg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env for local development
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim();
        if (!process.env[key]) process.env[key] = val;
      }
    }
  }
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.VERCEL ? { rejectUnauthorized: false } : false,
});

export async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      order_no TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL DEFAULT '',
      service_type TEXT NOT NULL,
      weight DOUBLE PRECISION DEFAULT 0,
      pickup BOOLEAN DEFAULT FALSE,
      notes TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending',
      total_price DOUBLE PRECISION DEFAULT 0,
      pickup_date TEXT DEFAULT '',
      pickup_time TEXT DEFAULT '',
      latitude DOUBLE PRECISION DEFAULT NULL,
      longitude DOUBLE PRECISION DEFAULT NULL,
      payment_method TEXT DEFAULT 'cod',
      photo_path TEXT DEFAULT NULL,
      id_kurir_jemput INTEGER DEFAULT NULL,
      id_kurir_antar INTEGER DEFAULT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);

  try {
    await pool.query("ALTER TABLE orders ADD COLUMN id_kurir_jemput INTEGER DEFAULT NULL");
  } catch (e) {}
  try {
    await pool.query("ALTER TABLE orders ADD COLUMN id_kurir_antar INTEGER DEFAULT NULL");
  } catch (e) {}

  await pool.query(`
    CREATE TABLE IF NOT EXISTS order_sequence (
      date TEXT PRIMARY KEY,
      counter INTEGER NOT NULL DEFAULT 0
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS expenses (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'Lainnya',
      amount DOUBLE PRECISION NOT NULL,
      date TEXT NOT NULL,
      notes TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'kurir', 'customer'))
    )
  `);

  const { rows } = await pool.query("SELECT COUNT(*) as count FROM users");
  if (!rows[0] || rows[0].count === '0') {
    await pool.query(
      "INSERT INTO users (name, phone, password, role) VALUES ($1, $2, $3, $4)",
      ['Joko Admin', '628123456789', 'admin123', 'admin']
    );
    await pool.query(
      "INSERT INTO users (name, phone, password, role) VALUES ($1, $2, $3, $4)",
      ['Budi Kurir', '628111111111', 'kurir123', 'kurir']
    );
    await pool.query(
      "INSERT INTO users (name, phone, password, role) VALUES ($1, $2, $3, $4)",
      ['Roni Kurir', '628222222222', 'kurir123', 'kurir']
    );
    await pool.query(
      "INSERT INTO users (name, phone, password, role) VALUES ($1, $2, $3, $4)",
      ['Farhan Pelanggan', '628333333333', 'customer123', 'customer']
    );
    console.log('[DB Seeding] Mock users seeded successfully.');
  }
}

export async function getNextSequence() {
  const today = new Date().toISOString().split('T')[0];
  const { rows } = await pool.query(
    'SELECT counter FROM order_sequence WHERE date = $1',
    [today]
  );
  let next;
  if (!rows.length) {
    next = 1;
    await pool.query(
      'INSERT INTO order_sequence (date, counter) VALUES ($1, $2)',
      [today, next]
    );
  } else {
    next = rows[0].counter + 1;
    await pool.query(
      'UPDATE order_sequence SET counter = $1 WHERE date = $2',
      [next, today]
    );
  }
  return next;
}

export function getPool() {
  return pool;
}

export async function queryAll(sql, params = []) {
  const { rows } = await pool.query(sql, params);
  return rows;
}

export async function queryOne(sql, params = []) {
  const { rows } = await pool.query(sql, params);
  return rows.length ? rows[0] : null;
}

export async function run(sql, params = []) {
  await pool.query(sql, params);
}
