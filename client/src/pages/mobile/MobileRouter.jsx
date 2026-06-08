import React, { useState, useEffect } from 'react';
import { ShoppingBag, Tag, MapPin, BarChart2, ClipboardList, TrendingUp, Truck } from 'lucide-react';
import Login from './shared/Login';
import PesanCucian from './customer/PesanCucian';
import CekTarif from './customer/CekTarif';
import TrackingStatus from './customer/TrackingStatus';
import DashboardFinansial from './admin/DashboardFinansial';
import OrderManagement from './admin/OrderManagement';
import LaporanKeuangan from './admin/LaporanKeuangan';
import TugasKurir from './kurir/TugasKurir';

export default function MobileRouter() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('lundryku_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setDefaultTab(parsedUser.role);
    }
  }, []);

  const setDefaultTab = (role) => {
    if (role === 'customer') setActiveTab('pesan');
    else if (role === 'admin') setActiveTab('dashboard');
    else if (role === 'kurir') setActiveTab('tugas');
  };

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setDefaultTab(loggedInUser.role);
  };

  const handleLogout = () => {
    localStorage.removeItem('lundryku_user');
    setUser(null);
    setActiveTab('');
  };

  // If user is not authenticated, show mobile login screen
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // Helper to select and navigate to order form with a specific service name pre-selected
  const navigateToOrderWithService = (serviceName) => {
    setActiveTab('pesan');
    sessionStorage.setItem('preselected_service', serviceName);
    window.dispatchEvent(new Event('preselected_service_changed'));
  };

  return (
    <div className="min-h-screen bg-cream text-ink flex flex-col font-body max-w-[767px] mx-auto border-x border-ink/10 shadow-2xl relative pb-20">
      {/* Mobile Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-ink/10 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center font-display font-bold text-white text-xs">
            LK
          </div>
          <span className="font-display font-extrabold text-sm tracking-wide text-ink">
            Lundry<span className="text-coral">Ku</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-coral bg-coral/10 px-2.5 py-0.5 rounded-full border border-coral/20 font-bold uppercase tracking-wider font-mono">
            {user.role}
          </span>
          <button
            onClick={handleLogout}
            className="text-xs text-rose-600 hover:text-rose-500 font-bold tracking-tight transition-colors"
          >
            Keluar
          </button>
        </div>
      </header>

      {/* Screen Render Area */}
      <main className="flex-1 overflow-y-auto">
        {user.role === 'customer' && (
          <>
            {activeTab === 'pesan' && <PesanCucian user={user} />}
            {activeTab === 'tarif' && <CekTarif onSelectService={navigateToOrderWithService} />}
            {activeTab === 'tracking' && <TrackingStatus />}
          </>
        )}
        {user.role === 'admin' && (
          <>
            {activeTab === 'dashboard' && <DashboardFinansial />}
            {activeTab === 'orders' && <OrderManagement />}
            {activeTab === 'laporan' && <LaporanKeuangan />}
          </>
        )}
        {user.role === 'kurir' && (
          <>
            {activeTab === 'tugas' && <TugasKurir kurir={user} />}
          </>
        )}
      </main>

      {/* Persistent Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[767px] bg-white/95 backdrop-blur-md border-t border-ink/10 py-2 px-4 flex justify-around items-center z-45 shadow-lg">
        {user.role === 'customer' && (
          <>
            <button
              onClick={() => setActiveTab('pesan')}
              className={`flex flex-col items-center text-[10px] font-bold gap-1 transition-colors py-1 ${
                activeTab === 'pesan' ? 'text-coral' : 'text-ink/50 hover:text-ink'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Pesan</span>
            </button>
            <button
              onClick={() => setActiveTab('tarif')}
              className={`flex flex-col items-center text-[10px] font-bold gap-1 transition-colors py-1 ${
                activeTab === 'tarif' ? 'text-coral' : 'text-ink/50 hover:text-ink'
              }`}
            >
              <Tag className="w-5 h-5" />
              <span>Cek Tarif</span>
            </button>
            <button
              onClick={() => setActiveTab('tracking')}
              className={`flex flex-col items-center text-[10px] font-bold gap-1 transition-colors py-1 ${
                activeTab === 'tracking' ? 'text-coral' : 'text-ink/50 hover:text-ink'
              }`}
            >
              <MapPin className="w-5 h-5" />
              <span>Tracking</span>
            </button>
          </>
        )}

        {user.role === 'admin' && (
          <>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex flex-col items-center text-[10px] font-bold gap-1 transition-colors py-1 ${
                activeTab === 'dashboard' ? 'text-coral font-bold' : 'text-ink/50 hover:text-ink'
              }`}
            >
              <BarChart2 className="w-5 h-5" />
              <span>Keuangan</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex flex-col items-center text-[10px] font-bold gap-1 transition-colors py-1 ${
                activeTab === 'orders' ? 'text-coral font-bold' : 'text-ink/50 hover:text-ink'
              }`}
            >
              <ClipboardList className="w-5 h-5" />
              <span>Pesanan</span>
            </button>
            <button
              onClick={() => setActiveTab('laporan')}
              className={`flex flex-col items-center text-[10px] font-bold gap-1 transition-colors py-1 ${
                activeTab === 'laporan' ? 'text-coral font-bold' : 'text-ink/50 hover:text-ink'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span>Laporan</span>
            </button>
          </>
        )}

        {user.role === 'kurir' && (
          <div className="py-2.5 flex items-center gap-2 text-coral font-extrabold text-xs font-display">
            <Truck className="w-4 h-4 text-coral" />
            <span className="uppercase tracking-wider">Tugas Aktif Kurir: {user.name}</span>
          </div>
        )}
      </nav>
    </div>
  );
}
