import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'laundry.db');

let db = null;

export async function initDB() {
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_no TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL DEFAULT '',
      service_type TEXT NOT NULL,
      weight REAL DEFAULT 0,
      pickup INTEGER DEFAULT 0,
      notes TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending',
      total_price REAL DEFAULT 0,
      pickup_date TEXT DEFAULT '',
      pickup_time TEXT DEFAULT '',
      latitude REAL DEFAULT NULL,
      longitude REAL DEFAULT NULL,
      payment_method TEXT DEFAULT 'cod',
      photo_path TEXT DEFAULT NULL,
      id_kurir_jemput INTEGER DEFAULT NULL,
      id_kurir_antar INTEGER DEFAULT NULL,
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT DEFAULT (datetime('now', 'localtime'))
    )
  `);

  // Try to alter table to add columns if database file already existed without them
  try {
    db.run("ALTER TABLE orders ADD COLUMN id_kurir_jemput INTEGER DEFAULT NULL");
  } catch (e) {
    // Column might already exist
  }
  try {
    db.run("ALTER TABLE orders ADD COLUMN id_kurir_antar INTEGER DEFAULT NULL");
  } catch (e) {
    // Column might already exist
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS order_sequence (
      date TEXT PRIMARY KEY,
      counter INTEGER NOT NULL DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'Lainnya',
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      notes TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'kurir', 'customer'))
    )
  `);

  // Seeding mock users
  const userCheck = queryOne("SELECT COUNT(*) as count FROM users");
  if (!userCheck || userCheck.count === 0) {
    run("INSERT INTO users (name, phone, password, role) VALUES (?, ?, ?, ?)", ['Joko Admin', '628123456789', 'admin123', 'admin']);
    run("INSERT INTO users (name, phone, password, role) VALUES (?, ?, ?, ?)", ['Budi Kurir', '628111111111', 'kurir123', 'kurir']);
    run("INSERT INTO users (name, phone, password, role) VALUES (?, ?, ?, ?)", ['Roni Kurir', '628222222222', 'kurir123', 'kurir']);
    run("INSERT INTO users (name, phone, password, role) VALUES (?, ?, ?, ?)", ['Farhan Pelanggan', '628333333333', 'customer123', 'customer']);
    console.log('[DB Seeding] Mock users seeded successfully.');
  }

  saveDB();
  return db;
}

export function getNextSequence() {
  const today = new Date().toISOString().split('T')[0];
  const row = queryOne('SELECT counter FROM order_sequence WHERE date = ?', [today]);
  let next;
  if (!row) {
    next = 1;
    run('INSERT INTO order_sequence (date, counter) VALUES (?, ?)', [today, next]);
  } else {
    next = row.counter + 1;
    run('UPDATE order_sequence SET counter = ? WHERE date = ?', [next, today]);
  }
  return next;
}

export function getDB() {
  return db;
}

export function saveDB() {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

export function queryAll(sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length) stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

export function queryOne(sql, params = []) {
  const rows = queryAll(sql, params);
  return rows.length ? rows[0] : null;
}

export function run(sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length) stmt.bind(params);
  stmt.step();
  stmt.free();
  saveDB();
  return queryOne('SELECT last_insert_rowid() as id').id;
}
