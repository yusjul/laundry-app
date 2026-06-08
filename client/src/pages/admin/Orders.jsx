import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pencil, Trash2, CheckCircle } from 'lucide-react';

const statusFlow = ['pending', 'diambil', 'dicuci', 'disetrika', 'selesai', 'diantar'];
const statusLabels = {
  pending: 'Menunggu', diambil: 'Diambil', dicuci: 'Dicuci',
  disetrika: 'Disetrika', selesai: 'Selesai', diantar: 'Diantar',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    const url = filter ? `/api/orders?status=${filter}` : '/api/orders';
    fetch(url, { signal: controller.signal })
      .then((r) => { if (!r.ok) throw new Error('Gagal memuat data'); return r.json(); })
      .then(setOrders)
      .catch((err) => setError(err.name === 'AbortError' ? 'Server tidak merespons' : err.message));
    return () => { clearTimeout(timer); controller.abort(); };
  }, [filter]);

  const handleDelete = async (id, orderNo) => {
    if (!window.confirm(`Yakin hapus order ${orderNo}?`)) return;
    const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
      showToast('Order berhasil dihapus');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: newStatus } : o));
        showToast(`Status berhasil diupdate ke ${statusLabels[newStatus]}`);
      }
    } catch {
      showToast('Gagal update status');
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  if (error) return <p className="text-coral text-sm p-4 md:p-8">{error}. <button onClick={() => window.location.reload()} className="underline">Muat ulang</button></p>;

  return (
    <div>
      <h1 className="font-display text-2xl md:text-3xl mb-6 md:mb-8">Daftar Order</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['', ...statusFlow].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 text-xs uppercase tracking-widest transition-colors ${
              filter === s ? 'bg-ink text-white' : 'bg-white text-ink/50 hover:text-ink'
            }`}
          >
            {s ? statusLabels[s] : 'Semua'}
          </button>
        ))}
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
              <th className="text-left px-4 py-4 text-xs uppercase tracking-widest text-ink/40 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-cream/50 transition-colors">
                <td className="px-4 py-4">
                  <Link to={`/admin/orders/${o.id}`} className="text-coral hover:underline font-medium">{o.order_no}</Link>
                </td>
                <td className="px-4 py-4">{o.customer_name}</td>
                <td className="px-4 py-4 text-ink/60">{o.service_type}</td>
                <td className="px-4 py-4 font-medium">Rp {o.total_price.toLocaleString()}</td>
                <td className="px-4 py-4">
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    className="text-xs uppercase tracking-wider bg-ink/5 px-2 py-1.5 border-0 rounded-none focus:ring-1 focus:ring-coral cursor-pointer hover:bg-ink/10 transition-colors"
                  >
                    {statusFlow.map((s) => (
                      <option key={s} value={s}>{statusLabels[s]}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-4 text-ink/40 text-xs">{o.created_at}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => navigate(`/admin/orders/${o.id}`)} className="p-1.5 text-ink/40 hover:text-ink transition-colors" title="Edit">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(o.id, o.order_no)} className="p-1.5 text-ink/40 hover:text-coral transition-colors" title="Hapus">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="text-center text-ink/30 py-12 text-sm">Belum ada order</p>}
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 shadow-lg flex items-center gap-2 text-sm z-50 animate-fade-in">
          <CheckCircle className="w-4 h-4" /> {toast}
        </div>
      )}
    </div>
  );
}
