# SQLite ke PostgreSQL Migration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans.

**Goal:** Migrate from sql.js (SQLite) to PostgreSQL via `pg` for persistent storage on Vercel.

**Architecture:** Ganti `server/db.js` dari sql.js ke `pg.Pool`, interface helper functions tetap (`queryAll`, `queryOne`, `run`). Semua route handler jadi `async`. SQL syntax disesuaikan ke PostgreSQL dialect.

**Tech Stack:** `pg` (node-postgres), Supabase (PostgreSQL provider), Express.js

---

### Task 1: Install pg + setup .env

**Files:**
- Modify: `C:\Users\YUSJUL\Documents\laundry-app\server\package.json`
- Modify: `C:\Users\YUSJUL\Documents\laundry-app\package.json`
- Create: `C:\Users\YUSJUL\Documents\laundry-app\.env`

- [ ] **Step 1: Install pg di server/package.json**

```
Add "pg": "^8.13.0" to dependencies in server/package.json
```

- [ ] **Step 2: Install pg di root package.json**

```
Add "pg": "^8.13.0" to dependencies in root package.json
```

- [ ] **Step 3: Create .env file** (isi dengan connection string Supabase nanti)

```
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST].supabase.co:5432/postgres
```

- [ ] **Step 4: Run npm install**

```bash
npm install
cd server && npm install
```

---

### Task 2: Rewrite server/db.js — sql.js → pg.Pool

**Files:**
- Rewrite: `C:\Users\YUSJUL\Documents\laundry-app\server\db.js`

- [ ] **Step 1: Rewrite db.js**

Replace seluruh isi dengan:

```javascript
import pkg from 'pg';
const { Pool } = pkg;

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
```

Key changes:
- `sql.js` → `pg.Pool`
- `INTEGER PRIMARY KEY AUTOINCREMENT` → `SERIAL PRIMARY KEY`
- `REAL` → `DOUBLE PRECISION`
- `pickup INTEGER DEFAULT 0` → `pickup BOOLEAN DEFAULT FALSE`
- `datetime('now', 'localtime')` → `NOW()`
- `last_insert_rowid()` → `RETURNING id` (handled in routes)
- `?` placeholder → `$1, $2, ...` numbered placeholders
- Semua function jadi `async` / return `Promise`
- Tambah export `getPool()` untuk routes yang perlu pool langsung
- Hapus `saveDB()`, `getDB()` (diganti `getPool()`)

---

### Task 3: Fix routes/orders.js — async + SQL syntax

**Files:**
- Modify: `C:\Users\YUSJUL\Documents\laundry-app\server\routes\orders.js`

Perubahan per route handler:
- Tambah `async`
- Tambah `await` di setiap `queryAll`, `queryOne`, `run`
- `?` → `$1, $2, ...` (numbered)
- `datetime('now', 'localtime')` → `NOW()`
- `date(orders.created_at) = ?` → `orders.created_at::date = $1`
- `getNextSequence()` → `await getNextSequence()`
- Bungkus handler di `try/catch`

- [ ] **Step 1: GET /prices**

```javascript
router.get('/prices', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const fee = lat && lng ? getPickupFee(parseFloat(lat), parseFloat(lng)) : 5000;
    res.json({ prices: PRICES, pickupFee: fee });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
```

- [ ] **Step 2: GET /kurirs/list**

```javascript
router.get('/kurirs/list', async (req, res) => {
  try {
    const kurirs = await queryAll("SELECT id, name, phone FROM users WHERE role = 'kurir'");
    res.json(kurirs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
```

- [ ] **Step 3: GET / — with dynamic numbered params**

