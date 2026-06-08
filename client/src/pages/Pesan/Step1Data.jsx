import { useState, useRef, useCallback } from 'react';
import { MapPin, Crosshair, Navigation } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const PHONE_REGEX = /^(08|\+62)\d{8,11}$/;

export default function Step1Data({ form, onChange }) {
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState('');
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapInstance = useRef(null);

  const phoneError = form.phone && !PHONE_REGEX.test(form.phone) ? 'Format: 08xxxxxxxxx atau +62xxxxxxxxx (10-13 digit)' : '';

  const initMap = useCallback((lat, lng) => {
    if (mapInstance.current) return;
    const map = L.map(mapRef.current, { zoomControl: false }).setView([lat, lng], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);
    L.control.zoom({ position: 'topright' }).addTo(map);

    const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      onChange({ latitude: pos.lat, longitude: pos.lng });
    });

    mapInstance.current = map;
    markerRef.current = marker;
    setTimeout(() => map.invalidateSize(), 200);
    setMapReady(true);
  }, [onChange]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocError('Geolocation tidak didukung browser ini');
      return;
    }
    setLocLoading(true);
    setLocError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        onChange({ latitude: lat, longitude: lng });
        setLocLoading(false);
        if (!mapInstance.current) {
          initMap(lat, lng);
        } else {
          mapInstance.current.setView([lat, lng], 16);
          markerRef.current.setLatLng([lat, lng]);
        }
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
          <input name="phone" value={form.phone} onChange={handleChange} type="tel" placeholder="Contoh: 08123456789" className={`w-full bg-white border-0 border-b-2 px-0 py-3 text-ink focus:ring-0 transition-colors text-sm ${phoneError ? 'border-coral' : 'focus:border-coral border-ink/10'}`} />
          {phoneError && <p className="text-coral text-xs mt-1">{phoneError}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-widest text-ink/60 mb-2">Alamat</label>
          <textarea name="address" value={form.address} onChange={handleChange} rows={2} placeholder="Masukkan alamat lengkap" className="w-full bg-white border-0 border-b-2 border-ink/10 px-0 py-3 text-ink focus:border-coral focus:ring-0 transition-colors text-sm" />
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-widest text-ink/60 mb-2">Lokasi Penjemputan</label>
          <button
            type="button"
            onClick={handleGetLocation}
            disabled={locLoading}
            className="flex items-center gap-2 text-sm border border-ink/10 px-4 py-3 hover:border-coral hover:text-coral transition-all disabled:opacity-40"
          >
            <Navigation className={`w-4 h-4 ${locLoading ? 'animate-spin' : ''}`} />
            {locLoading ? 'Mendapatkan lokasi...' : 'Gunakan Lokasi Saya'}
          </button>
          {locError && <p className="text-coral text-xs mt-2">{locError}</p>}

          {form.latitude && form.longitude && (
            <div className="mt-3 space-y-2">
              <p className="text-xs text-ink/40 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {form.latitude.toFixed(6)}, {form.longitude.toFixed(6)}
              </p>
              <div ref={mapRef} className="h-48 md:h-56 border border-ink/10" style={{ zIndex: 1 }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
