import { CheckCircle, ExternalLink, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Step4Selesai({ result, onReset }) {
  const waMessage = encodeURIComponent(
    `Halo LaundryKu, saya ingin melacak pesanan saya:\n\n` +
    `*Nomor Order:* ${result.order_no}\n` +
    `*Nama:* ${result.customer_name}\n` +
    `*Layanan:* ${result.service_type}\n` +
    `${result.weight > 0 ? `*Berat:* ${result.weight} kg\n` : ''}` +
    `*Total:* Rp ${result.total_price.toLocaleString()}\n` +
    `*Status:* ${result.status}\n\n` +
    `Terima kasih.`
  );

  return (
    <div className="max-w-lg mx-auto px-4 md:px-6 py-8 md:py-20">
      <div className="bg-white p-6 md:p-10 border border-ink/10 text-center animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>

        <h1 className="font-display text-2xl md:text-3xl mb-2">Pesanan Berhasil!</h1>
        <p className="text-ink/50 text-sm mb-6">Simpan nomor order ini untuk melacak status cucian Anda.</p>

        <div className="bg-cream p-6 mb-6">
          <p className="text-xs uppercase tracking-widest text-ink/40 mb-2">Nomor Order</p>
          <p className="font-display text-2xl md:text-3xl text-coral tracking-wider">{result.order_no}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link
            to={`/tracking?no=${result.order_no}`}
            className="inline-flex items-center justify-center gap-2 border border-ink/10 text-ink px-6 py-3 text-sm hover:border-coral hover:text-coral transition-all"
          >
            <ExternalLink className="w-4 h-4" /> Lacak Pesanan
          </Link>
          <a
            href={`https://wa.me/6289504968511?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 text-sm hover:bg-green-700 transition-all"
          >
            <MessageCircle className="w-4 h-4" /> Chat WhatsApp
          </a>
        </div>

        <button onClick={onReset} className="text-xs uppercase tracking-widest text-ink/50 hover:text-ink transition-colors">
          Pesan Lagi
        </button>
      </div>
    </div>
  );
}
