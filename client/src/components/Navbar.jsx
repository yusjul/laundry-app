import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const links = [
  { to: '/', label: 'Beranda' },
  { to: '/harga', label: 'Harga' },
  { to: '/pesan', label: 'Pesan' },
  { to: '/tracking', label: 'Tracking' },
  { to: '/admin', label: 'Admin' },
];

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-cream sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl md:text-3xl font-bold tracking-tight text-ink" onClick={() => setOpen(false)}>
          <span className="text-coral">L</span>undry<span className="text-coral">K</span>u
        </Link>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-ink/60 hover:text-ink transition-colors">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

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

      {open && (
        <div className="md:hidden border-t border-cream bg-white/95 backdrop-blur-sm">
          <div className="px-4 py-4 space-y-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`block px-3 py-3 text-sm tracking-wide uppercase transition-colors ${
                  location.pathname === link.to ? 'text-coral font-medium bg-coral/5' : 'text-ink/60 hover:text-ink'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
