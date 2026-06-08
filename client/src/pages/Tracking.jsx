import { useState } from 'react';

const statusSteps = ['pending', 'diambil', 'dicuci', 'disetrika', 'selesai', 'diantar'];

const statusLabels = {
  pending: 'Menunggu', diambil: 'Diambil', dicuci: 'Dicuci',
  disetrika: 'Disetrika', selesai: 'Selesai', diantar: 'Diantar',
};

export default function Tracking() {
  const [orderNo, setOrderNo] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderNo.trim()) return;
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/track?no=${encodeURIComponent(orderNo.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Order tidak ditemukan');
      } else {
        setOrder(data);
      }
    } catch {
      setError('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  const currentStep = order ? statusSteps.indexOf(order.status) : -1;

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-2">Tracking Cucian</h1>
      <p className="text-gray-500 text-center mb-8">Masukkan nomor order untuk cek status</p>

      <form onSubmit={handleTrack} className="flex gap-2 mb-8">
        <input
          value={orderNo}
          onChange={(e) => setOrderNo(e.target.value)}
          placeholder="Masukkan nomor order"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium">
          {loading ? '...' : 'Cari'}
        </button>
      </form>

      {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

      {order && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500">Nomor Order</p>
            <p className="text-xl font-bold text-blue-600">{order.order_no}</p>
          </div>

          <div className="space-y-2 mb-6 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Nama:</span><span className="font-medium">{order.customer_name}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Layanan:</span><span className="font-medium">{order.service_type}</span></div>
            {order.weight > 0 && <div className="flex justify-between"><span className="text-gray-500">Berat:</span><span className="font-medium">{order.weight} kg</span></div>}
            <div className="flex justify-between"><span className="text-gray-500">Total:</span><span className="font-medium">Rp {order.total_price.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Status:</span><span className="font-medium text-blue-600">{statusLabels[order.status]}</span></div>
          </div>

          <div className="flex items-center justify-between">
            {statusSteps.map((s, i) => (
              <div key={s} className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${i <= currentStep ? 'bg-blue-600' : 'bg-gray-200'}`}>
                  {i <= currentStep ? '✓' : i + 1}
                </div>
                <span className={`text-[10px] mt-1 ${i <= currentStep ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>{statusLabels[s]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
