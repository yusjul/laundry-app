import OrderSummary from '../../components/OrderSummary';

export default function Step3Konfirmasi({ form, onChange, onSubmit, loading, error }) {
  return (
    <div>
      <div className="bg-white p-6 md:p-8 border border-ink/10 mb-6">
        <h2 className="font-display text-xl mb-1">Konfirmasi Pesanan</h2>
        <p className="text-sm text-ink/50 mb-6">Periksa kembali pesanan Anda sebelum submit.</p>

        <OrderSummary form={form} />

        <div className="mt-6">
          <label className="block text-xs font-medium uppercase tracking-widest text-ink/60 mb-3">Metode Pembayaran</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: 'cod', label: 'COD', desc: 'Bayar di tempat' },
              { value: 'qris', label: 'QRIS', desc: 'Scan QR' },
              { value: 'transfer', label: 'Transfer', desc: 'BCA / Mandiri' },
              { value: 'ewallet', label: 'E-Wallet', desc: 'GoPay / OVO / Dana' },
            ].map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => onChange({ payment_method: m.value })}
                className={`text-left p-3 border text-sm transition-all ${
                  form.payment_method === m.value
                    ? 'border-coral bg-coral/5'
                    : 'border-ink/10 hover:border-ink/30'
                }`}
              >
                <p className="font-medium text-xs">{m.label}</p>
                <p className="text-[10px] text-ink/40 mt-0.5">{m.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && <p className="text-coral text-sm mb-4">{error}</p>}
    </div>
  );
}