```javascript
router.get('/', async (req, res) => {
  try {
    const { status, date, id_kurir_jemput, id_kurir_antar } = req.query;
    let sql = `
      SELECT orders.*,
             kj.name as kurir_jemput_name,
             ka.name as kurir_antar_name
      FROM orders
      LEFT JOIN users kj ON orders.id_kurir_jemput = kj.id
      LEFT JOIN users ka ON orders.id_kurir_antar = ka.id
    `;
    const params = [];
    const conditions = [];

    if (status) {
      conditions.push(`orders.status = $${params.length + 1}`);
      params.push(status);
    }
    if (date) {
      conditions.push(`orders.created_at::date = $${params.length + 1}`);
      params.push(date);
    }
    if (id_kurir_jemput) {
      conditions.push(`orders.id_kurir_jemput = $${params.length + 1}`);
      params.push(id_kurir_jemput);
    }
    if (id_kurir_antar) {
      conditions.push(`orders.id_kurir_antar = $${params.length + 1}`);
      params.push(id_kurir_antar);
    }

    if (conditions.length) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY orders.created_at DESC';
    const orders = await queryAll(sql, params);
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
```

- [ ] **Step 4: GET /track**

```javascript
router.get('/track', async (req, res) => {
  try {
    const { no } = req.query;
    if (!no) return res.status(400).json({ error: 'Nomor order diperlukan' });

    const order = await queryOne(`
      SELECT orders.*,
             kj.name as kurir_jemput_name,
             ka.name as kurir_antar_name
      FROM orders
      LEFT JOIN users kj ON orders.id_kurir_jemput = kj.id
      LEFT JOIN users ka ON orders.id_kurir_antar = ka.id
      WHERE orders.order_no = $1
    `, [no]);

    if (!order) return res.status(404).json({ error: 'Order tidak ditemukan' });
    res.json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
```

- [ ] **Step 5: GET /:id**

```javascript
router.get('/:id', async (req, res) => {
  try {
    const order = await queryOne(`
      SELECT orders.*,
             kj.name as kurir_jemput_name,
             ka.name as kurir_antar_name
      FROM orders
      LEFT JOIN users kj ON orders.id_kurir_jemput = kj.id
      LEFT JOIN users ka ON orders.id_kurir_antar = ka.id
      WHERE orders.id = $1
    `, [req.params.id]);

    if (!order) return res.status(404).json({ error: 'Order tidak ditemukan' });
    res.json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
```

- [ ] **Step 6: POST / — create order**

```javascript
router.post('/', async (req, res) => {
  try {
    const { customer_name, phone, address, service_type, weight, pickup, notes, pickup_date, pickup_time, latitude, longitude, payment_method } = req.body;

    if (!customer_name || !phone || !service_type) {
      return res.status(400).json({ error: 'Nama, no HP, dan jenis layanan wajib diisi' });
    }

    const pricePerUnit = (PRICES[service_type] || {}).price || 0;
    const unit = (PRICES[service_type] || {}).unit;
    const qty = unit === 'kg' ? (parseFloat(weight) || 0) : 1;
    const total_price = qty * pricePerUnit + (pickup ? getPickupFee(latitude, longitude) : 0);

    const counter = await getNextSequence();
    const d = new Date();
    const y = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const orderNo = `LND${y}${mm}${dd}${String(counter).padStart(4, '0')}`;

    await run(
      `INSERT INTO orders (order_no, customer_name, phone, address, service_type, weight, pickup, notes, total_price, pickup_date, pickup_time, latitude, longitude, payment_method)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      [orderNo, customer_name, phone, address || '', service_type, weight || 0, pickup ? 1 : 0, notes || '', total_price, pickup_date || '', pickup_time || '', latitude ?? null, longitude ?? null, payment_method || 'cod']
    );

    const order = await queryOne('SELECT * FROM orders WHERE order_no = $1', [orderNo]);
    res.status(201).json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
