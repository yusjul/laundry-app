import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, Search, Check } from 'lucide-react';

const steps = [
  { key: 'pending', label: 'Menunggu Penjemputan', desc: 'Pesanan masuk, kurir akan menjemput pakaian Anda.' },
  { key: 'diambil', label: 'Pakaian Telah Diambil', desc: 'Pakaian sedang dibawa kurir menuju workshop.' },
  { key: 'dicuci', label: 'Sedang Dicuci', desc: 'Pakaian Anda sedang dicuci dengan standar higienis.' },
  { key: 'disetrika', label: 'Sedang Disetrika', desc: 'Pakaian disetrika rapi dan diberi parfum wangi.' },
  { key: 'selesai', label: 'Selesai Diproses', desc: 'Pakaian sudah bersih, rapi, dan siap diantarkan.' },
  { key: 'diantar', label: 'Sedang Diantar / Diterima', desc: 'Kurir sedang mengantar pakaian ke alamat Anda.' },
];

export default function TrackingStatus() {
  const [orderNo, setOrderNo] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!orderNo.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/track?no=${encodeURIComponent(orderNo.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Pesanan tidak ditemukan');
      } else {
        setOrder(data);
      }
    } catch (err) {
      setError('Koneksi database terganggu');
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status) => {
    return steps.findIndex((s) => s.key === status);
  };

  const currentStepIdx = order ? getStepIndex(order.status) : -1;

  return (
    <div className="p-4 space-y-6 font-body bg-cream text-ink">
      <div className="space-y-1">
        <h2 className="text-xl font-display font-bold text-ink">Lacak Status Cucian</h2>
        <p className="text-xs text-ink/60 font-medium">Masukkan nomor order untuk memantau status pengerjaan secara real-time.</p>
      </div>

      {/* Form Pencarian */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" />
          <input
            type="text"
            value={orderNo}
            onChange={(e) => setOrderNo(e.target.value)}
            placeholder="Contoh: LND202606080001"
            className="w-full bg-white border border-ink/10 rounded-xl py-3 pl-10 pr-4 text-xs font-mono uppercase focus:outline-none focus:border-coral text-ink placeholder-ink/20"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-5 bg-coral hover:bg-coral/90 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
        >
          {loading ? '...' : 'Cari'}
        </button>
      </form>

      {error && (
        <div className="text-xs text-coral bg-coral/5 border border-coral/10 p-4 rounded-xl text-center flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 text-coral" />
          <span>{error}</span>
        </div>
      )}

      {/* Detail & Progress Stepper */}
      {order && (
        <div className="space-y-5 animate-fadeIn">
          {/* Card Ringkasan Order */}
          <div className="p-4 bg-white border border-ink/10 rounded-2xl space-y-2.5 text-xs shadow-sm">
            <div className="flex justify-between border-b border-ink/5 pb-2 font-semibold">
              <span className="text-ink/50">Nomor Order:</span>
              <span className="font-extrabold text-coral font-mono">{order.order_no}</span>
            </div>
            <div className="grid grid-cols-2 gap-y-2 pt-1 font-medium">
              <span className="text-ink/50">Pelanggan:</span>
              <span className="text-ink text-right">{order.customer_name}</span>

              <span className="text-ink/50">Layanan:</span>
              <span className="text-ink text-right">{order.service_type}</span>

              {order.weight > 0 && (
                <>
                  <span className="text-ink/50">Berat Timbang:</span>
                  <span className="text-ink text-right">{order.weight} kg</span>
                </>
              )}

              <span className="text-ink/50">Total Biaya:</span>
              <span className="text-ink text-right font-bold">Rp {order.total_price.toLocaleString('id-ID')}</span>

              <span className="text-ink/50">Kurir Antar/Jemput:</span>
              <span className="text-ink text-right">{order.kurir_jemput_name || order.kurir_antar_name || 'Menunggu penunjukan'}</span>
            </div>
          </div>

          {/* Stepper Vertikal */}
          <div className="p-5 bg-white border border-ink/10 rounded-2xl space-y-4 shadow-sm">
            <h3 className="text-xs font-bold font-display uppercase text-coral tracking-wider mb-2">Progress Pengerjaan</h3>
            <div className="space-y-6 relative">
              {/* Line Connector */}
              <div className="absolute left-3.5 top-2.5 bottom-2.5 w-0.5 bg-ink/5 -z-10"></div>
              {/* Colored Line Connector */}
              {currentStepIdx > 0 && (
                <div
                  className="absolute left-3.5 top-2.5 w-0.5 bg-coral -z-10 transition-all duration-300"
                  style={{ height: `${(currentStepIdx / (steps.length - 1)) * 90}%` }}
                ></div>
              )}

              {steps.map((step, idx) => {
                const isCompleted = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div key={step.key} className="flex gap-4 items-start">
                    {/* Circle Indicator */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border text-[10px] font-bold transition-all ${
                        isCompleted
                          ? 'bg-coral border-coral text-white'
                          : 'bg-cream border-ink/10 text-ink/30'
                      } ${isCurrent ? 'ring-4 ring-coral/15 shadow-sm' : ''}`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </div>

                    {/* Step Description */}
                    <div className="space-y-1">
                      <h4
                        className={`text-xs font-bold transition-colors ${
                          isCompleted ? (isCurrent ? 'text-coral' : 'text-ink') : 'text-ink/40'
                        }`}
                      >
                        {step.label}
                      </h4>
                      <p className="text-[10px] text-ink/50 leading-relaxed font-body">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
