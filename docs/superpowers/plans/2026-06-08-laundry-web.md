# Laundry Web App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-stack laundry web app with public pages (beranda, harga, pesan, tracking) and admin pages (dashboard, orders, laporan).

**Architecture:** React SPA (Vite) frontend communicating with Express.js REST API backend, SQLite database. Monorepo style with `client/` and `server/` directories.

**Tech Stack:** React 18, Vite, React Router v6, Tailwind CSS, Node.js, Express.js, better-sqlite3

---

### Task 1: Root project scaffolding & .gitignore

**Files:**
- Create: `.gitignore`
- Create: `package.json` (root)

- [ ] **Step 1: Create .gitignore**

```gitignore
node_modules/
dist/
.env
*.db
```

- [ ] **Step 2: Create root package.json**

```json
{
  "name": "laundry-app",
  "private": true,
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "cd server && node index.js",
    "dev:client": "cd client && npm run dev"
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add .gitignore package.json
git commit -m "chore: initial project scaffolding"
```

---

### Task 2: Setup Express server + SQLite database

**Files:**
- Create: `server/package.json`
- Create: `server/db.js`
- Create: `server/index.js`

- [ ] **Step 1: Create server/package.json**

```json
{
  "name": "laundry-server",
  "private": true,
  "type": "module",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "better-sqlite3": "^11.0.0",
    "cors": "^2.8.5",
    "express": "^4.21.0"
  }
}
```

- [ ] **Step 2: Install server dependencies**

Run: `cd server && npm install`

- [ ] **Step 3: Create server/db.js — SQLite setup & schema**

```js
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, 'laundry.db'));

db.pragma('journal_mode = WAL');

db.exec(`
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
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    updated_at TEXT DEFAULT (datetime('now', 'localtime'))
  )
`);

export default db;
```

- [ ] **Step 4: Create server/index.js — Express entry point**

```js
import express from 'express';
import cors from 'cors';
import ordersRouter from './routes/orders.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use('/api/orders', ordersRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

- [ ] **Step 5: Commit**

```bash
git add server/
git commit -m "feat: setup Express server with SQLite database"
```

---

### Task 3: Orders API — CRUD + tracking

**Files:**
- Create: `server/routes/orders.js`

- [ ] **Step 1: Create server/routes/orders.js — all order endpoints**

```js
import { Router } from 'express';
import db from '../db.js';

const router = Router();

function generateOrderNo() {
  const date = new Date();
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yy = String(date.getFullYear()).slice(-2);
  const rand = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
  return `LND${dd}${mm}${yy}${rand}`;
}

// GET /api/orders — list all orders
router.get('/', (req, res) => {
  const { status, date } = req.query;
  let sql = 'SELECT * FROM orders';
  const params = [];
  const conditions = [];

  if (status) {
    conditions.push('status = ?');
    params.push(status);
  }
  if (date) {
    conditions.push("date(created_at) = ?");
    params.push(date);
  }

  if (conditions.length) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += ' ORDER BY created_at DESC';
  const orders = db.prepare(sql).all(...params);
  res.json(orders);
});

// GET /api/orders/track?no=xxx — public tracking
router.get('/track', (req, res) => {
  const { no } = req.query;
  if (!no) return res.status(400).json({ error: 'Nomor order diperlukan' });

  const order = db.prepare('SELECT * FROM orders WHERE order_no = ?').get(no);
  if (!order) return res.status(404).json({ error: 'Order tidak ditemukan' });

  res.json(order);
});

// GET /api/orders/:id — detail
router.get('/:id', (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order tidak ditemukan' });
  res.json(order);
});

