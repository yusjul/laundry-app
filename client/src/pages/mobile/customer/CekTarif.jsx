import React, { useState, useEffect } from 'react';
import { Droplets, Shirt, Sparkles, Bed, ArrowRight } from 'lucide-react';

export default function CekTarif({ onSelectService }) {
  const [pricesList, setPricesList] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders/prices')
      .then(res => res.json())
      .then(data => {
        if (data.prices) setPricesList(data.prices);
        setLoading(false);
      })
      .catch(err => {
        console.error('Gagal mengambil tarif:', err);
        setLoading(false);
      });
  }, []);

  const getServiceIcon = (key) => {
    if (key.includes('Kering')) return <Droplets className="w-5 h-5 text-coral" />;
    if (key.includes('Setrika')) return <Shirt className="w-5 h-5 text-coral" />;
    if (key.includes('Clean')) return <Sparkles className="w-5 h-5 text-coral" />;
    return <Bed className="w-5 h-5 text-coral" />;
  };

  return (
    <div className="p-4 space-y-6 font-body bg-cream text-ink">
      <div className="space-y-1">
        <h2 className="text-xl font-display font-bold text-ink">Tarif Layanan Laundry</h2>
        <p className="text-xs text-ink/60 font-medium">Klik langsung pada salah satu layanan untuk membuat pesanan baru.</p>
      </div>

      {loading ? (
        <p className="text-center py-10 text-xs text-ink/40 font-medium animate-pulse font-mono">Mengambil daftar tarif...</p>
      ) : (
        <div className="space-y-3">
          {Object.entries(pricesList).map(([key, value]) => {
            return (
              <div
                key={key}
                onClick={() => onSelectService(key)}
                className="p-4 bg-white hover:bg-zinc-50 border border-ink/10 hover:border-coral/40 rounded-2xl flex items-center justify-between transition-all duration-200 cursor-pointer active:scale-[0.99] shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center shadow-inner border border-coral/20">
                    {getServiceIcon(key)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-ink">{key}</h3>
                    <p className="text-[10px] text-ink/40">
                      Estimasi: {key.includes('Kering') ? '1-2 Hari' : key.includes('Setrika') ? '2 Hari' : key.includes('Clean') ? '3 Hari' : '2-3 Hari'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-sm font-bold text-coral">Rp {value.price.toLocaleString('id-ID')}</p>
                    <p className="text-[9px] text-ink/40 font-mono">per {value.unit}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-coral ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info Box */}
      <div className="p-4 rounded-xl bg-coral/5 border border-coral/10 text-center">
        <p className="text-[10px] text-ink/60 leading-relaxed font-body">
          * Catatan: Harga di atas belum termasuk biaya antar-jemput yang disesuaikan berdasarkan jarak lokasi penjemputan dari workshop.
        </p>
      </div>
    </div>
  );
}
