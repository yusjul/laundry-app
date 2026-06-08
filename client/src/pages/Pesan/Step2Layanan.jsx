import { Package, Weight, Calendar, Truck, FileText } from 'lucide-react';
import { PRICES, SERVICE_TYPES, calculateSubtotal, calculateTotal, getPickupFee, getPickupDistance } from '../../utils/prices';

export default function Step2Layanan({ form, onChange }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onChange({ [name]: type === 'checkbox' ? checked : value });
  };

  const subtotal = calculateSubtotal(form.service_type, form.weight);
  const pickupFee = getPickupFee(form.latitude, form.longitude);
  const total = calculateTotal(form.service_type, form.weight, form.pickup, form.latitude, form.longitude);
  const distance = getPickupDistance(form.latitude, form.longitude);

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white p-6 md:p-8 border border-ink/10">
      <h2 className="font-display text-xl mb-6">Pilih Layanan</h2>

      <div className="space-y-5">
        <div>
          <label className="block text-xs font-medium uppercase tracking-widest text-ink/60 mb-2 flex items-center gap-2">
            <Package className="w-3.5 h-3.5" /> Jenis Layanan *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {SERVICE_TYPES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onChange({ service_type: s })}
                className={`text-left p-4 border text-sm transition-all ${
                  form.service_type === s
                    ? 'border-coral bg-coral/5 text-ink'
                    : 'border-ink/10 text-ink/60 hover:border-ink/30'
                }`}
              >
                <p className="font-medium text-sm">{s}</p>
                <p className="text-xs text-ink/40 mt-1">{PRICES[s].label}</p>
              </button>
            ))}
          </div>
        </div>

        {(PRICES[form.service_type] || {}).unit === 'kg' && (
          <div className="animate-fade-in">
            <label className="block text-xs font-medium uppercase tracking-widest text-ink/60 mb-2 flex items-center gap-2">
              <Weight className="w-3.5 h-3.5" /> Berat (kg) *
            </label>
            <input type="number" name="weight" value={form.weight} onChange={handleChange} step="0.5" min="0" placeholder="Contoh: 3" className="w-full bg-white border-0 border-b-2 border-ink/10 px-0 py-3 text-ink focus:border-coral focus:ring-0 transition-colors text-sm" />
            {form.weight && parseFloat(form.weight) > 0 && form.service_type && (
              <p className="text-sm text-ink/50 mt-2">
                Rp {calculateSubtotal(form.service_type, 1).toLocaleString()} &times; {form.weight} kg = <span className="font-medium text-coral">Rp {subtotal.toLocaleString()}</span>
              </p>
            )}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium uppercase tracking-widest text-ink/60 mb-2 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" /> Jadwal Penjemputan
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input type="date" name="pickup_date" value={form.pickup_date} onChange={handleChange} min={today} className="bg-white border-0 border-b-2 border-ink/10 px-0 py-3 text-ink focus:border-coral focus:ring-0 transition-colors text-sm" />
            <input type="time" name="pickup_time" value={form.pickup_time} onChange={handleChange} className="bg-white border-0 border-b-2 border-ink/10 px-0 py-3 text-ink focus:border-coral focus:ring-0 transition-colors text-sm" />
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer group pt-2">
          <input type="checkbox" name="pickup" checked={form.pickup} onChange={(e) => onChange({ pickup: e.target.checked })} className="w-4 h-4 text-coral border-ink/20 rounded focus:ring-coral" />
          <span className="text-sm text-ink/70 group-hover:text-ink transition-colors flex items-center gap-2">
            <Truck className="w-3.5 h-3.5" /> Antar Jemput
            {form.latitude && form.longitude
              ? ` (+Rp ${pickupFee.toLocaleString()} — ${distance.toFixed(1)} km)`
              : ' (+Rp 5.000)'}
          </span>
        </label>

        <div>
          <label className="block text-xs font-medium uppercase tracking-widest text-ink/60 mb-2 flex items-center gap-2">
            <FileText className="w-3.5 h-3.5" /> Catatan Khusus
          </label>
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} placeholder="Contoh: Jangan gunakan pewangi, prioritas noda tertentu" className="w-full bg-white border-0 border-b-2 border-ink/10 px-0 py-3 text-ink focus:border-coral focus:ring-0 transition-colors text-sm" />
        </div>
      </div>

      {form.service_type && (
        <div className="mt-6 p-4 bg-cream border border-ink/10 animate-fade-in">
          <p className="text-xs uppercase tracking-widest text-ink/40 mb-2">Estimasi Total</p>
          <p className="font-display text-3xl text-coral">Rp {total.toLocaleString()}</p>
          {form.pickup && subtotal > 0 && (
            <p className="text-xs text-ink/40 mt-1">
              Termasuk biaya antar jemput Rp {pickupFee.toLocaleString()}{distance > 0 ? ` (${distance.toFixed(1)} km dari lokasi kami)` : ''}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
