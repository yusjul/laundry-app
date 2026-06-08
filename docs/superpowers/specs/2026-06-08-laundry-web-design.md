# Laundry Web App - Design Spec

## Tech Stack
- **Frontend:** React 18 + Vite + React Router v6 + Tailwind CSS
- **Backend:** Node.js + Express.js
- **Database:** SQLite (better-sqlite3)
- **Version Control:** Git, commit tiap perubahan

## Pages

### Publik (tanpa login)
1. **Beranda** — Hero section, layanan unggulan, harga sekilas, CTA
2. **Layanan & Harga** — Daftar harga per kg (cuci kering, cuci setrika, dry clean, bed cover, dll)
3. **Pesan Cucian** — Form order: nama, alamat, no HP, jenis layanan, antar/jemput, catatan
4. **Tracking** — Cari status cucian via nomor order / no HP

### Admin
5. **Dashboard** — Ringkasan: total order hari ini, pending, proses, selesai, pendapatan hari ini
6. **Daftar Order** — Tabel semua order, bisa filter status & tanggal
7. **Detail Order** — Lihat detail, ubah status (pending → diambil → dicuci → disetrika → selesai → diantar/diambil)
8. **Laporan** — Pendapatan per hari/minggu/bulan

## Database Schema

### `orders`
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER PK | Auto increment |
| order_no | TEXT | Nomor order unik |
| customer_name | TEXT | Nama pelanggan |
| phone | TEXT | No HP |
| address | TEXT | Alamat |
| service_type | TEXT | Jenis layanan |
| weight | REAL | Berat (kg) |
| pickup | INTEGER | Antar jemput (0/1) |
| notes | TEXT | Catatan |
| status | TEXT | pending/diambil/dicuci/disetrika/selesai/diantar |
| total_price | REAL | Total harga |
| created_at | DATETIME | |
| updated_at | DATETIME | |

## API Endpoints

### Orders
- `GET /api/orders` — List orders (admin)
- `GET /api/orders/:id` — Detail order
- `POST /api/orders` — Buat order baru
- `PATCH /api/orders/:id/status` — Update status
- `GET /api/orders/track?no=<order_no>` — Tracking publik

## Frontend Routes
- `/` — Beranda
- `/harga` — Layanan & Harga
- `/pesan` — Pesan Cucian
- `/tracking` — Tracking
- `/admin` — Dashboard
- `/admin/orders` — Daftar Order
- `/admin/orders/:id` — Detail Order
- `/admin/laporan` — Laporan

## Project Structure
```
laundry-app/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── pages/           # Beranda, Harga, Pesan, Tracking, Admin
│   │   ├── components/      # Shared components (Navbar, Footer, Card, dll)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
├── server/                  # Express backend
│   ├── routes/             ｜ orders.js
│   ├── db.js               ｜ SQLite setup
│   └── index.js            ｜ Entry point
├── docs/superpowers/specs/
└── package.json
```

## Pricing Structure
- Cuci Kering: Rp 7.000/kg
- Cuci Setrika: Rp 10.000/kg
- Dry Clean: Rp 15.000/item
- Bed Cover: Rp 25.000/item
- Antar Jemput: Rp 5.000 (opsional)
