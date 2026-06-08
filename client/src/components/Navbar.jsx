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
    <nav className="bg-white/90 backdrop-blur-sm border-b border-cream sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="font-display text-3xl font-bold tracking-tight text-ink">
          <span className="text-coral">L</span>undry<span className="text-coral">K</span>u
        </Link>
        <div className="hidden md:flex gap-8">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm tracking-wide uppercase transition-colors hover:text-coral ${
                location.pathname === link.to ? 'text-coral font-medium' : 'text-ink/60'
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
