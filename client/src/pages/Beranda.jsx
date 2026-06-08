import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const services = [
  { title: 'Cuci Kering', desc: 'Dicuci bersih, kering sempurna — tanpa setrika.', price: 'Rp 7.000', unit: '/kg' },
  { title: 'Cuci Setrika', desc: 'Dicuci plus disetrika rapi, siap pakai.', price: 'Rp 10.000', unit: '/kg' },
  { title: 'Dry Clean', desc: 'Perawatan khusus untuk bahan sensitif.', price: 'Rp 15.000', unit: '/item' },
  { title: 'Bed Cover', desc: 'Bed cover dan selimut besar, ditangani spesial.', price: 'Rp 25.000', unit: '/item' },
];

const steps = [
  { num: '01', title: 'Pesan Online', desc: 'Isi form atau hubungi kami. Gampang, 2 menit.' },
  { num: '02', title: 'Kami Jemput', desc: 'Kurir kami ambil cucian di tempat Anda.' },
  { num: '03', title: 'Kami Proses', desc: 'Dicuci bersih, disetrika rapi, diperiksa.' },
  { num: '04', title: 'Diantar Kembali', desc: 'Cucian wangi siap pakai, on time.' },
];

export default function Beranda() {
  const [showFloating, setShowFloating] = useState(false);
  const [activeDot, setActiveDot] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setShowFloating(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const w = el.querySelector('a')?.offsetWidth || 1;
    const idx = Math.round(el.scrollLeft / w);
    setActiveDot(idx);
  };

  return (
    <>
      {/* Hero */}
      <section id="hero" className="relative bg-ink text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-6xl mx-auto px-4 py-14 md:py-36 relative">
          <div className="max-w-2xl">
            <p className="text-coral font-medium text-xs md:text-sm tracking-[0.3em] uppercase mb-4 md:mb-6 opacity-0 animate-fade-up">Premium Laundry Service</p>
            <h1 className="font-display text-3xl md:text-7xl leading-[1.1] mb-4 md:mb-6 opacity-0 animate-fade-up animate-delay-200">
              Cucian Bersih,<br />
              <span className="text-coral">Harum</span>,<br />
              Tepat Waktu
            </h1>
            <p className="text-white/60 text-sm md:text-lg leading-relaxed mb-6 md:mb-10 max-w-lg opacity-0 animate-fade-up animate-delay-300">
              LaundryKu siap membantu urusan cucian Anda. Antar jemput gratis, proses profesional, hasil maksimal.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 opacity-0 animate-fade-up animate-delay-400">
              <Link to="/pesan" className="inline-block bg-coral text-white font-medium px-5 md:px-8 py-3 md:py-4 hover:bg-coral/90 transition-all uppercase text-sm tracking-widest text-center">
                Pesan Sekarang
              </Link>
              <Link to="/harga" className="inline-block border border-white/20 text-white/80 px-5 md:px-8 py-3 md:py-4 hover:border-white/40 hover:text-white transition-all uppercase text-sm tracking-widest text-center">
                Lihat Harga
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Layanan — Mobile horizontal scroll, Desktop grid */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-24">
        <div className="flex items-end justify-between mb-8 md:mb-16">
          <div>
            <p className="text-coral font-medium text-xs md:text-sm tracking-[0.3em] uppercase mb-2 md:mb-3">Layanan</p>
            <h2 className="font-display text-2xl md:text-5xl text-ink leading-tight">Apa yang kami<br className="hidden md:block" />tawarkan?</h2>
          </div>
          <Link to="/harga" className="hidden md:block text-sm text-ink/50 hover:text-ink transition-colors uppercase tracking-widest">
            Lihat Semua &rarr;
          </Link>
        </div>

        {/* Mobile: horizontal snap scroll */}
        <div className="md:hidden">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth -mx-4 px-4 gap-4 pb-2 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {services.map((s, i) => (
              <Link
                key={s.title}
                to="/pesan"
                className="snap-start shrink-0 w-[75vw] bg-white border border-ink/10 p-6 group hover:bg-ink hover:text-white hover:border-ink transition-all duration-500"
              >
                <p className="text-coral font-display text-3xl mb-3">{'0'}{i + 1}</p>
                <h3 className="font-display text-lg mb-1">{s.title}</h3>
                <p className="text-sm text-ink/60 leading-relaxed mb-5 group-hover:text-white/60">{s.desc}</p>
                <p className="font-display text-xl text-coral">{s.price}<span className="text-xs font-body text-ink/40 group-hover:text-white/40">{s.unit}</span></p>
              </Link>
            ))}
          </div>
          {/* Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {services.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  const el = scrollRef.current;
                  if (!el) return;
                  const w = el.querySelector('a')?.offsetWidth || 0;
                  el.scrollTo({ left: w * i + i * 16, behavior: 'smooth' });
                }}
                className={`w-2 h-2 rounded-full transition-all ${i === activeDot ? 'bg-coral w-5' : 'bg-ink/20'}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop: 4-column grid */}
        <div className="hidden md:grid md:grid-cols-4 gap-px bg-ink/10">
          {services.map((s, i) => (
            <Link to="/pesan" key={s.title} className="bg-white p-8 group hover:bg-ink hover:text-white transition-all duration-500">
              <p className="text-coral font-display text-4xl mb-4 opacity-0 animate-fade-in group-hover:opacity-100 transition-opacity duration-500" style={{ animationDelay: `${i * 150}ms`, animationFillMode: 'forwards' }}>0{i + 1}</p>
              <h3 className="font-display text-xl mb-2">{s.title}</h3>
              <p className="text-sm leading-relaxed mb-6 text-ink/60 group-hover:text-white/60 transition-colors">{s.desc}</p>
              <p className="font-display text-2xl text-coral">{s.price}<span className="text-sm font-body text-ink/40 group-hover:text-white/40">{s.unit}</span></p>
            </Link>
          ))}
        </div>
      </section>

      {/* Cara Kerja */}
      <section className="bg-white py-10 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-16">
            <p className="text-coral font-medium text-xs md:text-sm tracking-[0.3em] uppercase mb-2 md:mb-3">Cara Kerja</p>
            <h2 className="font-display text-2xl md:text-5xl text-ink">Gampang, tinggal 4 langkah</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
            {steps.map((s, i) => (
              <div key={s.num} className="relative group">
                <p className="font-display text-6xl md:text-7xl text-ink/5 group-hover:text-ink/10 transition-colors absolute -top-4 right-0 select-none">{s.num}</p>
                <div className="relative">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-coral/10 flex items-center justify-center mb-3 md:mb-4 group-hover:bg-coral/20 transition-colors">
                    <span className="font-display text-sm md:text-lg font-bold text-coral">{s.num}</span>
                  </div>
                  <h3 className="font-display text-base md:text-xl mb-1 md:mb-2">{s.title}</h3>
                  <p className="text-xs md:text-sm text-ink/60 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-ink text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-coral/5" style={{ clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0% 100%)' }} />
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-20 relative">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl md:text-5xl leading-tight mb-4 md:mb-6">Siap merapikan cucian Anda?</h2>
            <p className="text-white/60 text-sm md:text-base mb-6 md:mb-8">Satu klik, cucian bersih. Pesan sekarang dan nikmati antar jemput gratis.</p>
            <Link to="/pesan" className="inline-block bg-coral text-white font-medium px-6 md:px-10 py-3 md:py-4 hover:bg-coral/90 transition-all uppercase text-sm tracking-widest">
              Mulai Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* Floating CTA — mobile only */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 md:hidden ${
          showFloating ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <Link
          to="/pesan"
          className="block w-full text-center bg-[#E14D65] text-white font-medium px-6 py-4 text-sm uppercase tracking-widest rounded-t-lg shadow-[0_-4px_20px_rgba(225,77,101,0.35)] hover:bg-[#c93d54] transition-colors"
        >
          Pesan Sekarang
        </Link>
      </div>
    </>
  );
}
