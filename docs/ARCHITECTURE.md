# Dokumentasi Arsitektur LundryKu

Dokumen ini menjelaskan rancangan arsitektur folder proyek, skema database MySQL, serta logika Layout Switcher untuk mendukung pembagian fungsionalitas antara tampilan Desktop (Landing Page & Dokumentasi) dan tampilan Mobile (Customer, Admin, Kurir).

---

## 1. Struktur Folder Proyek (Folder Architecture)

Untuk memisahkan logika dan tampilan Desktop dengan Mobile secara rapi dalam satu proyek React, struktur folder berikut memisahkan halaman berdasarkan platform (`desktop` vs `mobile`) dan membagi fitur mobile berdasarkan role (`customer`, `admin`, `kurir`).

```text
laundry-app/
├── client/
│   ├── public/
│   └── src/
│       ├── assets/             # Aset statis seperti logo, gambar galeri, ikon
│       │   ├── images/
│       │   └── icons/
│       ├── components/         # Komponen UI global (Reusable)
│       │   ├── ui/             # Komponen primitif atomic (Button, Card, Input, Badge, Select)
│       │   └── shared/         # Komponen lintas halaman (MapLeaflet, Stepper, StatusPill)
│       ├── context/            # Global State Management (e.g., AuthContext, OrderContext)
│       │   └── AuthContext.jsx
│       ├── hooks/              # Custom React Hooks
│       │   ├── useIsMobile.js  # Deteksi ukuran layar (media query)
│       │   └── useGeolocation.js
│       ├── layouts/            # Layout wrappers untuk setiap segmen pengguna
│       │   ├── ResponsiveLayout.jsx # Switcher utama berdasarkan ukuran layar
│       │   ├── DesktopLayout.jsx    # Wrapper navigasi & footer layar laptop
│       │   ├── CustomerLayout.jsx   # Bottom navigation bar khusus customer di HP
│       │   ├── AdminLayout.jsx      # Bottom navbar / sidebar drawer khusus admin di HP
│       │   └── KurirLayout.jsx      # Top/Bottom navigation khusus kurir di HP
│       ├── pages/              # Halaman-halaman (Views)
│       │   ├── desktop/        # Halaman khusus laptop/desktop
│       │   │   ├── LandingPage.jsx # Berisi galeri foto & instruksi mockup device
│       │   │   └── Dokumentasi.jsx # Petunjuk penggunaan mendalam
│       │   └── mobile/          # Halaman khusus smartphone (Core System)
│       │       ├── shared/     # Halaman mobile yang bisa diakses semua/beberapa role
│       │       │   ├── Login.jsx
│       │       │   └── Profile.jsx
│       │       ├── customer/   # Fitur & Menu Role Customer
│       │       │   ├── PesanCucian.jsx    # Form order dengan Leaflet.js & +62 phone
│       │       │   ├── CekTarif.jsx       # List vertikal interaktif tarif laundry
│       │       │   └── TrackingStatus.jsx # Vertical stepper pelacakan order
│       │       ├── admin/      # Fitur & Menu Role Admin Laundry
│       │       │   ├── DashboardFinansial.jsx # Ringkasan pendapatan, pengeluaran & profit
│       │       │   ├── OrderManagement.jsx    # Manajemen order AJAX + WA Gateway trigger
│       │       │   └── LaporanKeuangan.jsx    # Export PDF (jsPDF) & Excel (SheetJS)
│       │       └── kurir/      # Fitur & Menu Role Kurir
│       │           └── TugasKurir.jsx         # Jadwal Jemput/Antar, WhatsApp chat & Google Maps
│       ├── services/           # Service API (Axios / Fetch instances)
│       │   ├── api.js          # Base Axios config
│       │   └── socket.js       # Real-time update (Optional)
│       ├── utils/              # Helper functions & formatter
│       │   ├── exportHelper.js # Handler ekspor Excel & PDF
│       │   └── formatters.js   # Format mata uang rupiah, format nomor HP, dll.
│       ├── App.jsx             # Entrypoint Routing (memuat ResponsiveLayout)
│       ├── index.css           # Integrasi Tailwind CSS & custom styling
│       └── main.jsx
└── server/                     # Backend API (Node.js/Express, Laravel, dll.)
```

