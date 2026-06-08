import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

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
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const no = searchParams.get('no');
    if (no) {
      setOrderNo(no);
      trackOrder(no);
    }
  }, []);

  const trackOrder = async (no) => {
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const res = await fetch(`/api/orders/track?no=${encodeURIComponent(no.trim())}`);
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

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderNo.trim()) return;
    trackOrder(orderNo.trim());
  };

  const currentStep = order ? statusSteps.indexOf(order.status) : -1;

  return (
    <div className="max-w-xl mx-auto px-4 md:px-6 py-8 md:py-20">
      <div className="mb-6 md:mb-12">
        <p className="text-coral font-medium text-xs md:text-sm tracking-[0.3em] uppercase mb-2 md:mb-3">Tracking</p>
        <h1 className="font-display text-2xl md:text-5xl text-ink leading-tight">Status Cucian</h1>
        <p className="text-ink/50 text-sm md:text-base mt-2 md:mt-3">Masukkan nomor order yang diberikan saat pemesanan.</p>
      </div>

      <form onSubmit={handleTrack} className="flex gap-3 mb-12">
        <input
          value={orderNo}
          onChange={(e) => setOrderNo(e.target.value)}
          placeholder="Contoh: LND080625123"
          className="flex-1 bg-white border-0 border-b-2 border-ink/10 px-0 py-3 text-ink focus:border-coral focus:ring-0 transition-colors text-sm"
        />
        <button type="submit" disabled={loading} className="bg-ink text-white px-8 py-3 hover:bg-ink/90 transition-all uppercase text-sm tracking-widest disabled:opacity-50 shrink-0">
          {loading ? '...' : 'Cari'}
        </button>
      </form>

      {error && <p className="text-coral text-sm text-center mb-6">{error}</p>}

      {order && (
        <div className="bg-white p-4 md:p-8 animate-fade-in">
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-widest text-ink/40 mb-2">Nomor Order</p>
            <p className="font-display text-3xl text-coral">{order.order_no}</p>
          </div>

          <div className="space-y-3 mb-10 text-sm border-b border-ink/10 pb-6">
            {[
              ['Nama', order.customer_name],
              ['Layanan', order.service_type],
              ...(order.weight > 0 ? [['Berat', `${order.weight} kg`]] : []),
              ['Total', `Rp ${order.total_price.toLocaleString()}`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <span className="text-ink/50">{label}</span>
                <span className="font-medium text-ink">{value}</span>
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="absolute top-3 left-3 bottom-3 w-0.5 bg-ink/10" />
            {statusSteps.map((s, i) => (
              <div key={s} className="flex items-center gap-4 mb-4 relative">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold z-10 transition-all duration-500 ${
                  i <= currentStep ? 'bg-coral text-white' : 'bg-ink/10 text-ink/30'
                }`}>
                  {i <= currentStep ? '✓' : i + 1}
                </div>
                <span className={`text-sm transition-colors ${
                  i <= currentStep ? 'text-ink font-medium' : 'text-ink/30'
                }`}>
                  {statusLabels[s]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
