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

      <div className="flex gap-2 mb-4 flex-wrap">
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
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[o.status]}`}>{statusLabels[o.status]}</span>
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