### Keunggulan Struktur Ini:
1. **Clean Separation of Concerns**: Developer yang mengerjakan Landing Page desktop tidak akan mengotori logika operasional mobile.
2. **Role-Based Views**: Kode untuk Customer, Admin, dan Kurir terisolasi dengan baik di folder masing-masing, mempermudah pemeliharaan jangka panjang.
3. **Optimized Bundle Size**: Jika dikonfigurasi dengan `React.lazy` (Dynamic Imports), pengguna mobile tidak perlu men-download asset/komponen khusus desktop yang berat, begitu juga sebaliknya.

---

## 2. Skema Database (MySQL)

Skema database relasional berikut dirancang untuk mendukung ekosistem **LundryKu** dengan 3 role user, pencatatan koordinat GPS jemput, pelacakan kurir jemput/antar, serta pencatatan pengeluaran finansial.

```sql
-- 1. TABEL USERS (Menampung Admin, Kurir, dan Customer)
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) UNIQUE NULL, -- Opsional bagi customer, wajib bagi admin
  `phone_number` VARCHAR(20) UNIQUE NOT NULL, -- Format wajib '+62xxxxxxxxxxx' untuk WhatsApp
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'kurir', 'customer') NOT NULL DEFAULT 'customer',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_role (`role`),
  INDEX idx_user_phone (`phone_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. TABEL ORDERS (Menyimpan transaksi laundry, lokasi maps, status, dan penugasan kurir)
