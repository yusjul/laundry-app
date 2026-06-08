import React, { useState } from 'react';
import { ShoppingBag, BarChart2, Truck, AlertTriangle } from 'lucide-react';

export default function Login({ onLogin }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Quick 1-tap mock accounts
  const mockAccounts = [
    { name: 'Farhan (Customer)', phone: '628333333333', role: 'customer', pass: 'customer123', label: 'Pelanggan', Icon: ShoppingBag },
    { name: 'Joko (Admin)', phone: '628123456789', role: 'admin', pass: 'admin123', label: 'Admin Laundry', Icon: BarChart2 },
    { name: 'Budi (Kurir)', phone: '628111111111', role: 'kurir', pass: 'kurir123', label: 'Kurir Antar-Jemput', Icon: Truck },
  ];

  const handleQuickLogin = (acc) => {
    const mockUser = {
      id: acc.phone === '628123456789' ? 1 : acc.phone === '628111111111' ? 2 : acc.phone === '628222222222' ? 3 : 4,
      name: acc.name.split(' ')[0],
      phone: acc.phone,
      role: acc.role,
    };
    localStorage.setItem('lundryku_user', JSON.stringify(mockUser));
    onLogin(mockUser);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    let cleanedPhone = phone.replace(/^\+/, '').replace(/^0/, '62');
    if (!cleanedPhone.startsWith('62')) {
      cleanedPhone = '62' + cleanedPhone;
    }

    if (cleanedPhone === '628123456789' && password === 'admin123') {
      handleQuickLogin({ name: 'Joko Admin', phone: '628123456789', role: 'admin' });
    } else if (cleanedPhone === '628111111111' && password === 'kurir123') {
      handleQuickLogin({ name: 'Budi Kurir', phone: '628111111111', role: 'kurir' });
    } else if (cleanedPhone === '628222222222' && password === 'kurir123') {
      handleQuickLogin({ name: 'Roni Kurir', phone: '628222222222', role: 'kurir' });
    } else if (cleanedPhone === '628333333333' && password === 'customer123') {
      handleQuickLogin({ name: 'Farhan Pelanggan', phone: '628333333333', role: 'customer' });
    } else {
      setError('Nomor HP atau kata sandi salah. Silakan gunakan tombol 1-Tap Login untuk mempermudah uji coba.');
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center px-4 py-8 bg-cream text-ink font-body">
      <div className="w-full max-w-md mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-ink flex items-center justify-center font-display font-black text-white text-xl mx-auto shadow-md">
            LK
          </div>
          <h2 className="text-2xl font-display font-extrabold tracking-tight text-ink">Masuk ke LundryKu</h2>
          <p className="text-xs text-ink/60 font-medium">Silakan gunakan salah satu role di bawah untuk memulai</p>
        </div>

        {/* 1-Tap Demo Logins */}
        <div className="bg-white border border-ink/10 p-5 rounded-2xl space-y-3 shadow-sm">
          <p className="text-[10px] text-coral font-bold uppercase tracking-wider text-center">Akses Cepat (Demo 1-Tap Login)</p>
          <div className="grid grid-cols-1 gap-2.5">
            {mockAccounts.map((acc, index) => {
              const AccIcon = acc.Icon;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleQuickLogin(acc)}
                  className="w-full py-3 px-4 bg-cream hover:bg-cream/75 border border-ink/10 rounded-xl text-xs font-bold text-left flex justify-between items-center transition-all duration-200 active:scale-[0.98]"
                >
                  <span className="text-ink font-bold flex items-center gap-2">
                    <AccIcon className="w-4 h-4 text-coral" /> {acc.label}
                  </span>
                  <span className="text-[10px] text-ink/40 font-mono">Phone: {acc.phone}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-ink/10"></div>
          <span className="flex-shrink mx-4 text-ink/30 text-[10px] uppercase font-bold tracking-widest">ATAU</span>
          <div className="flex-grow border-t border-ink/10"></div>
        </div>

        {/* Form Login Biasa */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-ink/70">Nomor HP WhatsApp</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08123456789 atau +628123"
              className="w-full bg-white border border-ink/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-coral text-ink placeholder-ink/20"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-ink/70">Kata Sandi</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white border border-ink/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-coral text-ink placeholder-ink/20"
              required
            />
          </div>

          {error && (
            <p className="text-xs text-coral bg-coral/5 border border-coral/10 p-3 rounded-xl flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-coral shrink-0 mt-0.5" /> 
              <span>{error}</span>
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-coral hover:bg-coral/90 text-white font-medium uppercase tracking-widest text-xs rounded-xl transition-all duration-200 active:scale-95 shadow-sm shadow-coral/10"
          >
            Masuk Sekarang
          </button>
        </form>
      </div>
    </div>
  );
}
