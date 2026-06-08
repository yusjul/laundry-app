const priceList = [
  { service: 'Cuci Kering', price: 'Rp 7.000', unit: '/kg', desc: 'Dicuci bersih, dikeringkan, siap pakai' },
  { service: 'Cuci Setrika', price: 'Rp 10.000', unit: '/kg', desc: 'Dicuci bersih + disetrika rapi' },
  { service: 'Dry Clean', price: 'Rp 15.000', unit: '/item', desc: 'Perawatan khusus untuk bahan sensitif' },
  { service: 'Bed Cover', price: 'Rp 25.000', unit: '/item', desc: 'Bed cover, selimut, dan sprei besar' },
  { service: 'Antar Jemput', price: 'Rp 5.000', unit: '/x', desc: 'Gratis untuk area tertentu' },
];

export default function Harga() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="mb-14">
        <p className="text-coral font-medium text-sm tracking-[0.3em] uppercase mb-3">Tarif</p>
        <h1 className="font-display text-4xl md:text-5xl text-ink leading-tight">Harga Layanan</h1>
        <p className="text-ink/50 mt-3">Harga terjangkau, kualitas premium. Tidak ada biaya tersembunyi.</p>
      </div>

      <div className="divide-y divide-ink/10 border-t border-ink/10">
        {priceList.map((item, i) => (
          <div key={item.service} className="flex items-center justify-between py-6 group hover:bg-white/50 px-4 -mx-4 transition-colors">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-coral font-display text-sm">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="font-display text-xl">{item.service}</h3>
              </div>
              <p className="text-sm text-ink/50 mt-1 ml-8">{item.desc}</p>
            </div>
            <div className="text-right">
              <span className="font-display text-3xl text-coral">{item.price}</span>
              <span className="text-sm text-ink/40 ml-1">{item.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
