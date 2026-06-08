import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Pencil, Trash2, X, Check } from 'lucide-react';

const statusFlow = ['pending', 'diambil', 'dicuci', 'disetrika', 'selesai', 'diantar'];
const statusLabels = {
  pending: 'Menunggu', diambil: 'Diambil', dicuci: 'Dicuci',
  disetrika: 'Disetrika', selesai: 'Selesai', diantar: 'Diantar',
};
const services = ['Cuci Kering', 'Cuci Setrika', 'Dry Clean', 'Bed Cover'];

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  const fetchOrder = () => {
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((data) => { setOrder(data); setForm(data); setLoading(false); });
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

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async () => {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: form.customer_name,
        phone: form.phone,
        address: form.address,
        service_type: form.service_type,
        weight: form.service_type === 'Cuci Kering' || form.service_type === 'Cuci Setrika' ? parseFloat(form.weight) || 0 : 0,
        pickup: form.pickup ? 1 : 0,
        notes: form.notes,
      }),
    });
    if (res.ok) {
      setEditing(false);
      fetchOrder();
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Yakin hapus order ${order.order_no}?`)) return;
    const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
    if (res.ok) navigate('/admin/orders');
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
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-ink/50 bg-ink/5 px-4 py-2">{statusLabels[order.status]}</span>
            {!editing && (
              <>
                <button onClick={() => setEditing(true)} className="p-2 text-ink/40 hover:text-ink transition-colors" title="Edit">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={handleDelete} className="p-2 text-ink/40 hover:text-coral transition-colors" title="Hapus">
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
            {editing && (
              <>
                <button onClick={handleSave} className="p-2 text-green-600 hover:text-green-700 transition-colors" title="Simpan">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={() => { setEditing(false); setForm(order); }} className="p-2 text-ink/40 hover:text-ink transition-colors" title="Batal">
                  <X className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {!editing ? (
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
        ) : (
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-10 text-sm">
            <div>
              <label className="text-ink/40 text-xs uppercase tracking-wider mb-1 block">Nama *</label>
              <input name="customer_name" value={form.customer_name} onChange={handleEditChange} className="w-full border-0 border-b-2 border-ink/10 px-0 py-2 text-ink focus:border-coral focus:ring-0 text-sm" />
            </div>
            <div>
              <label className="text-ink/40 text-xs uppercase tracking-wider mb-1 block">No HP *</label>
              <input name="phone" value={form.phone} onChange={handleEditChange} className="w-full border-0 border-b-2 border-ink/10 px-0 py-2 text-ink focus:border-coral focus:ring-0 text-sm" />
            </div>
            <div className="col-span-2">
              <label className="text-ink/40 text-xs uppercase tracking-wider mb-1 block">Alamat</label>
              <textarea name="address" value={form.address} onChange={handleEditChange} rows={2} className="w-full border-0 border-b-2 border-ink/10 px-0 py-2 text-ink focus:border-coral focus:ring-0 text-sm" />
            </div>
            <div>
              <label className="text-ink/40 text-xs uppercase tracking-wider mb-1 block">Layanan *</label>
              <select name="service_type" value={form.service_type} onChange={handleEditChange} className="w-full border-0 border-b-2 border-ink/10 px-0 py-2 text-ink focus:border-coral focus:ring-0 text-sm">
                {services.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {(form.service_type === 'Cuci Kering' || form.service_type === 'Cuci Setrika') && (
              <div>
                <label className="text-ink/40 text-xs uppercase tracking-wider mb-1 block">Berat (kg)</label>
                <input type="number" name="weight" value={form.weight} onChange={handleEditChange} step="0.5" min="0" className="w-full border-0 border-b-2 border-ink/10 px-0 py-2 text-ink focus:border-coral focus:ring-0 text-sm" />
              </div>
            )}
            <div className="col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="pickup" checked={form.pickup} onChange={handleEditChange} className="rounded text-coral focus:ring-coral" />
                <span className="text-xs uppercase tracking-wider text-ink/50">Antar Jemput (+Rp 5.000)</span>
              </label>
            </div>
            <div className="col-span-2">
              <label className="text-ink/40 text-xs uppercase tracking-wider mb-1 block">Catatan</label>
              <textarea name="notes" value={form.notes} onChange={handleEditChange} rows={2} className="w-full border-0 border-b-2 border-ink/10 px-0 py-2 text-ink focus:border-coral focus:ring-0 text-sm" />
            </div>
          </div>
        )}

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
