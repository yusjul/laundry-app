import React, { useState, useEffect } from 'react';
import { Calendar, Truck, MessageSquare, Navigation, Check } from 'lucide-react';

export default function TugasKurir({ kurir }) {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('jemput'); // 'jemput' | 'antar'
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Gagal mengambil daftar tugas kurir:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        await fetch(`/api/orders/${orderId}/send-wa`, { method: 'POST' });
        fetchTasks();
      }
    } catch (err) {
      console.error('Gagal memperbarui status tugas:', err);
    }
  };

  const filteredTasks = tasks.filter(order => {
    if (activeTab === 'jemput') {
      return order.id_kurir_jemput === kurir.id && (order.status === 'pending' || order.status === 'diambil');
    } else {
      return order.id_kurir_antar === kurir.id && (order.status === 'selesai' || order.status === 'diantar');
    }
  });

  const formatPhoneForWA = (rawPhone) => {
    if (!rawPhone) return '';
    return rawPhone.replace(/^\+/, '').replace(/^0/, '62').replace(/[^0-9]/g, '');
  };

  return (
    <div className="p-4 space-y-6 font-body bg-cream text-ink">
      <div className="space-y-1">
        <h2 className="text-xl font-display font-bold text-ink">Daftar Tugas Kurir</h2>
        <p className="text-xs text-ink/60 font-medium">Lihat jadwal tugas jemput dan antar pakaian laundry Anda.</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-white border border-ink/10 p-1 rounded-xl shadow-sm">
        <button
          onClick={() => setActiveTab('jemput')}
          className={`flex-grow py-2.5 text-center text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'jemput' ? 'bg-coral text-white shadow-sm' : 'text-ink/60 hover:text-ink'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" /> Jadwal Jemput
        </button>
        <button
          onClick={() => setActiveTab('antar')}
          className={`flex-grow py-2.5 text-center text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'antar' ? 'bg-coral text-white shadow-sm' : 'text-ink/60 hover:text-ink'
          }`}
        >
          <Truck className="w-3.5 h-3.5" /> Jadwal Antar
        </button>
      </div>

      {loading ? (
        <p className="text-center py-10 text-xs text-ink/40 font-medium animate-pulse font-mono">Memuat tugas...</p>
      ) : (
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center bg-white border border-ink/10 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-2">
              <Check className="w-8 h-8 text-coral bg-coral/10 p-2 rounded-full" />
              <p className="text-xs text-ink/40 font-bold">Tidak ada tugas aktif dalam jadwal ini.</p>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const waMessage = encodeURIComponent(
                `Halo ${task.customer_name}, saya kurir LundryKu. Saya sedang dalam perjalanan untuk ${
                  activeTab === 'jemput' ? 'menjemput pakaian kotor' : 'mengantarkan pakaian bersih'
                } Anda.`
              );
              const isTaskCompleted = task.status === 'diambil' && activeTab === 'jemput' || task.status === 'diantar' && activeTab === 'antar';

              return (
                <div
                  key={task.id}
                  className="p-4 bg-white border border-ink/10 rounded-2xl space-y-4 shadow-sm"
                >
                  {/* Task Header */}
                  <div className="flex justify-between items-start border-b border-ink/5 pb-2.5">
                    <div>
                      <h4 className="font-bold text-sm text-ink">{task.customer_name}</h4>
                      <span className="text-[10px] text-ink/40 font-mono">{task.order_no}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      task.status === 'pending' ? 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20' :
                      task.status === 'diambil' ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20' :
                      task.status === 'selesai' ? 'bg-purple-500/10 text-purple-600 border border-purple-500/20' :
                      'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                    }`}>
                      {task.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Task Details */}
                  <div className="space-y-2 text-xs font-semibold text-ink/80">
                    <div className="flex gap-2">
                      <span className="text-ink/40 w-16 shrink-0 font-bold">No WA:</span>
                      <span>{task.phone}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-ink/40 w-16 shrink-0 font-bold">Alamat:</span>
                      <span className="leading-relaxed">{task.address || 'Tidak ada alamat lengkap.'}</span>
                    </div>
                    {task.notes && (
                      <div className="flex gap-2 p-2 bg-cream rounded-lg border border-ink/5 text-ink/60">
                        <span className="text-ink/40 w-16 shrink-0 font-bold">Catatan:</span>
                        <span>{task.notes}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-ink/5">
                    {/* Chat WhatsApp Button */}
                    <a
                      href={`https://wa.me/${formatPhoneForWA(task.phone)}?text=${waMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-600/10 border border-emerald-500/20 hover:bg-emerald-600/20 text-emerald-600 text-xs font-bold rounded-xl text-center transition-all"
                    >
                      <MessageSquare className="w-4 h-4" /> WhatsApp
                    </a>

                    {/* GPS Map Navigation Button */}
                    {task.latitude && task.longitude ? (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${task.latitude},${task.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-coral/10 border border-coral/20 hover:bg-coral/20 text-coral text-xs font-bold rounded-xl text-center transition-all font-display uppercase tracking-wider"
                      >
                        <Navigation className="w-4 h-4" /> Navigasi
                      </a>
                    ) : (
                      <button
                        disabled
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-zinc-100 text-zinc-400 text-xs font-bold rounded-xl text-center border border-zinc-200 cursor-not-allowed"
                      >
                        <Navigation className="w-4 h-4" /> Tanpa GPS
                      </button>
                    )}
                  </div>

                  {/* Complete Task Confirmation Action Button */}
                  {!isTaskCompleted && (
                    <button
                      onClick={() => handleUpdateStatus(task.id, activeTab === 'jemput' ? 'diambil' : 'diantar')}
                      className="w-full py-3 bg-ink hover:bg-ink/90 active:scale-[0.98] text-white text-xs font-medium uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" /> {activeTab === 'jemput' ? 'Selesai Jemput Pakaian' : 'Selesai Antar Pakaian'}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
