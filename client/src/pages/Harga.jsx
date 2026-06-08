const priceList = [
  { service: 'Cuci Kering', price: 'Rp 7.000', unit: '/kg', desc: 'Dicuci bersih, dikeringkan, siap pakai' },
  { service: 'Cuci Setrika', price: 'Rp 10.000', unit: '/kg', desc: 'Dicuci bersih + disetrika rapi' },
  { service: 'Dry Clean', price: 'Rp 15.000', unit: '/item', desc: 'Perawatan khusus untuk bahan sensitif' },
  { service: 'Bed Cover', price: 'Rp 25.000', unit: '/item', desc: 'Bed cover, selimut, dan sprei besar' },
  { service: 'Antar Jemput', price: 'Rp 5.000', unit: '/transaksi', desc: 'Gratis untuk area tertentu' },
];

export default function Harga() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-2">Harga Layanan</h1>
      <p className="text-gray-500 text-center mb-10">Harga terjangkau dengan kualitas terbaik</p>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y">
        {priceList.map((item) => (
          <div key={item.service} className="flex items-center justify-between p-5">
            <div>
              <h3 className="font-semibold">{item.service}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-blue-600">{item.price}</span>
              <span className="text-sm text-gray-400">{item.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