CREATE TABLE `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_number` VARCHAR(50) UNIQUE NOT NULL, -- Contoh: LND-20260608-0001
  `customer_id` INT NOT NULL,
  `service_name` VARCHAR(100) NOT NULL, -- Misal: Cuci Kering Setrika, Setrika Saja
  `weight` DECIMAL(5,2) DEFAULT NULL, -- Diisi oleh admin setelah pakaian ditimbang
  `total_price` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  
  -- Integrasi Leaflet.js
  `pickup_address` TEXT NOT NULL,
  `pickup_latitude` DECIMAL(10, 8) DEFAULT NULL, -- Latitude jemput
  `pickup_longitude` DECIMAL(11, 8) DEFAULT NULL, -- Longitude jemput
  
  -- Status Operasional
  `status` ENUM('menunggu', 'diambil', 'dicuci', 'selesai', 'diantar') NOT NULL DEFAULT 'menunggu',
  `payment_status` ENUM('belum_bayar', 'lunas') NOT NULL DEFAULT 'belum_bayar',
  
  -- Penugasan Kurir (Bisa berbeda antara kurir jemput dan kurir antar)
  `id_kurir_jemput` INT DEFAULT NULL,
  `id_kurir_antar` INT DEFAULT NULL,
  
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Relasi FK (Foreign Key)
  CONSTRAINT `fk_order_customer` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_kurir_jemput` FOREIGN KEY (`id_kurir_jemput`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_order_kurir_antar` FOREIGN KEY (`id_kurir_antar`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  
  -- Indexing untuk query yang cepat
  INDEX idx_order_status (`status`),
  INDEX idx_order_number (`order_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. TABEL EXPENSES (Mencatat pengeluaran operasional laundry oleh Admin)
CREATE TABLE `expenses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(150) NOT NULL, -- Contoh: Beli Deterjen 10 Kg, Bayar Listrik
  `amount` DECIMAL(12,2) NOT NULL,
  `category` VARCHAR(50) NOT NULL, -- e.g., 'bahan_baku', 'operasional', 'gaji', 'utilitas'
  `expense_date` DATE NOT NULL,
  `created_by` INT NOT NULL, -- User ID admin yang menginput
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT `fk_expense_admin` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
  INDEX idx_expense_date (`expense_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Relasi & Alur Operasional pada Database:
- Ketika Customer memesan via Mobile, baris baru masuk ke `orders` dengan status `'menunggu'`. Koordinat GPS (`pickup_latitude` & `pickup_longitude`) disimpan dari peta Leaflet.js.
- Admin melihat order masuk di Dashboard Finansial, lalu menunjuk seorang Kurir dengan memperbarui `id_kurir_jemput`.
- Kurir melihat tugas jemput di HP-nya. Begitu pakaian diambil, Kurir menekan tombol "Selesai Jemput". Status order di-update menjadi `'diambil'`.
- Pakaian masuk workshop. Admin menimbang berat (`weight`) dan menghitung harga (`total_price`), status diubah ke `'dicuci'` (memicu notifikasi WA otomatis melalui gateway API).
- Setelah selesai, admin mengubah status ke `'selesai'`. Kurir ditunjuk (`id_kurir_antar`) untuk mengantar.
- Kurir mengantar, menekan tombol "Selesai Antar", status berubah menjadi `'diantar'` (laundry selesai total).

---

## 3. Implementasi Switcher Layout Utama (Responsive Layout Wrapper)

Berikut adalah komponen React untuk mendeteksi ukuran layar secara dinamis dan efisien menggunakan `matchMedia` (bukan resize handler biasa untuk performa lebih baik).

### A. Custom Hook: `src/hooks/useIsMobile.js`
Hook ini mendengarkan perubahan resolusi secara real-time pada breakpoints Tailwind CSS `md` (768px).

```javascript
import { useState, useEffect } from 'react';

/**
 * Custom Hook untuk mendeteksi apakah layar berukuran mobile (< 768px).
 * Menggunakan matchMedia untuk performa rendering yang optimal.
 */
export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Breakpoint Tailwind md adalah 768px
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    
    // Set status awal
    setIsMobile(mediaQuery.matches);

    // Listener untuk perubahan ukuran layar
    const handleChange = (e) => {
      setIsMobile(e.matches);
    };

    // Support browser modern dan lawas
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return isMobile;
}
```

### B. Komponen Switcher Utama: `src/layouts/ResponsiveLayout.jsx`
Mengatur pergantian komponen utama antara Landing Page Desktop dan Dashboard Mobile (lengkap dengan routing hak akses).

```jsx
import React from 'react';
import useIsMobile from '../hooks/useIsMobile';
import DesktopLandingPage from '../pages/desktop/LandingPage';
import MobileRouter from '../pages/mobile/MobileRouter';

export default function ResponsiveLayout() {
  const isMobile = useIsMobile();

  // Switch layouts dynamically
  return isMobile ? <MobileRouter /> : <DesktopLandingPage />;
}
```

### C. Implementasi `App.jsx`
Menghubungkan `ResponsiveLayout` ke routing utama React Router.

```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResponsiveLayout from './layouts/ResponsiveLayout';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* ResponsiveLayout akan mendeteksi apakah merender Desktop Landing atau Mobile System */}
        <Route path="/*" element={<ResponsiveLayout />} />
      </Routes>
    </Router>
  );
}
```

---

## 4. Contoh Halaman Desktop & Mobile Router (Stubs & Implementasi Router)

### A. Tampilan Desktop: `src/pages/desktop/LandingPage.jsx`
Menampilkan landing page yang mewah dengan Tailwind CSS, menyertakan galeri foto operasional, mockup ponsel, dan pesan tegas agar pengguna mengakses web via smartphone untuk operasional.

```jsx
import React from 'react';

