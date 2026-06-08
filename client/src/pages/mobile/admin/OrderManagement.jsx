import React, { useState, useEffect } from 'react';
import { MessageSquare, ClipboardCheck } from 'lucide-react';

const statusFlow = ['pending', 'diambil', 'dicuci', 'disetrika', 'selesai', 'diantar'];
const statusLabels = {
  pending: 'Menunggu',
  diambil: 'Diambil',
  dicuci: 'Dicuci',
  disetrika: 'Disetrika',
  selesai: 'Selesai',
  diantar: 'Diantar',
};

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [kurirs, setKurirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notificationLog, setNotificationLog] = useState(null);

  const fetchData = async () => {
    try {
      const ordersRes = await fetch('/api/orders');
      const ordersData = await ordersRes.json();
      setOrders(ordersData);

      const kurirsRes = await fetch('/api/orders/kurirs/list');
      const kurirsData = await kurirsRes.json();
      setKurirs(kurirsData);
    } catch (err) {
      console.error('Gagal memuat data order management:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const updatedOrder = await res.json();

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: updatedOrder.status } : o))
      );

      const waRes = await fetch(`/api/orders/${orderId}/send-wa`, {
        method: 'POST',
      });
      const waData = await waRes.json();

      setNotificationLog({
        order_no: updatedOrder.order_no,
        phone: updatedOrder.phone,
        message: waData.message,
        timestamp: new Date().toLocaleTimeString(),
      });

      setTimeout(() => setNotificationLog(null), 8000);
    } catch (err) {
      console.error('Gagal memperbarui status order:', err);
    }
  };

  const handleAssignKurir = async (orderId, field, kurirId) => {
    try {
      const payload = {
        [field]: kurirId ? parseInt(kurirId) : null,
      };

      await fetch(`/api/orders/${orderId}/assign-kurir`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      fetchData();
    } catch (err) {
      console.error('Gagal menugaskan kurir:', err);
    }
  };

  return (
    <div className="p-4 space-y-6 font-body bg-cream text-ink">
      <div className="space-y-1">
        <h2 className="text-xl font-display font-bold text-ink">Manajemen Order</h2>
        <p className="text-xs text-ink/60 font-medium">Atur status pengerjaan laundry dan tugaskan kurir pengantar-jemput.</p>
      </div>

      {/* Simulated WhatsApp Notification Log Alert */}
      {notificationLog && (
        <div className="p-4 bg-white border border-coral/30 rounded-2xl space-y-2 text-xs text-ink animate-slideDown shadow-sm">
          <div className="flex justify-between items-center border-b border-ink/5 pb-1.5 font-bold uppercase tracking-wider text-[10px] text-coral">
            <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> WhatsApp Gateway Triggered</span>
            <span className="text-ink/40 font-mono">{notificationLog.timestamp}</span>
          </div>
          <p className="text-[10px] text-ink/70">
            <strong>Sent to:</strong> {notificationLog.phone} (Order: {notificationLog.order_no})
          </p>
          <pre className="p-2.5 bg-cream rounded-xl text-[10px] text-ink/80 font-mono whitespace-pre-wrap leading-relaxed border border-ink/10">
            {notificationLog.message}
          </pre>
        </div>
      )}

      {loading ? (
        <p className="text-center py-10 text-xs text-ink/40 font-medium animate-pulse font-mono">Memuat daftar order...</p>
      ) : (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-center py-12 text-xs text-ink/40 font-medium bg-white border border-ink/10 rounded-2xl">
              Belum ada pesanan masuk.
            </p>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="p-4 bg-white border border-ink/10 rounded-2xl space-y-4 text-xs shadow-sm"
              >
                {/* Info Utama */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm text-ink">{order.customer_name}</h3>
                    <p className="text-[10px] text-coral font-mono tracking-wider uppercase mt-0.5">{order.order_no}</p>
                    <p className="text-[10px] text-ink/50 mt-1">{order.phone} | {order.address || 'No Address'}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-coral">Rp {order.total_price.toLocaleString('id-ID')}</span>
                    <p className="text-[9px] text-ink/60 mt-1 font-bold">{order.service_type} ({order.weight || 0} kg)</p>
                  </div>
                </div>

                <div className="border-t border-ink/5 pt-3.5 space-y-3">
                  {/* Status Dropdown */}
                  <div className="flex justify-between items-center">
                    <label htmlFor={`status-${order.id}`} className="text-[10px] font-bold text-ink/40 uppercase tracking-wider flex items-center gap-1">
                      <ClipboardCheck className="w-3.5 h-3.5 text-coral" /> Status Pengerjaan
                    </label>
                    <select
                      id={`status-${order.id}`}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="bg-cream border border-ink/10 text-[11px] font-bold text-ink rounded-lg py-1 px-2 focus:outline-none focus:border-coral"
                    >
                      {statusFlow.map((s) => (
                        <option key={s} value={s}>
                          {statusLabels[s]}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Kurir Jemput Assignment */}
                  <div className="flex justify-between items-center">
                    <label htmlFor={`kurir-jemput-${order.id}`} className="text-[10px] font-bold text-ink/40 uppercase tracking-wider">Kurir Penjemput</label>
                    <select
                      id={`kurir-jemput-${order.id}`}
                      value={order.id_kurir_jemput || ''}
                      onChange={(e) => handleAssignKurir(order.id, 'id_kurir_jemput', e.target.value)}
                      className="bg-cream border border-ink/10 text-[11px] font-bold text-ink rounded-lg py-1 px-2 focus:outline-none focus:border-coral"
                    >
                      <option value="">-- Pilih Kurir --</option>
                      {kurirs.map((k) => (
                        <option key={k.id} value={k.id}>
                          {k.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Kurir Antar Assignment */}
                  <div className="flex justify-between items-center">
                    <label htmlFor={`kurir-antar-${order.id}`} className="text-[10px] font-bold text-ink/40 uppercase tracking-wider">Kurir Pengantar</label>
                    <select
                      id={`kurir-antar-${order.id}`}
                      value={order.id_kurir_antar || ''}
                      onChange={(e) => handleAssignKurir(order.id, 'id_kurir_antar', e.target.value)}
                      className="bg-cream border border-ink/10 text-[11px] font-bold text-ink rounded-lg py-1 px-2 focus:outline-none focus:border-coral"
                    >
                      <option value="">-- Pilih Kurir --</option>
                      {kurirs.map((k) => (
                        <option key={k.id} value={k.id}>
                          {k.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
