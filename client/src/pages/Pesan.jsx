import { useState } from 'react';

const services = ['Cuci Kering', 'Cuci Setrika', 'Dry Clean', 'Bed Cover'];

export default function Pesan() {
  const [form, setForm] = useState({
    customer_name: '', phone: '', address: '', service_type: '', weight: '', pickup: false, notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          weight: form.service_type === 'Cuci Kering' || form.service_type === 'Cuci Setrika' ? parseFloat(form.weight) || 0 : 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Gagal memesan');
      } else {
        setResult(data);
        setForm({ customer_name: '', phone: '', address: '', service_type: '', weight: '', pickup: false, notes: '' });
      }
    } catch {
      setError('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="max-w-lg mx-auto px-6 py-20">
        <div className="bg-white p-10">
          <div className="text-5xl mb-6">✓</div>
          <h1 className="font-display text-3xl mb-2">Pesanan Berhasil!</h1>
          <p className="text-ink/50 mb-6">Simpan nomor order ini untuk tracking:</p>
          <p className="font-display text-4xl text-coral mb-2">{result.order_no}</p>
          <p className="text-ink/40 text-sm mb-8">Total: Rp {result.total_price.toLocaleString()}</p>
          <button onClick={() => setResult(null)} className="bg-ink text-white px-8 py-4 hover:bg-ink/90 transition-all uppercase text-sm tracking-widest">Pesan Lagi</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-20">
      <div className="mb-12">
        <p className="text-coral font-medium text-sm tracking-[0.3em] uppercase mb-3">Order</p>
        <h1 className="font-display text-4xl md:text-5xl text-ink leading-tight">Pesan Cucian</h1>
        <p className="text-ink/50 mt-3">Isi form di bawah, tim kami akan segera menghubungi Anda.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-medium uppercase tracking-widest text-ink/60 mb-2">Nama Lengkap *</label>
          <input name="customer_name" value={form.customer_name} onChange={handleChange} required className="w-full bg-white border-0 border-b-2 border-ink/10 px-0 py-3 text-ink focus:border-coral focus:ring-0 transition-colors text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-widest text-ink/60 mb-2">No HP *</label>
          <input name="phone" value={form.phone} onChange={handleChange} required className="w-full bg-white border-0 border-b-2 border-ink/10 px-0 py-3 text-ink focus:border-coral focus:ring-0 transition-colors text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-widest text-ink/60 mb-2">Alamat</label>
          <textarea name="address" value={form.address} onChange={handleChange} rows={2} className="w-full bg-white border-0 border-b-2 border-ink/10 px-0 py-3 text-ink focus:border-coral focus:ring-0 transition-colors text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-widest text-ink/60 mb-2">Jenis Layanan *</label>
          <select name="service_type" value={form.service_type} onChange={handleChange} required className="w-full bg-white border-0 border-b-2 border-ink/10 px-0 py-3 text-ink focus:border-coral focus:ring-0 transition-colors text-sm">
            <option value="">Pilih layanan</option>
            {services.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {(form.service_type === 'Cuci Kering' || form.service_type === 'Cuci Setrika') && (
          <div className="animate-fade-in">
            <label className="block text-xs font-medium uppercase tracking-widest text-ink/60 mb-2">Berat (kg)</label>
            <input type="number" name="weight" value={form.weight} onChange={handleChange} step="0.5" min="0" className="w-full bg-white border-0 border-b-2 border-ink/10 px-0 py-3 text-ink focus:border-coral focus:ring-0 transition-colors text-sm" />
          </div>
        )}
        <label className="flex items-center gap-3 cursor-pointer group pt-2">
          <input type="checkbox" name="pickup" checked={form.pickup} onChange={handleChange} className="w-4 h-4 text-coral border-ink/20 rounded focus:ring-coral" />
          <span className="text-sm text-ink/70 group-hover:text-ink transition-colors">Antar Jemput (+Rp 5.000)</span>
        </label>
        <div>
          <label className="block text-xs font-medium uppercase tracking-widest text-ink/60 mb-2">Catatan</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} className="w-full bg-white border-0 border-b-2 border-ink/10 px-0 py-3 text-ink focus:border-coral focus:ring-0 transition-colors text-sm" />
        </div>
        {error && <p className="text-coral text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="w-full bg-ink text-white font-medium py-4 hover:bg-ink/90 transition-all uppercase text-sm tracking-widest disabled:opacity-50 mt-8">
          {loading ? 'Memproses...' : 'Pesan Sekarang'}
        </button>
      </form>
    </div>
  );
}