export default function DesktopLandingPage() {
  // Mock data foto dokumentasi laundry
  const galleryPhotos = [
    { id: 1, title: 'Mesin Cuci Industrial', desc: 'Teknologi cuci modern & higienis', url: 'https://images.unsplash.com/photo-1545173168-9f1947eebd01?auto=format&fit=crop&w=600&q=80' },
    { id: 2, title: 'Setrika Uap Presisi', desc: 'Pakaian rapi tanpa merusak serat kain', url: 'https://images.unsplash.com/photo-1489274495757-95c7c837b101?auto=format&fit=crop&w=600&q=80' },
    { id: 3, title: 'Quality Control', desc: 'Pemeriksaan noda detail dan wewangian premium', url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=80' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navbar Desktop */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
            LK
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            LundryKu
          </span>
        </div>
        <nav className="flex items-center gap-6">
          <a href="#fitur" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Fitur</a>
          <a href="#galeri" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Galeri</a>
          <a href="#panduan" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Cara Pesan</a>
        </nav>
      </header>

      {/* Hero & Device Mockup Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Teks Utama */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            ✨ Web Info & Dokumentasi Desktop
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Operasional Laundry Modern dalam <span className="bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">Genggaman Anda</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-xl">
            LundryKu menyederhanakan cara Anda mencuci. Jemput gratis, pelacakan real-time, dan kualitas terjamin dari tim profesional kami.
          </p>

          {/* Pengumuman Khusus Akses Mobile (Callout Box Premium) */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20 shadow-md">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                📱
              </div>
              <div>
                <h4 className="font-bold text-amber-200">Akses Khusus Smartphone</h4>
                <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                  Untuk melakukan pemesanan, mengecek tarif interaktif, memantau tracking status cucian, serta mengelola operasional (Admin & Kurir), silakan buka dan akses website ini melalui **Smartphone / HP Anda**.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Device Mockup */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-72 h-[560px] bg-slate-950 rounded-[40px] p-3 border-4 border-slate-800 shadow-2xl shadow-indigo-500/10 flex flex-col overflow-hidden">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-20 flex items-center justify-center">
              <div className="w-12 h-1.5 bg-slate-900 rounded-full"></div>
            </div>
            
            {/* Mock Screen Content */}
            <div className="flex-1 rounded-[32px] bg-slate-900 p-4 pt-8 flex flex-col justify-between relative overflow-hidden select-none">
              <div className="space-y-4">
                {/* Header Mockup */}
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500">LundryKu App</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                </div>
                {/* Promo Card Mockup */}
                <div className="p-3 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl space-y-1">
                  <p className="text-[10px] text-indigo-200 font-medium">Diskon Pengguna Baru</p>
                  <p className="text-sm font-bold text-white">Potongan 20% Cucian Pertama</p>
                </div>
                {/* Quick actions Mockup */}
                <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                  <div className="p-3 bg-slate-800 rounded-xl font-semibold border border-slate-700">🧺 Pesan Laundry</div>
                  <div className="p-3 bg-slate-800 rounded-xl font-semibold border border-slate-700">📋 Cek Tarif</div>
                </div>
                {/* Stepper Mockup */}
                <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-800">
                  <p className="text-[10px] text-slate-400 font-bold mb-2">📋 LND-2026-0034</p>
                  <div className="space-y-2 text-[10px]">
                    <div className="flex items-center gap-2 text-indigo-400 font-medium">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Dicuci (Sedang Diproses)
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center pb-2">
                <span className="text-[9px] text-slate-500 font-medium">Pindai QR atau Akses via HP Anda</span>
                <div className="w-20 h-20 bg-white p-1 rounded-lg mx-auto mt-2 flex items-center justify-center">
                  {/* QR Code Placeholder */}
                  <div className="w-full h-full bg-slate-300 rounded border border-slate-400 border-dashed flex items-center justify-center text-[10px] text-slate-600 font-bold">QR CODE</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Gallery Section */}
      <section id="galeri" className="bg-slate-950 py-16 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
            <h2 className="text-3xl font-bold">Galeri Operasional Laundry</h2>
            <p className="text-slate-400 text-sm">Lihat langsung proses pencucian profesional kami untuk memastikan kebersihan pakaian berharga Anda.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {galleryPhotos.map(photo => (
              <div key={photo.id} className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-lg hover:border-indigo-500/50 transition-all duration-300">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={photo.url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors">{photo.title}</h4>
                  <p className="text-slate-400 text-xs mt-1">{photo.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 text-center text-slate-500 text-xs">
        <p>© 2026 LundryKu. All Rights Reserved. Didesain untuk kenyamanan operasional mobile.</p>
      </footer>
    </div>
  );
}
```

### B. Router Mobile dengan Proteksi Role: `src/pages/mobile/MobileRouter.jsx`
Mengatur otentikasi login dan pengalihan dashboard berdasarkan hak akses (Role-Based Access Control) khusus di platform mobile.

```jsx
import React, { useState } from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';

// Import Halaman Mobile sesuai Role
import MobileLogin from './shared/Login';
import PesanCucian from './customer/PesanCucian';
import CekTarif from './customer/CekTarif';
import TrackingStatus from './customer/TrackingStatus';
import DashboardFinansial from './admin/DashboardFinansial';
import OrderManagement from './admin/OrderManagement';
import LaporanKeuangan from './admin/LaporanKeuangan';
import TugasKurir from './kurir/TugasKurir';

export default function MobileRouter() {
  // Simulasi state login & role user (Dapat dikoneksikan ke Context/Redux)
  // user: { name: 'Joko', role: 'customer' | 'admin' | 'kurir' } atau null jika belum login
  const [user, setUser] = useState({ name: 'Budi Kurir', role: 'kurir' }); // default login sebagai kurir untuk demo
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans max-w-[767px] mx-auto border-x border-slate-800 shadow-2xl relative">
      {/* Mobile Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
            LK
          </div>
          <span className="font-extrabold text-sm tracking-wide">LundryKu Mobile</span>
        </div>
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
              {user.name} ({user.role.toUpperCase()})
            </span>
            <button onClick={handleLogout} className="text-xs text-rose-400 hover:text-rose-300 font-semibold transition-colors">
              Keluar
            </button>
          </div>
        ) : (
          <Link to="/login" className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1.5 rounded-lg transition-colors">
            Masuk
          </Link>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-20 overflow-y-auto">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<MobileLogin onLogin={(u) => { setUser(u); navigate('/'); }} />} />

          {/* Protected Dashboard Route Redirector */}
          <Route path="/" element={
            user ? (
              user.role === 'customer' ? <Navigate to="/customer/pesan" replace /> :
              user.role === 'admin' ? <Navigate to="/admin/dashboard" replace /> :
              user.role === 'kurir' ? <Navigate to="/kurir/tugas" replace /> :
              <Navigate to="/login" replace />
            ) : <Navigate to="/login" replace />
          } />

          {/* CUSTOMER ROUTES */}
          <Route path="/customer/pesan" element={
            <RequireRole user={user} allowedRole="customer">
              <PesanCucian />
            </RequireRole>
          } />
          <Route path="/customer/tarif" element={
            <RequireRole user={user} allowedRole="customer">
              <CekTarif />
            </RequireRole>
          } />
          <Route path="/customer/tracking" element={
            <RequireRole user={user} allowedRole="customer">
              <TrackingStatus />
            </RequireRole>
          } />

          {/* ADMIN ROUTES */}
          <Route path="/admin/dashboard" element={
            <RequireRole user={user} allowedRole="admin">
              <DashboardFinansial />
            </RequireRole>
          } />
          <Route path="/admin/orders" element={
            <RequireRole user={user} allowedRole="admin">
              <OrderManagement />
            </RequireRole>
          } />
          <Route path="/admin/laporan" element={
            <RequireRole user={user} allowedRole="admin">
              <LaporanKeuangan />
            </RequireRole>
          } />

          {/* KURIR ROUTES */}
          <Route path="/kurir/tugas" element={
            <RequireRole user={user} allowedRole="kurir">
              <TugasKurir />
            </RequireRole>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Bottom Nav Bar (Hanya tampil jika user login) */}
      {user && (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[767px] bg-slate-900 border-t border-slate-800 py-2 px-4 flex justify-around items-center z-40">
          {user.role === 'customer' && (
            <>
              <Link to="/customer/pesan" className="flex flex-col items-center text-xs gap-1 text-slate-400 hover:text-indigo-400">
                <span>🧺</span><span>Pesan</span>
              </Link>
              <Link to="/customer/tarif" className="flex flex-col items-center text-xs gap-1 text-slate-400 hover:text-indigo-400">
                <span>💰</span><span>Tarif</span>
              </Link>
              <Link to="/customer/tracking" className="flex flex-col items-center text-xs gap-1 text-slate-400 hover:text-indigo-400">
                <span>📍</span><span>Tracking</span>
              </Link>
            </>
          )}
          {user.role === 'admin' && (
            <>
              <Link to="/admin/dashboard" className="flex flex-col items-center text-xs gap-1 text-slate-400 hover:text-indigo-400">
                <span>📊</span><span>Keuangan</span>
              </Link>
              <Link to="/admin/orders" className="flex flex-col items-center text-xs gap-1 text-slate-400 hover:text-indigo-400">
                <span>📋</span><span>Pesanan</span>
              </Link>
              <Link to="/admin/laporan" className="flex flex-col items-center text-xs gap-1 text-slate-400 hover:text-indigo-400">
                <span>📝</span><span>Laporan</span>
              </Link>
            </>
          )}
          {user.role === 'kurir' && (
            <Link to="/kurir/tugas" className="flex flex-col items-center text-xs gap-1 text-indigo-400">
              <span>🚚</span><span>Tugas Aktif ({user.name.split(' ')[0]})</span>
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}

// Wrapper Helper untuk Proteksi Halaman berdasarkan Role
function RequireRole({ user, allowedRole, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== allowedRole) {
    return (
      <div className="p-8 text-center text-rose-400 font-semibold space-y-4">
        <p>🚫 Akses ditolak! Anda tidak memiliki izin untuk melihat halaman ini.</p>
        <Link to="/" className="inline-block text-xs bg-slate-800 text-slate-300 font-bold px-4 py-2 rounded-lg border border-slate-700 hover:text-white">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }
  return children;
}
```

---

## 5. Implementasi UI Fitur Utama (Code Snippet Tailwind CSS Premium)

Berikut adalah contoh snippet UI Tailwind CSS yang bersih, interaktif, dan premium untuk tiap role:

### A. Customer: Form Pesan Cucian (1-Tap Selection & No HP +62 & Leaflet Map Stub)
*File: `src/pages/mobile/customer/PesanCucian.jsx`*

```jsx
import React, { useState } from 'react';

export default function PesanCucian() {
  const [selectedService, setSelectedService] = useState('cuci_komplit');
  const [phone, setPhone] = useState('');

  const services = [
    { id: 'cuci_komplit', name: 'Cuci Komplit', price: 'Rp 8.000/kg', icon: '🧺', time: '1-2 hari' },
    { id: 'setrika_saja', name: 'Setrika Saja', price: 'Rp 5.000/kg', icon: '💨', time: '1 hari' },
    { id: 'express', name: 'Express Kilat', price: 'Rp 15.000/kg', icon: '⚡', time: '6 jam' },
  ];

  const handlePhoneChange = (e) => {
    const val = e.target.value;
    // Otomatisasi prefix +62
    if (!val.startsWith('+62')) {
      setPhone('+62' + val.replace(/^\+?62|^0/, ''));
    } else {
      setPhone(val);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white">Pesan Laundry</h2>
        <p className="text-xs text-slate-400">Isi detail penjemputan pakaian bersih dan cepat.</p>
      </div>

      {/* 1. 1-Tap Selection (Radio Cards) */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400">Pilih Layanan</label>
        <div className="grid grid-cols-1 gap-3">
          {services.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedService(item.id)}
              className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-all duration-200 ${
                selectedService === item.id
                  ? 'bg-indigo-600/10 border-indigo-500 shadow-md shadow-indigo-500/5'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h4 className="font-bold text-sm text-white">{item.name}</h4>
                  <p className="text-[10px] text-slate-400">Estimasi selesai: {item.time}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-indigo-400">{item.price}</span>
                <div className="flex justify-end mt-1">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedService === item.id ? 'border-indigo-500' : 'border-slate-600'}`}>
                    {selectedService === item.id && <div className="w-2 h-2 rounded-full bg-indigo-500"></div>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Input Nomor HP Otomatis (+62) */}
      <div className="space-y-2">
        <label htmlFor="phoneInput" className="text-xs font-semibold text-slate-400">Nomor WhatsApp Aktif</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-semibold pointer-events-none">📱</span>
          <input
            id="phoneInput"
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="+628123456789"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 text-white placeholder-slate-600"
          />
        </div>
        <p className="text-[10px] text-slate-500">Pemberitahuan status cucian akan dikirim otomatis ke nomor ini.</p>
      </div>

      {/* 3. Peta Leaflet.js (Placeholder Visual Mockup Peta Leaflet) */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400">Titik Lokasi Jemput Presisi</label>
        <div className="h-44 rounded-xl border border-slate-800 bg-slate-900 overflow-hidden relative flex items-center justify-center">
          {/* Simulated Map Background */}
          <div className="absolute inset-0 bg-slate-950 opacity-40 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]"></div>
          {/* Pin Marker */}
          <div className="z-10 flex flex-col items-center gap-1 animate-bounce">
            <span className="text-3xl text-rose-500">📍</span>
            <div className="w-4 h-1.5 bg-slate-950/60 rounded-full blur-[1px]"></div>
          </div>
          {/* Map Controls Interface */}
          <div className="absolute top-2 right-2 bg-slate-800/90 border border-slate-700 rounded p-1 flex flex-col gap-1 z-10 text-[10px]">
            <button className="w-6 h-6 rounded bg-slate-700 hover:bg-slate-600 flex items-center justify-center font-bold text-white">+</button>
            <button className="w-6 h-6 rounded bg-slate-700 hover:bg-slate-600 flex items-center justify-center font-bold text-white">-</button>
          </div>
          <div className="absolute bottom-2 left-2 bg-slate-900/90 border border-slate-800 px-2.5 py-1.5 rounded-lg z-10 text-[9px] text-slate-300">
            📍 Lat: -6.2088 | Lng: 106.8456
          </div>
        </div>
      </div>

      <button className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">
        Pesan Penjemputan Sekarang
      </button>
    </div>
  );
}
```

### B. Admin: Dashboard Finansial & AJAX Order Management & Export
*File: `src/pages/mobile/admin/OrderManagement.jsx`*

```jsx
import React, { useState } from 'react';

export default function OrderManagement() {
  const [orders, setOrders] = useState([
    { id: 1, name: 'Budi Santoso', phone: '+628123456789', status: 'menunggu', total: 45000 },
    { id: 2, name: 'Siti Rahma', phone: '+628987654321', status: 'dicuci', total: 68000 },
  ]);

  // Simulasi Update Status Menggunakan Fetch / AJAX
  const updateOrderStatus = async (orderId, newStatus) => {
    // 1. Update State di Frontend terlebih dahulu (optimistic update)
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

    try {
      // 2. Fetch API request ke backend
      /*
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      */
      
      // Memicu trigger WhatsApp Gateway Notification di Backend
      console.log(`[WhatsApp Gateway] Notifikasi terkirim ke order #${orderId} dengan status baru: ${newStatus}`);
      alert(`Status order berhasil diperbarui menjadi "${newStatus}". Notifikasi WhatsApp otomatis telah dikirim.`);
    } catch (err) {
      console.error("Gagal mengupdate status: ", err);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-bold text-white">Manajemen Order Masuk</h3>

      <div className="space-y-3">
        {orders.map(order => (
          <div key={order.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-sm text-white">{order.name}</h4>
                <p className="text-[10px] text-slate-400">{order.phone}</p>
              </div>
              <span className="text-xs font-bold text-indigo-400">Rp {order.total.toLocaleString()}</span>
            </div>

            {/* Quick-Action Status Selector */}
            <div className="flex items-center justify-between border-t border-slate-800/80 pt-2.5">
              <label htmlFor={`statusSelect-${order.id}`} className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Status Laundry</label>
              <select
                id={`statusSelect-${order.id}`}
                value={order.status}
                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs font-medium rounded-lg px-2.5 py-1 text-slate-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="menunggu">Menunggu</option>
                <option value="diambil">Diambil</option>
                <option value="dicuci">Dicuci</option>
                <option value="selesai">Selesai</option>
                <option value="diantar">Diantar</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### C. Kurir: Daftar Tugas (Tabs & WhatsApp Direct Link & Google Maps Route)
*File: `src/pages/mobile/kurir/TugasKurir.jsx`*

```jsx
import React, { useState } from 'react';

export default function TugasKurir() {
  const [activeTab, setActiveTab] = useState('jemput'); // 'jemput' atau 'antar'
  const [tasks, setTasks] = useState([
    { id: 101, name: 'Farhan Maulana', phone: '6282299887766', address: 'Jl. Merdeka No. 45, Jakarta Pusat', lat: -6.2088, lng: 106.8456, type: 'jemput', status: 'pending' },
    { id: 102, name: 'Anisa Putri', phone: '6281122334455', address: 'Apartemen Green Bay Tower C Lt 8', lat: -6.1012, lng: 106.7824, type: 'antar', status: 'pending' },
  ]);

  const handleCompleteTask = (taskId, newStatus) => {
    setTasks(prev => prev.filter(t => t.id !== taskId)); // Hapus dari tab tugas aktif setelah diselesaikan
    alert(`Tugas #${taskId} dinyatakan selesai (${newStatus}). Database di-update real-time.`);
  };

  const filteredTasks = tasks.filter(t => t.type === activeTab);

  return (
    <div className="p-4 space-y-4">
      {/* 2 Tab Tugas Aktif */}
      <div className="flex border-b border-slate-800 p-0.5 bg-slate-900 rounded-xl">
        <button
          onClick={() => setActiveTab('jemput')}
          className={`flex-1 py-2.5 text-center text-xs font-bold rounded-lg transition-all ${
            activeTab === 'jemput' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          📅 Jadwal Jemput Pakaian
        </button>
        <button
          onClick={() => setActiveTab('antar')}
          className={`flex-1 py-2.5 text-center text-xs font-bold rounded-lg transition-all ${
            activeTab === 'antar' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🚚 Jadwal Antar Pakaian
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs font-medium">🎉 Tidak ada jadwal tugas aktif saat ini.</div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-sm text-white">{task.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{task.address}</p>
                </div>
                <span className="text-[10px] bg-slate-800 border border-slate-700 px-2 py-0.5 rounded font-mono text-slate-300">ID: #{task.id}</span>
              </div>

              {/* Aksi & Navigasi */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                {/* Hubungi Pelanggan via WhatsApp */}
                <a
                  href={`https://wa.me/${task.phone}?text=Halo%20${encodeURIComponent(task.name)}%2C%20saya%20kurir%20LundryKu%20sedang%20menuju%20ke%20lokasi%20Anda.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600/10 border border-emerald-500/20 hover:bg-emerald-600/20 text-emerald-400 text-xs font-bold rounded-lg text-center transition-all"
                >
                  💬 Chat WhatsApp
                </a>

                {/* Buka Rute Peta (Google Maps Deep-link) */}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${task.lat},${task.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-sky-600/10 border border-sky-500/20 hover:bg-sky-600/20 text-sky-400 text-xs font-bold rounded-lg text-center transition-all"
                >
                  🗺️ Buka Rute Peta
                </a>
              </div>

              {/* Tombol Selesai Tugas Cepat */}
              <button
                onClick={() => handleCompleteTask(task.id, task.type === 'jemput' ? 'diambil' : 'diantar')}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-xs font-bold rounded-lg transition-all"
              >
                {task.type === 'jemput' ? '✓ Pakaian Telah Diambil' : '✓ Pakaian Telah Diterima Pelanggan'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

---

## 6. Validasi & Integrasi Ekspor Laporan Finansial

Untuk mempermudah admin menghasilkan laporan keuangan di sisi klien (*client-side export*), implementasikan logic pada helper `exportHelper.js` menggunakan SheetJS dan jsPDF.

```javascript
// src/utils/exportHelper.js
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * Ekspor data transaksi keuangan ke format Excel (.xlsx) menggunakan SheetJS
 */
export function exportToExcel(data, fileName = 'Laporan_Keuangan_LundryKu') {
  // Ubah format data array objek menjadi sheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Keuangan');
  
  // Tulis file
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

/**
 * Ekspor data ke format PDF menggunakan jsPDF dan jsPDF-AutoTable
 */
export function exportToPDF(headers, data, title = 'Laporan Keuangan LundryKu', fileName = 'Laporan_Keuangan') {
  const doc = new jsPDF();
  
  // Header dokumen PDF
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`, 14, 22);
  
  // Format tabel otomatis
  doc.autoTable({
    head: [headers],
    body: data,
    startY: 28,
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229] }, // Warna indigo-600
  });
  
  doc.save(`${fileName}.pdf`);
}
```
