import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';

const categories = ['Sabun/Parfum', 'Gaji', 'Listrik', 'Air', 'Sewa', 'Lainnya'];
const emptyForm = { name: '', category: 'Lainnya', amount: '', date: new Date().toISOString().split('T')[0], notes: '' };

export default function Pengeluaran() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchItems = () => {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 10000);
    fetch('/api/expenses', { signal: controller.signal })
      .then((r) => { if (!r.ok) throw new Error('Gagal memuat data'); return r.json(); })
      .then(setItems)
      .catch((err) => setError(err.message));
  };

  useEffect(() => { fetchItems(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.amount || !form.date) return;

    const url = editingId ? `/api/expenses/${editingId}` : '/api/expenses';
    const method = editingId ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, amount: parseFloat(form.amount) }),
    });

    if (res.ok) {
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      fetchItems();
    }
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, category: item.category, amount: String(item.amount), date: item.date, notes: item.notes || '' });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin hapus pengeluaran ini?')) return;
    const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
    if (res.ok) fetchItems();
  };

  const total = items.reduce((s, i) => s + i.amount, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h1 className="font-display text-2xl md:text-3xl">Pengeluaran</h1>
        <button onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(true); }} className="flex items-center gap-2 bg-ink text-white px-4 py-2 text-xs uppercase tracking-widest hover:bg-ink/90 transition-all">
          <Plus className="w-3.5 h-3.5" /> Tambah
        </button>
      </div>

      <div className="bg-white p-6 mb-6">
        <p className="text-xs uppercase tracking-widest text-ink/40 mb-1">Total Pengeluaran</p>
        <p className="font-display text-3xl text-coral">Rp {total.toLocaleString()}</p>
      </div>

      {error && <p className="text-coral text-sm mb-4">{error}. <button onClick={fetchItems} className="underline">Muat ulang</button></p>}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white w-full max-w-md p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg">{editingId ? 'Edit' : 'Tambah'} Pengeluaran</h2>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="text-ink/40 hover:text-ink"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-ink/60 mb-1">Nama *</label>
                <input name="name" value={form.name} onChange={handleChange} required className="w-full border-0 border-b-2 border-ink/10 px-0 py-2 text-sm focus:border-coral focus:ring-0" placeholder="Nama pengeluaran" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-ink/60 mb-1">Kategori</label>
                <select name="category" value={form.category} onChange={handleChange} className="w-full border-0 border-b-2 border-ink/10 px-0 py-2 text-sm focus:border-coral focus:ring-0">
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-ink/60 mb-1">Nominal *</label>
                <input type="number" name="amount" value={form.amount} onChange={handleChange} required min="0" className="w-full border-0 border-b-2 border-ink/10 px-0 py-2 text-sm focus:border-coral focus:ring-0" placeholder="Rp" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-ink/60 mb-1">Tanggal *</label>
                <input type="date" name="date" value={form.date} onChange={handleChange} required className="w-full border-0 border-b-2 border-ink/10 px-0 py-2 text-sm focus:border-coral focus:ring-0" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-ink/60 mb-1">Catatan</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} className="w-full border-0 border-b-2 border-ink/10 px-0 py-2 text-sm focus:border-coral focus:ring-0" />
              </div>
              <button type="submit" className="w-full bg-ink text-white py-3 text-sm uppercase tracking-widest hover:bg-ink/90 transition-all">
                {editingId ? 'Simpan' : 'Tambah'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10">
              <th className="text-left px-4 py-4 text-xs uppercase tracking-widest text-ink/40 font-medium">Nama</th>
              <th className="text-left px-4 py-4 text-xs uppercase tracking-widest text-ink/40 font-medium">Kategori</th>
              <th className="text-right px-4 py-4 text-xs uppercase tracking-widest text-ink/40 font-medium">Nominal</th>
              <th className="text-left px-4 py-4 text-xs uppercase tracking-widest text-ink/40 font-medium">Tanggal</th>
              <th className="text-left px-4 py-4 text-xs uppercase tracking-widest text-ink/40 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-cream/50 transition-colors">
                <td className="px-4 py-4 font-medium">{item.name}</td>
                <td className="px-4 py-4 text-ink/60">{item.category}</td>
                <td className="px-4 py-4 text-right font-medium">Rp {item.amount.toLocaleString()}</td>
                <td className="px-4 py-4 text-ink/40 text-xs">{item.date}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(item)} className="p-1.5 text-ink/40 hover:text-ink transition-colors"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-ink/40 hover:text-coral transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <p className="text-center text-ink/30 py-12 text-sm">Belum ada pengeluaran</p>}
      </div>
    </div>
  );
}