// POST /api/orders — create new order
router.post('/', (req, res) => {
  const { customer_name, phone, address, service_type, weight, pickup, notes } = req.body;

  if (!customer_name || !phone || !service_type) {
    return res.status(400).json({ error: 'Nama, no HP, dan jenis layanan wajib diisi' });
  }

  const prices = {
    'Cuci Kering': 7000,
    'Cuci Setrika': 10000,
    'Dry Clean': 15000,
    'Bed Cover': 25000,
  };

  const pricePerUnit = prices[service_type] || 0;
  const qty = service_type === 'Cuci Kering' || service_type === 'Cuci Setrika' ? (weight || 1) : 1;
  const total_price = qty * pricePerUnit + (pickup ? 5000 : 0);

  const orderNo = generateOrderNo();

  const stmt = db.prepare(`
    INSERT INTO orders (order_no, customer_name, phone, address, service_type, weight, pickup, notes, total_price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(orderNo, customer_name, phone, address || '', service_type, weight || 0, pickup ? 1 : 0, notes || '', total_price);

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(order);
});

// PATCH /api/orders/:id/status — update status
router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'diambil', 'dicuci', 'disetrika', 'selesai', 'diantar'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Status tidak valid' });
  }
  db.prepare("UPDATE orders SET status = ?, updated_at = datetime('now', 'localtime') WHERE id = ?").run(status, req.params.id);
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  res.json(order);
});

// GET /api/orders/report/summary — laporan pendapatan
router.get('/report/summary', (req, res) => {
  const today = db.prepare(`
    SELECT COUNT(*) as total_orders, COALESCE(SUM(total_price), 0) as total_revenue
    FROM orders WHERE date(created_at) = date('now', 'localtime')
  `).get();

  const byStatus = db.prepare(`
    SELECT status, COUNT(*) as count FROM orders GROUP BY status
  `).all();

  res.json({ today, byStatus });
});

export default router;
```

- [ ] **Step 2: Commit**

```bash
git add server/routes/orders.js
git commit -m "feat: orders API with CRUD, tracking, and report"
```

---

### Task 4: Setup Vite + React + Tailwind CSS client

**Files:**
- Create: `client/package.json`
- Create: `client/vite.config.js`
- Create: `client/postcss.config.js`
- Create: `client/tailwind.config.js`
- Create: `client/index.html`
- Create: `client/src/main.jsx`
- Create: `client/src/App.jsx`
- Create: `client/src/index.css`

- [ ] **Step 1: Create client/package.json**

```json
{
  "name": "laundry-client",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.26.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "vite": "^5.4.0"
  }
}
```

- [ ] **Step 2: Install client dependencies**

Run: `cd client && npm install`

- [ ] **Step 3: Create client/vite.config.js**

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
});
```

- [ ] **Step 4: Create client/postcss.config.js**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 5: Create client/tailwind.config.js**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

- [ ] **Step 6: Create client/index.html**

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>LaundryKu - Cucian Bersih, Harum, Tepat Waktu</title>
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 7: Create client/src/main.jsx**

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

- [ ] **Step 8: Create client/src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 9: Create client/src/App.jsx — routes placeholder**

```jsx
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<div className="p-8 text-center text-xl">LaundryKu</div>} />
      </Routes>
    </Layout>
  );
}

export default App;
```

- [ ] **Step 10: Commit**

```bash
git add client/
git commit -m "feat: setup Vite + React + Tailwind CSS client"
```

---

### Task 5: Create shared components (Navbar, Footer, Layout)

**Files:**
- Create: `client/src/components/Navbar.jsx`
- Create: `client/src/components/Footer.jsx`
- Create: `client/src/components/Layout.jsx`

- [ ] **Step 1: Create client/src/components/Navbar.jsx**

```jsx
import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/', label: 'Beranda' },
  { to: '/harga', label: 'Harga' },
  { to: '/pesan', label: 'Pesan' },
  { to: '/tracking', label: 'Tracking' },
  { to: '/admin', label: 'Admin' },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight">
          <span className="text-blue-600">Laundry</span>Ku
        </Link>
        <div className="hidden md:flex gap-6">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                location.pathname === link.to ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Create client/src/components/Footer.jsx**

```jsx
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 text-center text-sm">
        <p className="font-semibold text-white mb-1">LaundryKu</p>
        <p>Cucian Bersih, Harum, Tepat Waktu</p>
        <p className="mt-3 text-xs">&copy; {new Date().getFullYear()} LaundryKu. All rights reserved.</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Create client/src/components/Layout.jsx**

```jsx
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add client/src/components/
git commit -m "feat: add Navbar, Footer, and Layout components"
```

---

### Task 6: Create Beranda page

**Files:**
- Create: `client/src/pages/Beranda.jsx`
- Modify: `client/src/App.jsx`

- [ ] **Step 1: Create client/src/pages/Beranda.jsx**

```jsx
import { Link } from 'react-router-dom';

