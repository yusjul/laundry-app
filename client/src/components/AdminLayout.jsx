import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, BarChart3, Wallet, Menu, X } from 'lucide-react';
import ConnectionStatus from './ConnectionStatus';

const sidebarLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { to: '/admin/laporan', label: 'Laporan', icon: BarChart3 },
  { to: '/admin/pengeluaran', label: 'Pengeluaran', icon: Wallet },
];

export default function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <ConnectionStatus />
      <div className="flex flex-1">
        <aside className={`fixed md:static inset-y-0 left-0 z-40 w-60 bg-white border-r border-ink/5 p-6 transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="font-display text-xl text-ink">
            <span className="text-coral">L</span>undry<span className="text-coral">K</span>u
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 text-ink/40 hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
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

      {sidebarOpen && <div className="fixed inset-0 bg-black/20 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 min-w-0">
        <div className="md:hidden flex items-center gap-3 px-4 h-14 bg-white border-b border-ink/5">
          <button onClick={() => setSidebarOpen(true)} className="p-1 text-ink/60 hover:text-ink">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-display text-lg text-ink">
            <span className="text-coral">L</span>undry<span className="text-coral">K</span>u
          </span>
        </div>
        <div className="p-4 md:p-8"><Outlet /></div>
        </div>
      </div>
    </div>
  );
}