```

- [ ] **Step 7: PATCH /:id/status**

```javascript
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'diambil', 'dicuci', 'disetrika', 'selesai', 'diantar'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Status tidak valid' });
    }

    await run(
      "UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2",
      [status, req.params.id]
    );

    const order = await queryOne('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    res.json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
```

- [ ] **Step 8: PATCH /:id/assign-kurir**

```javascript
router.patch('/:id/assign-kurir', async (req, res) => {
  try {
    const { id_kurir_jemput, id_kurir_antar } = req.body;

    let sql = 'UPDATE orders SET ';
    const params = [];
    const sets = [];

    if (id_kurir_jemput !== undefined) {
      sets.push(`id_kurir_jemput = $${params.length + 1}`);
      params.push(id_kurir_jemput);
    }
    if (id_kurir_antar !== undefined) {
      sets.push(`id_kurir_antar = $${params.length + 1}`);
      params.push(id_kurir_antar);
    }

    if (sets.length === 0) {
      return res.status(400).json({ error: 'Tidak ada data kurir yang diupdate' });
    }

    sql += sets.join(', ') + `, updated_at = NOW() WHERE id = $${params.length + 1}`;
    params.push(req.params.id);

    await run(sql, params);
    const order = await queryOne('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    res.json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
```

- [ ] **Step 9: PUT /:id — update order**

```javascript
router.put('/:id', async (req, res) => {
  try {
    const order = await queryOne('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    if (!order) return res.status(404).json({ error: 'Order tidak ditemukan' });

    const { customer_name, phone, address, service_type, weight, pickup, notes, pickup_date, pickup_time, latitude, longitude, payment_method } = req.body;
    if (!customer_name || !phone || !service_type) {
      return res.status(400).json({ error: 'Nama, no HP, dan jenis layanan wajib diisi' });
    }

    const pricePerUnit = (PRICES[service_type] || {}).price || 0;
    const unit = (PRICES[service_type] || {}).unit;
    const qty = unit === 'kg' ? (parseFloat(weight) || 0) : 1;
    const total_price = qty * pricePerUnit + (pickup ? getPickupFee(latitude, longitude) : 0);

    await run(
      `UPDATE orders SET customer_name = $1, phone = $2, address = $3, service_type = $4, weight = $5, pickup = $6, notes = $7, total_price = $8, pickup_date = $9, pickup_time = $10, latitude = $11, longitude = $12, payment_method = $13, updated_at = NOW() WHERE id = $14`,
      [customer_name, phone, address || '', service_type, weight || 0, pickup ? 1 : 0, notes || '', total_price, pickup_date || '', pickup_time || '', latitude ?? null, longitude ?? null, payment_method || 'cod', req.params.id]
    );

    const updated = await queryOne('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
```

- [ ] **Step 10: POST /:id/send-wa**

```javascript
router.post('/:id/send-wa', async (req, res) => {
  try {
    const order = await queryOne('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    if (!order) return res.status(404).json({ error: 'Order tidak ditemukan' });

    const statusLabel = statusLabels[order.status] || order.status;
    const template = waTemplates[order.status] || 'sedang diproses.';

    const message =
      `Halo ${order.customer_name},\n\n` +
      `Laundry Anda dengan nomor order *${order.order_no}* ${template}\n\n` +
      `Detail Pesanan:\n` +
      `• Layanan: ${order.service_type}\n` +
      `${order.weight > 0 ? `• Berat: ${order.weight} kg\n` : ''}` +
      `• Total: Rp ${order.total_price.toLocaleString()}\n` +
      `• Status: ${statusLabel}\n\n` +
      `Terima kasih telah menggunakan LaundryKu!`;

    const waUrl = `https://wa.me/${order.phone.replace(/^0/, '62').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;

    console.log('[WA Notification]', { to: order.phone, order_no: order.order_no, status: order.status, message });

    res.json({ success: true, waUrl, message });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
```

- [ ] **Step 11: DELETE /:id**

```javascript
router.delete('/:id', async (req, res) => {
  try {
    const order = await queryOne('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    if (!order) return res.status(404).json({ error: 'Order tidak ditemukan' });

    await run('DELETE FROM orders WHERE id = $1', [req.params.id]);
    res.json({ message: 'Order berhasil dihapus' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
```

- [ ] **Step 12: GET /report/summary**

```javascript
router.get('/report/summary', async (req, res) => {
  try {
    const today = await queryOne(`
      SELECT COUNT(*) as total_orders, COALESCE(SUM(total_price), 0) as total_revenue
      FROM orders WHERE created_at::date = NOW()::date
    `);

    const byStatus = await queryAll('SELECT status, COUNT(*) as count FROM orders GROUP BY status');

    res.json({ today, byStatus });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
```

---

### Task 4: Fix routes/expenses.js — async + SQL syntax

**Files:**
- Modify: `C:\Users\YUSJUL\Documents\laundry-app\server\routes\expenses.js`

- [ ] **Step 1: Rewrite seluruh expenses.js**

```javascript
import { Router } from 'express';
import { queryAll, queryOne, run, getPool } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { start, end } = req.query;
    let sql = 'SELECT * FROM expenses';
    const params = [];

    if (start && end) {
      sql += ' WHERE date >= $1 AND date <= $2';
      params.push(start, end);
    } else if (start) {
      sql += ' WHERE date >= $1';
      params.push(start);
    } else if (end) {
      sql += ' WHERE date <= $1';
      params.push(end);
    }

    sql += ' ORDER BY date DESC, created_at DESC';
    res.json(await queryAll(sql, params));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, category, amount, date, notes } = req.body;
    if (!name || !amount || !date) {
      return res.status(400).json({ error: 'Nama, nominal, dan tanggal wajib diisi' });
    }

    const pool = getPool();
    const { rows } = await pool.query(
      `INSERT INTO expenses (name, category, amount, date, notes) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [name, category || 'Lainnya', parseFloat(amount), date, notes || '']
    );

    const expense = await queryOne('SELECT * FROM expenses WHERE id = $1', [rows[0].id]);
    res.status(201).json(expense);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const expense = await queryOne('SELECT * FROM expenses WHERE id = $1', [req.params.id]);
    if (!expense) return res.status(404).json({ error: 'Pengeluaran tidak ditemukan' });

    const { name, category, amount, date, notes } = req.body;
    if (!name || !amount || !date) {
      return res.status(400).json({ error: 'Nama, nominal, dan tanggal wajib diisi' });
    }

    await run(
      'UPDATE expenses SET name = $1, category = $2, amount = $3, date = $4, notes = $5 WHERE id = $6',
      [name, category || 'Lainnya', parseFloat(amount), date, notes || '', req.params.id]
    );

    const updated = await queryOne('SELECT * FROM expenses WHERE id = $1', [req.params.id]);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const expense = await queryOne('SELECT * FROM expenses WHERE id = $1', [req.params.id]);
    if (!expense) return res.status(404).json({ error: 'Pengeluaran tidak ditemukan' });

    await run('DELETE FROM expenses WHERE id = $1', [req.params.id]);
    res.json({ message: 'Pengeluaran berhasil dihapus' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
```

---

### Task 5: Test server jalan lokal

**Files:**
- Test: `C:\Users\YUSJUL\Documents\laundry-app\server`

- [ ] **Step 1: Pastikan DATABASE_URL terisi di .env**

```bash
# Cek isi .env - harus ada DATABASE_URL yang valid
Get-Content .env
```

- [ ] **Step 2: Start server**

```bash
node server/index.js
```

Expected: `Server running on http://localhost:3001` (tanpa error)

- [ ] **Step 3: Test API endpoints**

```bash
# Test GET orders
curl http://localhost:3001/api/orders

# Test POST order
curl -X POST http://localhost:3001/api/orders -H "Content-Type: application/json" -d '{"customer_name":"Test","phone":"628123","service_type":"Cuci Kering"}' 
```

- [ ] **Step 4: Verifikasi data persist di Supabase dashboard**

Buka Supabase dashboard → Table Editor → cek tabel `orders`, `expenses`, `users` ada datanya.

---
