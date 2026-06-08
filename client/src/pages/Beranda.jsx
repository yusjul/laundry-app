import { Link } from 'react-router-dom';

const services = [
  { title: 'Cuci Kering', desc: 'Dicuci bersih tanpa setrika', price: 'Rp 7.000/kg', icon: '🧺' },
  { title: 'Cuci Setrika', desc: 'Dicuci + disetrika rapi', price: 'Rp 10.000/kg', icon: '👕' },
  { title: 'Dry Clean', desc: 'Perawatan khusus bahan', price: 'Rp 15.000/item', icon: '✨' },
  { title: 'Bed Cover', desc: 'Selimut & bed cover besar', price: 'Rp 25.000/item', icon: '🛏️' },
];

const steps = [
  { num: '1', title: 'Pesan', desc: 'Isi form online atau hubungi kami' },
  { num: '2', title: 'Kami Jemput', desc: 'Kurir kami ambil cucian Anda' },
  { num: '3', title: 'Dicuci & Disetrika', desc: 'Diproses dengan standar kebersihan tinggi' },
  { num: '4', title: 'Diantar Kembali', desc: 'Cucian bersih diantar tepat waktu' },
];

export default function Beranda() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Cucian Bersih, <span className="text-blue-200">Harum</span>, Tepat Waktu
          </h1>
          <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
            LaundryKu siap membantu urusan cucian Anda. Antar jemput gratis, proses cepat, hasil maksimal.
          </p>
          <Link
            to="/pesan"
            className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-blue-50 transition-colors"
          >
            Pesan Sekarang
          </Link>
        </div>
      </section>

      {/* Layanan */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">Layanan Kami</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {services.map((s) => (
            <div key={s.title} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">{s.icon}</div>
              <h3 className="font-semibold text-lg mb-1">{s.title}</h3>
              <p className="text-gray-500 text-sm mb-2">{s.desc}</p>
              <p className="text-blue-600 font-bold">{s.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cara Kerja */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">Cara Kerja</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.num} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">{s.num}</div>
                <h3 className="font-semibold mb-1">{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Siap Memulai?</h2>
        <p className="text-gray-500 mb-6">Pesan sekarang dan nikmati cucian bersih tanpa ribet.</p>
        <Link to="/pesan" className="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">Pesan Sekarang</Link>
      </section>
    </>
  );
}
