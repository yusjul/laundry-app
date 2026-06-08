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
      <h1 className="font-display text-3xl mb-8">Laporan</h1>

      <div className="flex gap-2 mb-6">
        {['hari', 'semua'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-xs uppercase tracking-widest transition-colors ${
              filter === f ? 'bg-ink text-white' : 'bg-white text-ink/50 hover:text-ink'
            }`}
          >
            {f === 'hari' ? 'Hari Ini' : 'Semua Waktu'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-6">
          <p className="text-xs uppercase tracking-widest text-ink/40 mb-2">Total Order</p>
          <p className="font-display text-3xl">{totalOrders}</p>
        </div>
        <div className="bg-white p-6">
          <p className="text-xs uppercase tracking-widest text-ink/40 mb-2">Total Pendapatan</p>
          <p className="font-display text-3xl text-coral">Rp {totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10">
              <th className="text-left px-4 py-4 text-xs uppercase tracking-widest text-ink/40 font-medium">Order</th>
              <th className="text-left px-4 py-4 text-xs uppercase tracking-widest text-ink/40 font-medium">Pelanggan</th>
              <th className="text-left px-4 py-4 text-xs uppercase tracking-widest text-ink/40 font-medium">Layanan</th>
              <th className="text-left px-4 py-4 text-xs uppercase tracking-widest text-ink/40 font-medium">Total</th>
              <th className="text-left px-4 py-4 text-xs uppercase tracking-widest text-ink/40 font-medium">Status</th>
              <th className="text-left px-4 py-4 text-xs uppercase tracking-widest text-ink/40 font-medium">Tanggal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {filtered.map((o) => (
              <tr key={o.id} className="hover:bg-cream/50 transition-colors">
                <td className="px-4 py-4 font-medium">{o.order_no}</td>
                <td className="px-4 py-4">{o.customer_name}</td>
                <td className="px-4 py-4 text-ink/60">{o.service_type}</td>
                <td className="px-4 py-4 font-medium">Rp {o.total_price.toLocaleString()}</td>
                <td className="px-4 py-4 text-xs uppercase tracking-wider text-ink/50">{o.status}</td>
                <td className="px-4 py-4 text-ink/40 text-xs">{o.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
