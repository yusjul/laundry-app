import { useState, useEffect } from 'react';

export default function Laporan() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('hari');

  useEffect(() => {
    fetch('/api/orders').then((r) => r.json()).then(setOrders);
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const filtered = orders.filter((o) => filter === 'hari' ? o.created_at?.startsWith(today) : true);
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
