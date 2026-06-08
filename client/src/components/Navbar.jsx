import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/', label: 'Beranda' },
  { to: '/harga', label: 'Harga' },
  { to: '/pesan', label: 'Pesan' },
  { to: '/tracking', label: 'Tracking' },
  { to: '/admin', label: 'Admin' },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight">
          <span className="text-blue-600">Laundry</span>Ku
        </Link>
        <div className="hidden md:flex gap-6">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                location.pathname === link.to ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
