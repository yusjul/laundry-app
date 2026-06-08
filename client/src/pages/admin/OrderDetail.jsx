import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const statusFlow = ['pending', 'diambil', 'dicuci', 'disetrika', 'selesai', 'diantar'];
const statusLabels = {
  pending: 'Menunggu', diambil: 'Diambil', dicuci: 'Dicuci',
  disetrika: 'Disetrika', selesai: 'Selesai', diantar: 'Diantar',
};
const statusColors = {
  pending: 'bg-yellow-500', diambil: 'bg-blue-500', dicuci: 'bg-purple-500',
  disetrika: 'bg-indigo-500', selesai: 'bg-green-500', diantar: 'bg-gray-500',
};

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = () => {
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((data) => { setOrder(data); setLoading(false); });
  };

  useEffect(() => { fetchOrder(); }, [id]);

  const handleStatus = async (status) => {
    await fetch(`/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchOrder();
  };

  if (loading) return <p className="text-gray-500">Memuat...</p>;
  if (!order) return <p className="text-red-500">Order tidak ditemukan</p>;

  const currentIdx = statusFlow.indexOf(order.status);

  return (
    <div>
      <Link to="/admin/orders" className="text-sm text-blue-600 hover:underline mb-4 inline-block">&larr; Kembali</Link>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">{order.order_no}</h1>
            <p className="text-gray-500 text-sm">Dibuat: {order.created_at}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${statusColors[order.status]}`}>
            {statusLabels[order.status]}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div><span className="text-gray-500">Nama:</span> <span className="font-medium">{order.customer_name}</span></div>
          <div><span className="text-gray-500">No HP:</span> <span className="font-medium">{order.phone}</span></div>
          <div className="col-span-2"><span className="text-gray-500">Alamat:</span> <span className="font-medium">{order.address || '-'}</span></div>
          <div><span className="text-gray-500">Layanan:</span> <span className="font-medium">{order.service_type}</span></div>
          {order.weight > 0 && <div><span className="text-gray-500">Berat:</span> <span className="font-medium">{order.weight} kg</span></div>}
          <div><span className="text-gray-500">Total:</span> <span className="font-bold text-lg text-blue-600">Rp {order.total_price.toLocaleString()}</span></div>
          {order.pickup ? <div><span className="text-gray-500">Antar Jemput:</span> <span className="font-medium">Ya</span></div> : null}
          {order.notes && <div className="col-span-2"><span className="text-gray-500">Catatan:</span> <span className="font-medium">{order.notes}</span></div>}
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4">Update Status</h3>
          <div className="flex flex-wrap gap-2">
            {statusFlow.map((s, i) => (
              <button
                key={s}
                onClick={() => handleStatus(s)}
                disabled={i <= currentIdx}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  i === currentIdx ? 'bg-blue-600 text-white'
                  : i < currentIdx ? 'bg-green-100 text-green-700 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {statusLabels[s]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
