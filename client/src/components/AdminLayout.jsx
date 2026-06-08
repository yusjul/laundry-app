import { Outlet, Link, useLocation } from 'react-router-dom';

const sidebarLinks = [
  { to: '/admin', label: 'Dashboard', icon: '📊' },
  { to: '/admin/orders', label: 'Orders', icon: '📋' },
  { to: '/admin/laporan', label: 'Laporan', icon: '📈' },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-56 bg-white border-r border-gray-200 p-4">
        <Link to="/" className="text-lg font-bold text-blue-600 mb-6 block">LaundryKu</Link>
        <nav className="space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.to ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 p-6"><Outlet /></div>
    </div>
  );
}
