import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/orders')
      .then((r) => r.json())
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
