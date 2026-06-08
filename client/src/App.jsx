import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Beranda from './pages/Beranda';
import Harga from './pages/Harga';
import Pesan from './pages/Pesan/index';
import Tracking from './pages/Tracking';
import Dashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';
import OrderDetail from './pages/admin/OrderDetail';
import Laporan from './pages/admin/Laporan';

export default function App() {
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
