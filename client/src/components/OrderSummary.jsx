import { PRICES, calculateSubtotal, getPickupFee, getPickupDistance } from '../utils/prices';

export default function OrderSummary({ form }) {
  const subtotal = calculateSubtotal(form.service_type, form.weight);
  const pickupFee = getPickupFee(form.latitude, form.longitude);
  const distance = getPickupDistance(form.latitude, form.longitude);
  const total = subtotal + (form.pickup ? pickupFee : 0);

  const rows = [
    { label: 'Nama', value: form.customer_name },
    { label: 'No HP', value: form.phone },
    ...(form.address ? [{ label: 'Alamat', value: form.address }] : []),
    { label: 'Layanan', value: form.service_type },
    ...(form.service_type ? [{ label: 'Harga', value: (PRICES[form.service_type] || {}).label || '' }] : []),
    ...(form.weight && parseFloat(form.weight) > 0 ? [{ label: 'Berat', value: `${form.weight} kg` }] : []),
    ...(form.pickup_date ? [{ label: 'Jadwal Jemput', value: `${form.pickup_date} ${form.pickup_time || ''}` }] : []),
    ...(form.pickup ? [{ label: 'Biaya Antar Jemput', value: `Rp ${pickupFee.toLocaleString()}${distance > 0 ? ` (${distance.toFixed(1)} km)` : ''}` }] : []),
    ...(form.notes ? [{ label: 'Catatan', value: form.notes }] : []),
    {
      label: 'Pembayaran',
      value: form.payment_method === 'cod' ? 'COD' : form.payment_method === 'qris' ? 'QRIS' : form.payment_method === 'transfer' ? 'Transfer Bank' : form.payment_method === 'ewallet' ? 'E-Wallet' : 'COD',
    },
  ];

  return (
    <div className="bg-white border border-ink/10">
      <div className="divide-y divide-ink/5">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between py-3 px-5 text-sm">
            <span className="text-ink/50">{r.label}</span>
            <span className="font-medium text-ink text-right max-w-[60%]">{r.value}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center px-5 py-4 bg-ink/5">
        <span className="text-xs uppercase tracking-widest text-ink/50 font-medium">Total Estimasi</span>
        <span className="font-display text-2xl text-coral">Rp {total.toLocaleString()}</span>
      </div>
    </div>
  );
}
