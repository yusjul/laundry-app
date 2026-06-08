import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const statusFlow = ['pending', 'diambil', 'dicuci', 'disetrika', 'selesai', 'diantar'];
const statusLabels = {
  pending: 'Menunggu', diambil: 'Diambil', dicuci: 'Dicuci',
  disetrika: 'Disetrika', selesai: 'Selesai', diantar: 'Diantar',
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

  if (loading) return <p className="text-ink/50">Memuat...</p>;
  if (!order) return <p className="text-coral">Order tidak ditemukan</p>;

  const currentIdx = statusFlow.indexOf(order.status);

  return (
    <div>
      <Link to="/admin/orders" className="text-xs uppercase tracking-widest text-ink/50 hover:text-ink transition-colors">&larr; Kembali</Link>

      <div className="bg-white p-8 mt-6">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="font-display text-3xl mb-1">{order.order_no}</h1>
            <p className="text-ink/40 text-xs uppercase tracking-wider">{order.created_at}</p>
          </div>
          <span className="text-xs uppercase tracking-wider text-ink/50 bg-ink/5 px-4 py-2">{statusLabels[order.status]}</span>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-10 text-sm">
          {[
            ['Nama', order.customer_name],
            ['No HP', order.phone],
            ['Alamat', order.address || '-'],
            ['Layanan', order.service_type],
            ...(order.weight > 0 ? [['Berat', `${order.weight} kg`]] : []),
            ['Total', <span className="font-display text-xl text-coral">Rp {order.total_price.toLocaleString()}</span>],
            ...(order.pickup ? [['Antar Jemput', 'Ya']] : []),
            ...(order.notes ? [['Catatan', order.notes]] : []),
          ].map(([label, value]) => (
            <div key={label} className={label === 'Alamat' || label === 'Catatan' ? 'col-span-2' : ''}>
              <p className="text-ink/40 text-xs uppercase tracking-wider mb-1">{label}</p>
              <p className="font-medium">{value}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-ink/10 pt-8">
          <h3 className="text-xs uppercase tracking-widest text-ink/40 mb-4">Update Status</h3>
          <div className="flex flex-wrap gap-2">
            {statusFlow.map((s, i) => (
              <button
                key={s}
                onClick={() => handleStatus(s)}
                disabled={i <= currentIdx}
                className={`px-5 py-3 text-xs uppercase tracking-wider transition-all ${
                  i === currentIdx ? 'bg-ink text-white'
                  : i < currentIdx ? 'bg-ink/5 text-ink/30 cursor-not-allowed'
                  : 'bg-white text-ink/60 hover:bg-ink hover:text-white border border-ink/10'
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
