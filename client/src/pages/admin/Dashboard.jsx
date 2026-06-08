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

  if (!data) return <p className="text-ink/50">Memuat...</p>;

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Order Hari Ini', value: data.todayOrders },
          { label: 'Pendapatan Hari Ini', value: `Rp ${data.revenue.toLocaleString()}` },
          { label: 'Total Order', value: data.total },
        ].map((card) => (
          <div key={card.label} className="bg-white p-6">
            <p className="text-xs uppercase tracking-widest text-ink/40 mb-2">{card.label}</p>
            <p className="font-display text-3xl text-ink">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6">
        <h2 className="font-display text-lg mb-4">Status Orders</h2>
        <div className="space-y-2">
          {Object.entries(data.byStatus).map(([status, count]) => (
            <div key={status} className="flex justify-between text-sm py-1">
              <span className="capitalize text-ink/60">{status}</span>
              <span className="font-medium">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <Link to="/admin/orders" className="inline-block mt-4 text-xs uppercase tracking-widest text-ink/50 hover:text-ink transition-colors">
        Lihat Semua Order &rarr;
      </Link>
    </div>
  );
}
