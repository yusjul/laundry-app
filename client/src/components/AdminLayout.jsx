import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, BarChart3 } from 'lucide-react';

const sidebarLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { to: '/admin/laporan', label: 'Laporan', icon: BarChart3 },
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
            const Icon = link.icon;
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-3 text-sm transition-colors ${
                  active ? 'bg-ink text-white' : 'text-ink/60 hover:text-ink hover:bg-ink/5'
                }`}
              >
                <Icon className="w-4 h-4" />
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
