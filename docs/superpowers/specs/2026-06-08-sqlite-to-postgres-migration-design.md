# Migrasi SQLite ke PostgreSQL (Supabase)

## Latar Belakang

Aplikasi laundry-app saat ini menggunakan `sql.js` (SQLite WASM) dengan penyimpanan file (`laundry.db`). Karena akan di-deploy ke Vercel (serverless), SQLite tidak bisa diandalkan karena file system-nya ephemeral — data hilang setiap cold start.

## Tujuan

- Ganti backend database dari SQLite ke PostgreSQL (Supabase)
- Minimal perubahan kode — routes tetap pakai `queryAll`, `queryOne`, `run`
- Bisa jalan di local development maupun Vercel serverless

## Stack Database

- **Provider:** Supabase (PostgreSQL 15+)
- **Driver:** `pg` (node-postgres) dengan connection pool
- **Koneksi:** `DATABASE_URL` environment variable

## File yang Diubah

| File | Perubahan |
|------|-----------|
| `server/db.js` | Rewrite total: sql.js → `pg.Pool` |
| `server/routes/orders.js` | Sesuikan SQL syntax (datetime, boolean) |
| `server/routes/expenses.js` | Sesuikan SQL syntax (datetime, boolean) |
| `server/package.json` | Tambah dependency `pg` |
| `package.json` (root) | Tambah dependency `pg` |
| `.env` (baru) | Simpan `DATABASE_URL` untuk local dev |

## API Helper Functions (db.js)

Interface tetap identik — routes tidak perlu refactor:

```
queryAll(sql, params) → Promise<rows[]>
queryOne(sql, params) → Promise<row | null>
run(sql, params)      → Promise<void>
getNextSequence()     → Promise<number>
initDB()              → Promise<void>
getDB()               → Pool instance
```

## SQL Syntax Migration

| SQLite | PostgreSQL |
|--------|------------|
| `datetime('now', 'localtime')` | `NOW()` |
| `date(orders.created_at)` | `orders.created_at::date` |
| `INTEGER PRIMARY KEY AUTOINCREMENT` | `SERIAL PRIMARY KEY` |
| `REAL` | `DOUBLE PRECISION` |
| `pickup INTEGER DEFAULT 0` | `pickup BOOLEAN DEFAULT FALSE` |
| `ORDER BY orders.created_at DESC` | (sama, tidak berubah) |

## Table Schema

### orders

```sql
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
);
```

### order_sequence

```sql
CREATE TABLE IF NOT EXISTS order_sequence (
  date TEXT PRIMARY KEY,
  counter INTEGER NOT NULL DEFAULT 0
);
```

### expenses

```sql
CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Lainnya',
  amount DOUBLE PRECISION NOT NULL,
  date TEXT NOT NULL,
  notes TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### users

```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('admin', 'kurir', 'customer'))
);
```

## Environment Variables

```
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST].supabase.co:5432/postgres
```

- Local: baca dari `.env` file
- Vercel: set via Dashboard → Environment Variables
- Fallback: jika `DATABASE_URL` tidak ada, throw error (jangan silent)

## Connection Pool

- Inisialisasi pool di module scope (top-level), re-use across requests
- Gunakan `pg.Pool` — cocok untuk serverless karena pool size kecil (default 10)
- Di Vercel, pakai `ssl: { rejectUnauthorized: false }` untuk koneksi ke Supabase

## Testing

1. Setup Supabase project gratis
2. Isi `DATABASE_URL` di `.env`
3. `npm run dev` — server harus jalan tanpa error
4. Test CRUD: buat order, update status, lihat expenses
5. Cek data di Supabase dashboard — confirm data persist

## Rollback Plan

Jika gagal, revert ke sql.js:
- `git checkout -- server/db.js server/routes/*.js`
- Hapus `pg` dari package.json
- Hapus `.env`
