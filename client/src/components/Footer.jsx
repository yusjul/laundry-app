import OperatingHours from './OperatingHours';

export default function Footer() {
  return (
    <footer className="bg-ink text-white/60 py-16 mt-auto">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <p className="font-display text-2xl text-white mb-2">
              <span className="text-coral">L</span>undry<span className="text-coral">K</span>u
            </p>
            <p className="text-sm leading-relaxed">Cucian bersih, harum, dan tepat waktu. Percayakan urusan laundry Anda kepada kami.</p>
          </div>
          <div>
            <p className="text-white font-medium uppercase text-xs tracking-widest mb-4">Kontak</p>
            <p>
              <a href="tel:+6281234567890" className="text-sm hover:text-coral transition-colors">0812-3456-7890</a>
            </p>
            <p className="mt-1">
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-coral transition-colors">WhatsApp</a>
            </p>
            <p className="mt-1">
              <a href="mailto:hello@laundryku.id" className="text-sm hover:text-coral transition-colors">hello@laundryku.id</a>
            </p>
          </div>
          <div>
            <p className="text-white font-medium uppercase text-xs tracking-widest mb-4">Jam Operasional</p>
            <OperatingHours />
            <p className="text-sm mt-2">Senin - Sabtu: 08.00 - 20.00</p>
            <p className="text-sm">Minggu: 09.00 - 17.00</p>
          </div>
        </div>
        <div className="border-t border-white/10 mt-10 pt-8 text-center text-xs">
          &copy; {new Date().getFullYear()} LaundryKu. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