const services = [
  { title: 'Cuci Kering', desc: 'Dicuci bersih tanpa setrika', price: 'Rp 7.000/kg', icon: '🧺' },
  { title: 'Cuci Setrika', desc: 'Dicuci + disetrika rapi', price: 'Rp 10.000/kg', icon: '👕' },
  { title: 'Dry Clean', desc: 'Perawatan khusus bahan', price: 'Rp 15.000/item', icon: '✨' },
  { title: 'Bed Cover', desc: 'Selimut & bed cover besar', price: 'Rp 25.000/item', icon: '🛏️' },
];

const steps = [
  { num: '1', title: 'Pesan', desc: 'Isi form online atau hubungi kami' },
  { num: '2', title: 'Kami Jemput', desc: 'Kurir kami ambil cucian Anda' },
  { num: '3', title: 'Dicuci & Disetrika', desc: 'Diproses dengan standar kebersihan tinggi' },
  { num: '4', title: 'Diantar Kembali', desc: 'Cucian bersih diantar tepat waktu' },
];

export default function Beranda() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Cucian Bersih, <span className="text-blue-200">Harum</span>, Tepat Waktu
          </h1>
          <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
            LaundryKu siap membantu urusan cucian Anda. Antar jemput gratis, proses cepat, hasil maksimal.
          </p>
          <Link
            to="/pesan"
            className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-blue-50 transition-colors"
          >
            Pesan Sekarang
          </Link>
        </div>
      </section>

      {/* Layanan */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">Layanan Kami</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {services.map((s) => (
            <div key={s.title} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">{s.icon}</div>
              <h3 className="font-semibold text-lg mb-1">{s.title}</h3>
              <p className="text-gray-500 text-sm mb-2">{s.desc}</p>
              <p className="text-blue-600 font-bold">{s.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cara Kerja */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">Cara Kerja</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.num} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">
                  {s.num}
                </div>
                <h3 className="font-semibold mb-1">{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Siap Memulai?</h2>
        <p className="text-gray-500 mb-6">Pesan sekarang dan nikmati cucian bersih tanpa ribet.</p>
        <Link
          to="/pesan"
          className="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Pesan Sekarang
        </Link>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Update App.jsx to use Beranda**

```jsx
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Beranda from './pages/Beranda';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Beranda />} />
      </Routes>
    </Layout>
  );
}

export default App;
```

- [ ] **Step 3: Commit**

```bash
git add client/src/pages/Beranda.jsx client/src/App.jsx
git commit -m "feat: add Beranda page with hero, services, and how it works"
```

---

### Task 7: Create Harga page

**Files:**
- Create: `client/src/pages/Harga.jsx`
- Modify: `client/src/App.jsx`

- [ ] **Step 1: Create client/src/pages/Harga.jsx**

```jsx
const priceList = [
  { service: 'Cuci Kering', price: 'Rp 7.000', unit: '/kg', desc: 'Dicuci bersih, dikeringkan, siap pakai' },
  { service: 'Cuci Setrika', price: 'Rp 10.000', unit: '/kg', desc: 'Dicuci bersih + disetrika rapi' },
  { service: 'Dry Clean', price: 'Rp 15.000', unit: '/item', desc: 'Perawatan khusus untuk bahan sensitif' },
  { service: 'Bed Cover', price: 'Rp 25.000', unit: '/item', desc: 'Bed cover, selimut, dan sprei besar' },
  { service: 'Antar Jemput', price: 'Rp 5.000', unit: '/transaksi', desc: 'Gratis untuk area tertentu' },
];

export default function Harga() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-2">Harga Layanan</h1>
      <p className="text-gray-500 text-center mb-10">Harga terjangkau dengan kualitas terbaik</p>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y">
        {priceList.map((item) => (
          <div key={item.service} className="flex items-center justify-between p-5">
            <div>
              <h3 className="font-semibold">{item.service}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-blue-600">{item.price}</span>
              <span className="text-sm text-gray-400">{item.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add Harga route to App.jsx**

```jsx
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Beranda from './pages/Beranda';
import Harga from './pages/Harga';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Beranda />} />
        <Route path="/harga" element={<Harga />} />
      </Routes>
    </Layout>
  );
}

