import { Outlet, Link, useLocation } from 'react-router-dom';

const sidebarLinks = [
  { to: '/admin', label: 'Dashboard', icon: '01' },
  { to: '/admin/orders', label: 'Orders', icon: '02' },
  { to: '/admin/laporan', label: 'Laporan', icon: '03' },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-cream">
      <aside className="w-60 bg-white border-r border-ink/5 p-6">
        <Link to="/" className="font-display text-xl text-ink mb-8 block">
          <span className="text-coral">L</span>undry<span className="text-coral">K</span>u
        </Link>
        <nav className="space-y-1">
          {sidebarLinks.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-3 text-sm transition-colors ${
                  active ? 'bg-ink text-white' : 'text-ink/60 hover:text-ink hover:bg-ink/5'
                }`}
              >
                <span className="font-display text-xs opacity-50">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="flex-1 p-8"><Outlet /></div>
    </div>
  );
}
