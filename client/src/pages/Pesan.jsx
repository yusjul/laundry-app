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
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold mb-2">Pesanan Berhasil!</h1>
          <p className="text-gray-500 mb-4">Simpan nomor order Anda untuk tracking</p>
          <p className="text-3xl font-bold text-blue-600 mb-2">{result.order_no}</p>
          <p className="text-gray-400 text-sm mb-6">Total: Rp {result.total_price.toLocaleString()}</p>
          <button onClick={() => setResult(null)} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">Pesan Lagi</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-2">Pesan Cucian</h1>
      <p className="text-gray-500 text-center mb-8">Isi form di bawah, kami jemput cucian Anda</p>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nama Lengkap *</label>
          <input name="customer_name" value={form.customer_name} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">No HP *</label>
          <input name="phone" value={form.phone} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Alamat</label>
          <textarea name="address" value={form.address} onChange={handleChange} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Jenis Layanan *</label>
          <select name="service_type" value={form.service_type} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Pilih layanan</option>
            {services.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {(form.service_type === 'Cuci Kering' || form.service_type === 'Cuci Setrika') && (
          <div>
            <label className="block text-sm font-medium mb-1">Berat (kg)</label>
            <input type="number" name="weight" value={form.weight} onChange={handleChange} step="0.5" min="0" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        )}
        <div className="flex items-center gap-2">
          <input type="checkbox" name="pickup" checked={form.pickup} onChange={handleChange} id="pickup" className="rounded" />
          <label htmlFor="pickup" className="text-sm">Antar Jemput (+Rp 5.000)</label>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Catatan</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
          {loading ? 'Memproses...' : 'Pesan Sekarang'}
        </button>
      </form>
    </div>
  );
}
