import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { CheckCircle2, Droplets, Shirt, Sparkles, Bed, Smartphone, MapPin, AlertTriangle } from 'lucide-react';

// Fix for default Leaflet marker icon in Webpack/Vite
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function PesanCucian({ user }) {
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '+62');
  const [address, setAddress] = useState('');
  const [serviceType, setServiceType] = useState('Cuci Kering');
  const [weight, setWeight] = useState('1');
  const [pickup, setPickup] = useState(true);
  const [notes, setNotes] = useState('');

  // Maps coordinates
  const [position, setPosition] = useState([-6.2088, 106.8456]); // Default Jakarta
  const [pricesList, setPricesList] = useState({});
  const [pickupFee, setPickupFee] = useState(5000);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState('');

  // Fetch prices
  useEffect(() => {
    fetch(`/api/orders/prices?lat=${position[0]}&lng=${position[1]}`)
      .then(res => res.json())
      .then(data => {
        if (data.prices) setPricesList(data.prices);
        if (data.pickupFee !== undefined) setPickupFee(data.pickupFee);
      })
      .catch(err => console.error('Gagal mengambil daftar harga:', err));
  }, [position]);

  // Auto-detect location on mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {},
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  // Reverse geocoding on position change (map click / auto-detect)
  useEffect(() => {
    if (position[0] === -6.2088 && position[1] === 106.8456) return;
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position[0]}&lon=${position[1]}&accept-language=id`)
      .then(r => r.json())
      .then(data => { if (data.display_name) setAddress(data.display_name); })
      .catch(() => {});
  }, [position[0], position[1]]);

  // Handle pre-selected service from CekTarif
  useEffect(() => {
    const checkPreselected = () => {
      const preselected = sessionStorage.getItem('preselected_service');
      if (preselected) {
        setServiceType(preselected);
        sessionStorage.removeItem('preselected_service');
      }
    };
    checkPreselected();
    window.addEventListener('preselected_service_changed', checkPreselected);
    return () => window.removeEventListener('preselected_service_changed', checkPreselected);
  }, []);

  // Map Click Listener
  function MapEvents() {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
      },
    });
    return null;
  }

  // Format Phone Number to start with +62
  const handlePhoneChange = (e) => {
    let input = e.target.value;
    if (!input.startsWith('+62')) {
      let numbersOnly = input.replace(/[^0-9]/g, '');
      if (numbersOnly.startsWith('62')) {
        setPhone('+' + numbersOnly);
      } else if (numbersOnly.startsWith('0')) {
        setPhone('+62' + numbersOnly.slice(1));
      } else {
        setPhone('+62' + numbersOnly);
      }
    } else {
      setPhone(input);
    }
  };

  const calculateTotal = () => {
    const serviceInfo = pricesList[serviceType] || { price: 0, unit: 'kg' };
    const rate = serviceInfo.price;
    const qty = serviceInfo.unit === 'kg' ? parseFloat(weight) || 0 : 1;
    return (qty * rate) + (pickup ? pickupFee : 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      customer_name: customerName,
      phone,
      address,
      service_type: serviceType,
      weight: parseFloat(weight) || 0,
      pickup: pickup ? 1 : 0,
      notes,
      latitude: position[0],
      longitude: position[1],
      payment_method: 'cod'
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Gagal membuat pesanan');
      } else {
        setSuccessData(data);
        setAddress('');
        setNotes('');
      }
    } catch (err) {
      setError('Koneksi server terganggu');
    } finally {
      setLoading(false);
    }
  };

  const getServiceIcon = (key) => {
    if (key.includes('Kering')) return <Droplets className="w-5 h-5 text-coral shrink-0" />;
    if (key.includes('Setrika')) return <Shirt className="w-5 h-5 text-coral shrink-0" />;
    if (key.includes('Clean')) return <Sparkles className="w-5 h-5 text-coral shrink-0" />;
    return <Bed className="w-5 h-5 text-coral shrink-0" />;
  };

  if (successData) {
    return (
      <div className="p-5 flex flex-col justify-center items-center text-center space-y-6 bg-cream min-h-[80vh] text-ink font-body">
        <div className="w-16 h-16 rounded-full bg-coral/10 border border-coral/30 flex items-center justify-center text-coral animate-bounce">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-display font-bold text-ink">Pesanan Berhasil Dibuat!</h2>
          <p className="text-xs text-ink/60 font-medium">Order Anda sedang diproses oleh kurir kami</p>
        </div>
        <div className="w-full bg-white border border-ink/10 p-5 rounded-2xl space-y-3 font-medium text-left text-sm max-w-sm shadow-sm">
          <div className="flex justify-between border-b border-ink/5 pb-2.5">
            <span className="text-ink/50">Nomor Order:</span>
            <span className="font-extrabold text-coral font-mono tracking-wider">{successData.order_no}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/50">Layanan:</span>
            <span className="text-ink">{successData.service_type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/50">Total Pembayaran:</span>
            <span className="font-extrabold text-ink">Rp {successData.total_price.toLocaleString('id-ID')}</span>
          </div>
          <div className="text-[10px] text-ink/40 text-center pt-2 leading-relaxed">
            Salin nomor order untuk melacak status pesanan di menu Tracking.
          </div>
        </div>
        <button
          onClick={() => setSuccessData(null)}
          className="w-full max-w-sm py-3.5 bg-coral hover:bg-coral/90 text-white font-medium uppercase tracking-widest text-xs rounded-xl shadow-sm transition-all"
        >
          Pesan Cucian Baru
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 font-body bg-cream text-ink">
      <div className="space-y-1">
        <h2 className="text-xl font-display font-bold text-ink">Form Pemesanan Laundry</h2>
        <p className="text-xs text-ink/60 font-medium">Silakan isi formulir untuk menjemput pakaian kotor Anda.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nama Customer */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-ink/70">Nama Lengkap</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full bg-white border border-ink/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-coral text-ink placeholder-ink/20"
            placeholder="Joko Santoso"
            required
          />
        </div>

        {/* Nomor HP +62 */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-ink/70">Nomor WhatsApp Aktif</label>
          <div className="relative">
            <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" />
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              className="w-full bg-white border border-ink/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-coral text-ink font-mono placeholder-ink/20"
              placeholder="+628123456789"
              required
            />
          </div>
        </div>

        {/* Service Selection (Radio Cards) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-ink/70">Pilih Layanan Laundry</label>
          <div className="grid grid-cols-1 gap-2.5">
            {Object.entries(pricesList).map(([key, value]) => (
              <div
                key={key}
                onClick={() => setServiceType(key)}
                className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                  serviceType === key
                    ? 'bg-coral/5 border-coral shadow-sm'
                    : 'bg-white border-ink/10 hover:border-ink/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  {getServiceIcon(key)}
                  <div>
                    <h4 className="font-bold text-xs text-ink">{key}</h4>
                    <p className="text-[10px] text-ink/50">{value.unit === 'kg' ? 'Per kilogram' : 'Per item'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-coral">Rp {value.price.toLocaleString('id-ID')}/{value.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kondisional Berat jika tipe layanan per kg */}
        {(pricesList[serviceType]?.unit === 'kg') && (
          <div className="space-y-1 animate-fadeIn">
            <label className="text-xs font-bold text-ink/70">Perkiraan Berat (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              min="1"
              max="50"
              step="0.5"
              className="w-full bg-white border border-ink/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-coral text-ink placeholder-ink/20"
              required
            />
          </div>
        )}

        {/* Antar Jemput Checkbox */}
        <div className="flex items-center justify-between p-3.5 bg-white border border-ink/10 rounded-xl">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-ink">Layanan Antar Jemput</h4>
            <p className="text-[10px] text-ink/50">Biaya penjemputan: Rp {pickupFee.toLocaleString('id-ID')}</p>
          </div>
          <button
            type="button"
            onClick={() => setPickup(!pickup)}
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-250 shrink-0 ${pickup ? 'bg-coral' : 'bg-ink/10'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-250 ${pickup ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Alamat Lengkap */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-ink/70">Alamat Lengkap Penjemputan</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={2}
            className="w-full bg-white border border-ink/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-coral text-ink placeholder-ink/20"
            placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan"
            required
          />
        </div>

        {/* Leaflet Maps Location Picker */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-ink/70 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-coral" /> Peta Lokasi Penjemputan (Ketuk Peta untuk Pin)
          </label>
          <div className="h-48 w-full rounded-2xl border border-ink/10 overflow-hidden z-10 relative">
            <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position} />
              <MapEvents />
            </MapContainer>
          </div>
          <div className="flex justify-between text-[9px] text-ink/40 font-mono px-1">
            <span>Lat: {position[0].toFixed(5)}</span>
            <span>Lng: {position[1].toFixed(5)}</span>
          </div>
        </div>

        {/* Catatan Tambahan */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-ink/70">Catatan Khusus (Opsional)</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-white border border-ink/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-coral text-ink placeholder-ink/20"
            placeholder="Contoh: Pagar warna hitam, baju harap dipisah"
          />
        </div>

        {/* Rincian Pembayaran Ringkas */}
        <div className="p-4 bg-white border border-ink/10 rounded-2xl space-y-2 text-xs font-semibold">
          <div className="flex justify-between text-ink/50">
            <span>Biaya Laundry ({serviceType}):</span>
            <span className="text-ink">
              Rp {((pricesList[serviceType]?.price || 0) * (pricesList[serviceType]?.unit === 'kg' ? parseFloat(weight) || 0 : 1)).toLocaleString('id-ID')}
            </span>
          </div>
          {pickup && (
            <div className="flex justify-between text-ink/50">
              <span>Biaya Antar-Jemput:</span>
              <span className="text-ink">Rp {pickupFee.toLocaleString('id-ID')}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-ink/5 pt-2 text-sm text-coral font-bold font-display">
            <span>Perkiraan Total:</span>
            <span>Rp {calculateTotal().toLocaleString('id-ID')}</span>
          </div>
        </div>

        {error && (
          <p className="text-xs text-coral bg-coral/5 border border-coral/10 p-3 rounded-xl flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-coral shrink-0 mt-0.5" />
            <span>{error}</span>
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-coral hover:bg-coral/90 disabled:opacity-50 text-white font-medium uppercase tracking-widest text-xs rounded-xl transition-all duration-200 active:scale-95 shadow-sm shadow-coral/10"
        >
          {loading ? 'Mengirim Pesanan...' : 'Pesan Penjemputan Sekarang'}
        </button>
      </form>
    </div>
  );
}
