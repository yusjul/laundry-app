import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Step1Data from './Step1Data';
import Step2Layanan from './Step2Layanan';
import Step3Konfirmasi from './Step3Konfirmasi';
import Step4Selesai from './Step4Selesai';
import { SERVICE_TYPES, PRICES } from '../../utils/prices';

const stepLabels = ['Data Pelanggan', 'Pilih Layanan', 'Konfirmasi', 'Selesai'];

const initialForm = {
  customer_name: '', phone: '', address: '',
  service_type: '', weight: '', pickup: false,
  notes: '', pickup_date: '', pickup_time: '',
  latitude: null, longitude: null,
  payment_method: 'cod',
};

export default function Pesan() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const updateForm = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const canNext = () => {
    if (step === 1) return form.customer_name.trim() && form.phone.trim() && /^0\d{8,12}$/.test(form.phone);
    if (step === 2) return !!form.service_type;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          weight: (PRICES[form.service_type] || {}).unit === 'kg' ? parseFloat(form.weight) || 0 : 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Gagal memesan');
      } else {
        setResult(data);
        setStep(4);
      }
    } catch {
      setError('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  if (step === 4 && result) {
    return <Step4Selesai result={result} onReset={() => { setForm(initialForm); setStep(1); setResult(null); }} />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-20">
      <div className="flex items-center gap-2 mb-10">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              i + 1 <= step ? 'bg-coral text-white' : 'bg-ink/10 text-ink/30'
            }`}>
              {i + 1 < step ? '✓' : i + 1}
            </div>
            <span className={`text-xs whitespace-nowrap hidden md:block ${i + 1 <= step ? 'text-ink font-medium' : 'text-ink/30'}`}>
              {label}
            </span>
            {i < stepLabels.length - 1 && <div className={`h-px flex-1 ${i + 1 < step ? 'bg-coral' : 'bg-ink/10'}`} />}
          </div>
        ))}
      </div>

      <div className="animate-fade-in">
        {step === 1 && <Step1Data form={form} onChange={updateForm} />}
        {step === 2 && <Step2Layanan form={form} onChange={updateForm} />}
        {step === 3 && <Step3Konfirmasi form={form} onChange={updateForm} onSubmit={handleSubmit} loading={loading} error={error} />}
      </div>

      {step < 4 && (
        <div className="flex justify-between mt-10">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="flex items-center gap-2 text-sm text-ink/50 hover:text-ink transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" /> Kembali
          </button>
          {step < 3 ? (
            <button
              onClick={() => { if (canNext()) setStep((s) => s + 1); }}
              disabled={!canNext()}
              className="flex items-center gap-2 bg-ink text-white px-6 py-3 text-sm uppercase tracking-widest hover:bg-ink/90 transition-all disabled:opacity-40"
            >
              Lanjut <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-coral text-white px-8 py-3 text-sm uppercase tracking-widest hover:bg-coral/90 transition-all disabled:opacity-40"
            >
              {loading ? 'Memproses...' : 'Pesan Sekarang'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
