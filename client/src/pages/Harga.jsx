import { Link } from 'react-router-dom';
import { Droplets, Shirt, Sparkles, Bed, Truck, ChevronRight } from 'lucide-react';

const priceList = [
  {
    service: 'Cuci Kering',
    slug: 'cuci-kering',
    price: 'Rp 7.000',
    unit: '/kg',
    desc: 'Dicuci bersih, dikeringkan, siap pakai',
    icon: Droplets,
  },
  {
    service: 'Cuci Setrika',
    slug: 'cuci-setrika',
    price: 'Rp 10.000',
    unit: '/kg',
    desc: 'Dicuci bersih + disetrika rapi',
    icon: Shirt,
    popular: true,
  },
  {
    service: 'Dry Clean',
    slug: 'dry-clean',
    price: 'Rp 15.000',
    unit: '/item',
    desc: 'Perawatan khusus untuk bahan sensitif',
    icon: Sparkles,
  },
  {
    service: 'Bed Cover',
    slug: 'bed-cover',
    price: 'Rp 25.000',
    unit: '/item',
    desc: 'Bed cover, selimut, dan sprei besar',
    icon: Bed,
  },
  {
    service: 'Antar Jemput',
    slug: 'antar-jemput',
    price: 'Rp 5.000',
    unit: '/x',
    desc: 'Gratis untuk area tertentu',
    icon: Truck,
  },
];

export default function Harga() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-20">
      <div className="mb-8 md:mb-14">
        <p className="text-coral font-medium text-xs md:text-sm tracking-[0.3em] uppercase mb-2 md:mb-3">Tarif</p>
        <h1 className="font-display text-2xl md:text-5xl text-ink leading-tight">Harga Layanan</h1>
        <p className="text-ink/50 text-sm md:text-base mt-2 md:mt-3">Harga terjangkau, kualitas premium. Tidak ada biaya tersembunyi.</p>
      </div>

      <div className="divide-y divide-ink/10 border-t border-ink/10">
        {priceList.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.service}
              to={`/pesan?service=${item.slug}`}
              className="flex items-center gap-4 py-4 md:py-6 px-4 -mx-4 active:scale-[0.99] active:bg-zinc-50 transition-all rounded-lg"
            >
              {/* Icon circle */}
              <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-pink-100 flex items-center justify-center">
                <Icon className="w-5 h-5 md:w-6 md:h-6 text-[#E14D65]" />
              </div>

              {/* Title + description */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base md:text-xl text-ink truncate">{item.service}</h3>
                  {item.popular && (
                    <span className="shrink-0 bg-[#E14D65] text-white text-[10px] px-2 py-0.5 rounded-full font-medium">Paling Populer</span>
                  )}
                </div>
                <p className="text-xs md:text-sm text-zinc-600 mt-0.5 truncate">{item.desc}</p>
              </div>

              {/* Price + chevron */}
              <div className="shrink-0 flex items-center gap-1.5">
                <div className="text-right">
                  <span className="font-display text-lg md:text-3xl text-coral">{item.price}</span>
                  <span className="text-xs md:text-sm text-ink/40 ml-0.5">{item.unit}</span>
                </div>
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-zinc-300" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
