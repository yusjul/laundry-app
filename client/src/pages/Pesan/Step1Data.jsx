import { useState } from 'react';
import { MapPin, Crosshair } from 'lucide-react';

export default function Step1Data({ form, onChange }) {
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState('');

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocError('Geolocation tidak didukung browser ini');
      return;
    }
    setLocLoading(true);
    setLocError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setLocLoading(false);
      },
      () => {
        setLocError('Gagal mendapatkan lokasi. Izinkan akses lokasi.');
        setLocLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  return (
    <div className="bg-white p-6 md:p-8 border border-ink/10">
      <h2 className="font-display text-xl mb-6">Data Pelanggan</h2>

      <div className="space-y-5">
        <div>
          <label className="block text-xs font-medium uppercase tracking-widest text-ink/60 mb-2">Nama Lengkap *</label>
          <input name="customer_name" value={form.customer_name} onChange={handleChange} placeholder="Masukkan nama Anda" className="w-full bg-white border-0 border-b-2 border-ink/10 px-0 py-3 text-ink focus:border-coral focus:ring-0 transition-colors text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-widest text-ink/60 mb-2">No HP *</label>
          <input name="phone" value={form.phone} onChange={handleChange} type="tel" placeholder="Contoh: 08123456789" className="w-full bg-white border-0 border-b-2 border-ink/10 px-0 py-3 text-ink focus:border-coral focus:ring-0 transition-colors text-sm" />
          {form.phone && !/^0\d{8,12}$/.test(form.phone) && (
            <p className="text-coral text-xs mt-1">Format nomor HP tidak valid (contoh: 08123456789)</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-widest text-ink/60 mb-2">Alamat</label>
          <textarea name="address" value={form.address} onChange={handleChange} rows={2} placeholder="Masukkan alamat lengkap" className="w-full bg-white border-0 border-b-2 border-ink/10 px-0 py-3 text-ink focus:border-coral focus:ring-0 transition-colors text-sm" />
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-widest text-ink/60 mb-2">Lokasi</label>
          <button
            type="button"
            onClick={handleGetLocation}
            disabled={locLoading}
            className="flex items-center gap-2 text-sm border border-ink/10 px-4 py-3 hover:border-coral hover:text-coral transition-all disabled:opacity-40"
          >
            <Crosshair className={`w-4 h-4 ${locLoading ? 'animate-spin' : ''}`} />
            {locLoading ? 'Mendapatkan lokasi...' : 'Gunakan Lokasi Saya'}
          </button>
          {form.latitude && form.longitude && (
            <p className="text-xs text-ink/40 mt-2 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {form.latitude.toFixed(6)}, {form.longitude.toFixed(6)}
            </p>
          )}
          {locError && <p className="text-coral text-xs mt-1">{locError}</p>}
        </div>
      </div>
    </div>
  );
}