export default App;
```

- [ ] **Step 3: Commit**

```bash
git add client/src/pages/Harga.jsx client/src/App.jsx
git commit -m "feat: add Harga page with pricing table"
```

---

### Task 8: Create Pesan page

**Files:**
- Create: `client/src/pages/Pesan.jsx`
- Modify: `client/src/App.jsx`

- [ ] **Step 1: Create client/src/pages/Pesan.jsx — order form with API submission**

```jsx
import { useState } from 'react';

const services = ['Cuci Kering', 'Cuci Setrika', 'Dry Clean', 'Bed Cover'];

export default function Pesan() {
  const [form, setForm] = useState({
    customer_name: '',
    phone: '',
    address: '',
    service_type: '',
    weight: '',
    pickup: false,
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          weight: form.service_type === 'Cuci Kering' || form.service_type === 'Cuci Setrika' ? parseFloat(form.weight) || 0 : 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Gagal memesan');
      } else {
        setResult(data);
        setForm({ customer_name: '', phone: '', address: '', service_type: '', weight: '', pickup: false, notes: '' });
      }
    } catch {
      setError('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold mb-2">Pesanan Berhasil!</h1>
          <p className="text-gray-500 mb-4">Simpan nomor order Anda untuk tracking</p>
          <p className="text-3xl font-bold text-blue-600 mb-2">{result.order_no}</p>
          <p className="text-gray-400 text-sm mb-6">Total: Rp {result.total_price.toLocaleString()}</p>
          <button
            onClick={() => setResult(null)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Pesan Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-2">Pesan Cucian</h1>
      <p className="text-gray-500 text-center mb-8">Isi form di bawah, kami jemput cucian Anda</p>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nama Lengkap *</label>
          <input name="customer_name" value={form.customer_name} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">No HP *</label>
          <input name="phone" value={form.phone} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Alamat</label>
          <textarea name="address" value={form.address} onChange={handleChange} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Jenis Layanan *</label>
          <select name="service_type" value={form.service_type} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Pilih layanan</option>
            {services.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {(form.service_type === 'Cuci Kering' || form.service_type === 'Cuci Setrika') && (
          <div>
            <label className="block text-sm font-medium mb-1">Berat (kg)</label>
            <input type="number" name="weight" value={form.weight} onChange={handleChange} step="0.5" min="0" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        )}

        <div className="flex items-center gap-2">
          <input type="checkbox" name="pickup" checked={form.pickup} onChange={handleChange} id="pickup" className="rounded" />
          <label htmlFor="pickup" className="text-sm">Antar Jemput (+Rp 5.000)</label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Catatan</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
          {loading ? 'Memproses...' : 'Pesan Sekarang'}
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Add Pesan route to App.jsx**

```jsx
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Beranda from './pages/Beranda';
import Harga from './pages/Harga';
import Pesan from './pages/Pesan';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Beranda />} />
        <Route path="/harga" element={<Harga />} />
        <Route path="/pesan" element={<Pesan />} />
      </Routes>
    </Layout>
  );
}

export default App;
```

- [ ] **Step 3: Commit**

```bash
git add client/src/pages/Pesan.jsx client/src/App.jsx
git commit -m "feat: add Pesan page with order form"
```

---

### Task 9: Create Tracking page

**Files:**
- Create: `client/src/pages/Tracking.jsx`
- Modify: `client/src/App.jsx`

- [ ] **Step 1: Create client/src/pages/Tracking.jsx**

```jsx
import { useState } from 'react';

const statusSteps = ['pending', 'diambil', 'dicuci', 'disetrika', 'selesai', 'diantar'];

const statusLabels = {
  pending: 'Menunggu',
  diambil: 'Diambil',
  dicuci: 'Dicuci',
  disetrika: 'Disetrika',
  selesai: 'Selesai',
  diantar: 'Diantar',
};

export default function Tracking() {
  const [orderNo, setOrderNo] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderNo.trim()) return;
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/track?no=${encodeURIComponent(orderNo.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Order tidak ditemukan');
      } else {
        setOrder(data);
      }
    } catch {
      setError('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  const currentStep = order ? statusSteps.indexOf(order.status) : -1;

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-2">Tracking Cucian</h1>
      <p className="text-gray-500 text-center mb-8">Masukkan nomor order untuk cek status</p>

      <form onSubmit={handleTrack} className="flex gap-2 mb-8">
        <input
          value={orderNo}
          onChange={(e) => setOrderNo(e.target.value)}
          placeholder="Masukkan nomor order (contoh: LND080625123)"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium">
          {loading ? '...' : 'Cari'}
        </button>
      </form>

      {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

      {order && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500">Nomor Order</p>
            <p className="text-xl font-bold text-blue-600">{order.order_no}</p>
          </div>

          <div className="space-y-2 mb-6 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Nama:</span><span className="font-medium">{order.customer_name}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Layanan:</span><span className="font-medium">{order.service_type}</span></div>
            {order.weight > 0 && <div className="flex justify-between"><span className="text-gray-500">Berat:</span><span className="font-medium">{order.weight} kg</span></div>}
            <div className="flex justify-between"><span className="text-gray-500">Total:</span><span className="font-medium">Rp {order.total_price.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Status:</span><span className="font-medium text-blue-600">{statusLabels[order.status]}</span></div>
          </div>

          {/* Progress bar */}
          <div className="flex items-center justify-between">
            {statusSteps.map((s, i) => (
              <div key={s} className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${i <= currentStep ? 'bg-blue-600' : 'bg-gray-200'}`}>
                  {i <= currentStep ? '✓' : i + 1}
                </div>
                <span className={`text-[10px] mt-1 ${i <= currentStep ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                  {statusLabels[s]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Add Tracking route to App.jsx**

```jsx
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Beranda from './pages/Beranda';
import Harga from './pages/Harga';
import Pesan from './pages/Pesan';
import Tracking from './pages/Tracking';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Beranda />} />
        <Route path="/harga" element={<Harga />} />
        <Route path="/pesan" element={<Pesan />} />
        <Route path="/tracking" element={<Tracking />} />
      </Routes>
    </Layout>
  );
}

export default App;
```

- [ ] **Step 3: Commit**

```bash
git add client/src/pages/Tracking.jsx client/src/App.jsx
git commit -m "feat: add Tracking page with order status progress"
```

---

### Task 10: Create Admin layout + Dashboard page

**Files:**
- Create: `client/src/pages/admin/Dashboard.jsx`
- Create: `client/src/components/AdminLayout.jsx`
- Modify: `client/src/App.jsx`

- [ ] **Step 1: Create client/src/components/AdminLayout.jsx**

```jsx
import { Link, useLocation } from 'react-router-dom';

const sidebarLinks = [
  { to: '/admin', label: 'Dashboard', icon: '📊' },
  { to: '/admin/orders', label: 'Orders', icon: '📋' },
  { to: '/admin/laporan', label: 'Laporan', icon: '📈' },
];

export default function AdminLayout({ children }) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-56 bg-white border-r border-gray-200 p-4">
        <Link to="/" className="text-lg font-bold text-blue-600 mb-6 block">LaundryKu</Link>
        <nav className="space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.to ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
```

- [ ] **Step 2: Create client/src/pages/admin/Dashboard.jsx**

```jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((orders) => {
        const today = new Date().toISOString().split('T')[0];
        const todayOrders = orders.filter((o) => o.created_at?.startsWith(today));
        const revenue = todayOrders.reduce((sum, o) => sum + o.total_price, 0);
        const byStatus = {};
        orders.forEach((o) => { byStatus[o.status] = (byStatus[o.status] || 0) + 1; });
        setData({ todayOrders: todayOrders.length, revenue, byStatus, total: orders.length });
      });
  }, []);

  if (!data) return <p className="text-gray-500">Memuat...</p>;

  const cards = [
    { label: 'Order Hari Ini', value: data.todayOrders, color: 'text-blue-600' },
    { label: 'Pendapatan Hari Ini', value: `Rp ${data.revenue.toLocaleString()}`, color: 'text-green-600' },
    { label: 'Total Order', value: data.total, color: 'text-purple-600' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">{card.label}</p>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <h2 className="font-semibold mb-3">Status Orders</h2>
        <div className="space-y-2">
          {Object.entries(data.byStatus).map(([status, count]) => (
            <div key={status} className="flex justify-between text-sm">
              <span className="capitalize text-gray-600">{status}</span>
              <span className="font-medium">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <Link to="/admin/orders" className="inline-block mt-4 text-sm text-blue-600 hover:underline">
        Lihat semua order &rarr;
      </Link>
    </div>
  );
}
```

- [ ] **Step 3: Update App.jsx with admin routes**

```jsx
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Beranda from './pages/Beranda';
import Harga from './pages/Harga';
import Pesan from './pages/Pesan';
import Tracking from './pages/Tracking';
import Dashboard from './pages/admin/Dashboard';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<Beranda />} />
        <Route path="/harga" element={<Harga />} />
        <Route path="/pesan" element={<Pesan />} />
        <Route path="/tracking" element={<Tracking />} />
      </Route>
      {/* Admin routes */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
```

Note: Layout component needs to use `<Outlet />` instead of `{children}`. Let me update it.

- [ ] **Step 4: Update Layout.jsx to use Outlet**

```jsx
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1"><Outlet /></main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 5: Update AdminLayout.jsx to use Outlet**

```jsx
import { Outlet, Link, useLocation } from 'react-router-dom';

const sidebarLinks = [
  { to: '/admin', label: 'Dashboard', icon: '📊' },
  { to: '/admin/orders', label: 'Orders', icon: '📋' },
  { to: '/admin/laporan', label: 'Laporan', icon: '📈' },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-56 bg-white border-r border-gray-200 p-4">
        <Link to="/" className="text-lg font-bold text-blue-600 mb-6 block">LaundryKu</Link>
        <nav className="space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.to ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 p-6"><Outlet /></div>
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add client/src/components/AdminLayout.jsx client/src/pages/admin/Dashboard.jsx client/src/components/Layout.jsx client/src/components/AdminLayout.jsx client/src/App.jsx
git commit -m "feat: add admin layout and dashboard page"
```

---

### Task 11: Create Admin Orders list page

**Files:**
- Create: `client/src/pages/admin/Orders.jsx`
- Modify: `client/src/App.jsx`

- [ ] **Step 1: Create client/src/pages/admin/Orders.jsx**

```jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const statusLabels = {
  pending: 'Menunggu', diambil: 'Diambil', dicuci: 'Dicuci',
  disetrika: 'Disetrika', selesai: 'Selesai', diantar: 'Diantar',
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800', diambil: 'bg-blue-100 text-blue-800',
  dicuci: 'bg-purple-100 text-purple-800', disetrika: 'bg-indigo-100 text-indigo-800',
  selesai: 'bg-green-100 text-green-800', diantar: 'bg-gray-100 text-gray-800',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const url = filter ? `/api/orders?status=${filter}` : '/api/orders';
    fetch(url).then((r) => r.json()).then(setOrders);
  }, [filter]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Daftar Order</h1>

      <div className="flex gap-2 mb-4">
        {['', 'pending', 'diambil', 'dicuci', 'disetrika', 'selesai', 'diantar'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              filter === s ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {s ? statusLabels[s] : 'Semua'}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-500">Order</th>
              <th className="px-4 py-3 font-medium text-gray-500">Pelanggan</th>
              <th className="px-4 py-3 font-medium text-gray-500">Layanan</th>
              <th className="px-4 py-3 font-medium text-gray-500">Total</th>
              <th className="px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 font-medium text-gray-500">Tanggal</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link to={`/admin/orders/${o.id}`} className="text-blue-600 hover:underline font-medium">{o.order_no}</Link>
                </td>
                <td className="px-4 py-3">{o.customer_name}</td>
                <td className="px-4 py-3">{o.service_type}</td>
                <td className="px-4 py-3">Rp {o.total_price.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[o.status]}`}>
                    {statusLabels[o.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{o.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="text-center text-gray-400 py-8">Belum ada order</p>}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add Orders route to App.jsx**

```jsx
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Beranda from './pages/Beranda';
import Harga from './pages/Harga';
import Pesan from './pages/Pesan';
import Tracking from './pages/Tracking';
import Dashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Beranda />} />
        <Route path="/harga" element={<Harga />} />
        <Route path="/pesan" element={<Pesan />} />
        <Route path="/tracking" element={<Tracking />} />
      </Route>
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/orders" element={<Orders />} />
      </Route>
    </Routes>
  );
}

export default App;
```

- [ ] **Step 3: Commit**

```bash
git add client/src/pages/admin/Orders.jsx client/src/App.jsx
git commit -m "feat: add admin orders list with filter by status"
```

---

### Task 12: Create Admin Order Detail page

**Files:**
- Create: `client/src/pages/admin/OrderDetail.jsx`
- Modify: `client/src/App.jsx`

- [ ] **Step 1: Create client/src/pages/admin/OrderDetail.jsx**

```jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const statusFlow = ['pending', 'diambil', 'dicuci', 'disetrika', 'selesai', 'diantar'];
const statusLabels = {
  pending: 'Menunggu', diambil: 'Diambil', dicuci: 'Dicuci',
  disetrika: 'Disetrika', selesai: 'Selesai', diantar: 'Diantar',
};
const statusColors = {
  pending: 'bg-yellow-500', diambil: 'bg-blue-500', dicuci: 'bg-purple-500',
  disetrika: 'bg-indigo-500', selesai: 'bg-green-500', diantar: 'bg-gray-500',
};

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = () => {
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((data) => { setOrder(data); setLoading(false); });
  };

  useEffect(() => { fetchOrder(); }, [id]);

  const handleStatus = async (status) => {
    await fetch(`/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchOrder();
  };

  if (loading) return <p className="text-gray-500">Memuat...</p>;
  if (!order) return <p className="text-red-500">Order tidak ditemukan</p>;

  const currentIdx = statusFlow.indexOf(order.status);

  return (
    <div>
      <Link to="/admin/orders" className="text-sm text-blue-600 hover:underline mb-4 inline-block">&larr; Kembali</Link>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">{order.order_no}</h1>
            <p className="text-gray-500 text-sm">Dibuat: {order.created_at}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${statusColors[order.status]}`}>
            {statusLabels[order.status]}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div><span className="text-gray-500">Nama:</span> <span className="font-medium">{order.customer_name}</span></div>
          <div><span className="text-gray-500">No HP:</span> <span className="font-medium">{order.phone}</span></div>
          <div className="col-span-2"><span className="text-gray-500">Alamat:</span> <span className="font-medium">{order.address || '-'}</span></div>
          <div><span className="text-gray-500">Layanan:</span> <span className="font-medium">{order.service_type}</span></div>
          {order.weight > 0 && <div><span className="text-gray-500">Berat:</span> <span className="font-medium">{order.weight} kg</span></div>}
          <div><span className="text-gray-500">Total:</span> <span className="font-bold text-lg text-blue-600">Rp {order.total_price.toLocaleString()}</span></div>
          {order.pickup ? 1 : 0 ? <div><span className="text-gray-500">Antar Jemput:</span> <span className="font-medium">Ya</span></div> : null}
          {order.notes && <div className="col-span-2"><span className="text-gray-500">Catatan:</span> <span className="font-medium">{order.notes}</span></div>}
        </div>

        {/* Status progression */}
        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4">Update Status</h3>
          <div className="flex flex-wrap gap-2">
            {statusFlow.map((s, i) => (
              <button
                key={s}
                onClick={() => handleStatus(s)}
                disabled={i <= currentIdx}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  i === currentIdx
                    ? 'bg-blue-600 text-white'
                    : i < currentIdx
                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {statusLabels[s]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add OrderDetail route to App.jsx**

```jsx
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Beranda from './pages/Beranda';
import Harga from './pages/Harga';
import Pesan from './pages/Pesan';
import Tracking from './pages/Tracking';
import Dashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';
import OrderDetail from './pages/admin/OrderDetail';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Beranda />} />
        <Route path="/harga" element={<Harga />} />
        <Route path="/pesan" element={<Pesan />} />
        <Route path="/tracking" element={<Tracking />} />
      </Route>
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/orders" element={<Orders />} />
        <Route path="/admin/orders/:id" element={<OrderDetail />} />
      </Route>
    </Routes>
  );
}

export default App;
```

- [ ] **Step 3: Commit**

```bash
git add client/src/pages/admin/OrderDetail.jsx client/src/App.jsx
git commit -m "feat: add admin order detail with status update"
```

---

### Task 13: Create Admin Laporan page

**Files:**
- Create: `client/src/pages/admin/Laporan.jsx`
- Modify: `client/src/App.jsx`

- [ ] **Step 1: Create client/src/pages/admin/Laporan.jsx**

```jsx
import { useState, useEffect } from 'react';

export default function Laporan() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('hari');

  useEffect(() => {
    fetch('/api/orders').then((r) => r.json()).then(setOrders);
  }, []);

  const now = new Date();
  const today = now.toISOString().split('T')[0];

  const filtered = orders.filter((o) => {
    if (filter === 'hari') return o.created_at?.startsWith(today);
    return true;
  });

  const totalRevenue = filtered.reduce((s, o) => s + o.total_price, 0);
  const totalOrders = filtered.length;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Laporan</h1>

      <div className="flex gap-2 mb-4">
        {['hari', 'semua'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {f === 'hari' ? 'Hari Ini' : 'Semua Waktu'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Order</p>
          <p className="text-2xl font-bold text-blue-600">{totalOrders}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Pendapatan</p>
          <p className="text-2xl font-bold text-green-600">Rp {totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-500">Order</th>
              <th className="px-4 py-3 font-medium text-gray-500">Pelanggan</th>
              <th className="px-4 py-3 font-medium text-gray-500">Layanan</th>
              <th className="px-4 py-3 font-medium text-gray-500">Total</th>
              <th className="px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 font-medium text-gray-500">Tanggal</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{o.order_no}</td>
                <td className="px-4 py-3">{o.customer_name}</td>
                <td className="px-4 py-3">{o.service_type}</td>
                <td className="px-4 py-3">Rp {o.total_price.toLocaleString()}</td>
                <td className="px-4 py-3 capitalize">{o.status}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{o.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add Laporan route to App.jsx**

```jsx
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Beranda from './pages/Beranda';
import Harga from './pages/Harga';
import Pesan from './pages/Pesan';
import Tracking from './pages/Tracking';
import Dashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';
import OrderDetail from './pages/admin/OrderDetail';
import Laporan from './pages/admin/Laporan';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Beranda />} />
        <Route path="/harga" element={<Harga />} />
        <Route path="/pesan" element={<Pesan />} />
        <Route path="/tracking" element={<Tracking />} />
      </Route>
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/orders" element={<Orders />} />
        <Route path="/admin/orders/:id" element={<OrderDetail />} />
        <Route path="/admin/laporan" element={<Laporan />} />
      </Route>
    </Routes>
  );
}

export default App;
```

- [ ] **Step 3: Commit**

```bash
git add client/src/pages/admin/Laporan.jsx client/src/App.jsx
git commit -m "feat: add admin laporan page with revenue report"
```

---

### Task 14: Verify app runs end-to-end

**Files:** none (verification only)

- [ ] **Step 1: Start server and test API**

```bash
cd server && node index.js
```

Verify server starts on port 3001 without errors.

- [ ] **Step 2: In a separate terminal, start client**

```bash
cd client && npm run dev
```

Verify Vite dev server starts on port 5173.

- [ ] **Step 3: Test full flow**

1. Open http://localhost:5173 — Beranda page loads with Navbar & Footer
2. Navigate to /harga — pricing table visible
3. Navigate to /pesan — fill form and submit ✅
4. Note the order number shown after submission
5. Navigate to /tracking — enter the order number, see status progress
6. Navigate to /admin — dashboard with today's stats
7. Navigate to /admin/orders — table with the new order
8. Click order number — detail page, change status, verify progress updates
9. Navigate to /admin/laporan — revenue report visible

- [ ] **Step 4: Final commit if any fixes needed**

```bash
git add -A
git commit -m "chore: final adjustments"
```
