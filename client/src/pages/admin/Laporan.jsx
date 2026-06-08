import { useState, useEffect, useMemo } from 'react';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const statusLabels = {
  pending: 'Menunggu', diambil: 'Diambil', dicuci: 'Dicuci',
  disetrika: 'Disetrika', selesai: 'Selesai', diantar: 'Diantar',
};
const today = new Date().toISOString().split('T')[0];
const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

export default function Laporan() {
  const [orders, setOrders] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [startDate, setStartDate] = useState(weekAgo);
  const [endDate, setEndDate] = useState(today);
  const [error, setError] = useState('');

  const fetchData = () => {
    setError('');
    const c1 = new AbortController();
    const c2 = new AbortController();
    const t1 = setTimeout(() => c1.abort(), 10000);
    const t2 = setTimeout(() => c2.abort(), 10000);

    Promise.all([
      fetch(startDate && endDate ? `/api/orders?date=${endDate}` : '/api/orders', { signal: c1.signal }).then((r) => r.json()),
      fetch(startDate && endDate ? `/api/expenses?start=${startDate}&end=${endDate}` : '/api/expenses', { signal: c2.signal }).then((r) => r.json()),
    ])
      .then(([o, e]) => { setOrders(o); setExpenses(e); })
      .catch((err) => setError('Gagal memuat data'))
      .finally(() => { clearTimeout(t1); clearTimeout(t2); });
  };

  useEffect(() => { fetchData(); }, []);

  const filteredOrders = useMemo(() => {
    if (!startDate || !endDate) return orders;
    return orders.filter((o) => {
      const d = o.created_at?.split(' ')[0];
      return d >= startDate && d <= endDate;
    });
  }, [orders, startDate, endDate]);

  const totalRevenue = filteredOrders.reduce((s, o) => s + o.total_price, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  const formatRp = (n) => `Rp ${n.toLocaleString()}`;

  const exportExcel = () => {
    const rows = filteredOrders.map((o) => ({
      'No Order': o.order_no,
      Pelanggan: o.customer_name,
      Layanan: o.service_type,
      Berat: o.weight > 0 ? `${o.weight} kg` : '-',
      Total: o.total_price,
      Status: statusLabels[o.status] || o.status,
      Tanggal: o.created_at,
    }));
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);

    const colWidths = [{ wch: 18 }, { wch: 20 }, { wch: 14 }, { wch: 8 }, { wch: 12 }, { wch: 12 }, { wch: 20 }];
    ws['!cols'] = colWidths;

    XLSX.utils.sheet_add_aoa(ws, [['LAPORAN KEUANGAN']], { origin: -1 });
    XLSX.utils.sheet_add_aoa(ws, [[`Periode: ${startDate} - ${endDate}`]], { origin: -1 });
    XLSX.utils.sheet_add_aoa(ws, [[`Total Pendapatan: ${formatRp(totalRevenue)}`]], { origin: -1 });
    XLSX.utils.sheet_add_aoa(ws, [[`Total Pengeluaran: ${formatRp(totalExpenses)}`]], { origin: -1 });
    XLSX.utils.sheet_add_aoa(ws, [[`Pendapatan Bersih: ${formatRp(netProfit)}`]], { origin: -1 });
    XLSX.utils.sheet_add_aoa(ws, [[]], { origin: -1 });

    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    XLSX.writeFile(wb, `laporan-${startDate}-${endDate}.xlsx`);
  };

  const exportPdf = () => {
    const doc = new jsPDF('landscape', 'mm', 'a4');
    const pageW = doc.internal.pageSize.getWidth();

    doc.setFontSize(14);
    doc.text('LAPORAN KEUANGAN', pageW / 2, 18, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Periode: ${startDate} - ${endDate}`, pageW / 2, 25, { align: 'center' });

    doc.setFontSize(10);
    doc.text(`Total Pendapatan: ${formatRp(totalRevenue)}`, 14, 33);
    doc.text(`Total Pengeluaran: ${formatRp(totalExpenses)}`, 14, 39);
    doc.text(`Pendapatan Bersih: ${formatRp(netProfit)}`, 14, 45);

    const headers = [['No Order', 'Pelanggan', 'Layanan', 'Berat', 'Total', 'Status', 'Tanggal']];
    const data = filteredOrders.map((o) => [
      o.order_no, o.customer_name, o.service_type,
      o.weight > 0 ? `${o.weight} kg` : '-',
      `Rp ${o.total_price.toLocaleString()}`,
      statusLabels[o.status] || o.status,
      o.created_at,
    ]);

    doc.autoTable({
      head: headers,
      body: data,
      startY: 50,
      styles: { fontSize: 8, cellPadding: 2.5 },
      headStyles: { fillColor: [30, 30, 30], textColor: [255, 255, 255], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 28 },
        1: { cellWidth: 35 },
        2: { cellWidth: 25 },
        3: { cellWidth: 16, halign: 'center' },
        4: { cellWidth: 28, halign: 'right' },
        5: { cellWidth: 22, halign: 'center' },
        6: { cellWidth: 40 },
      },
    });

    doc.save(`laporan-${startDate}-${endDate}.pdf`);
  };

  if (error) return <p className="text-coral text-sm">{error}. <button onClick={fetchData} className="underline">Muat ulang</button></p>;

  return (
    <div>
      <h1 className="font-display text-2xl md:text-3xl mb-6 md:mb-8">Laporan Keuangan</h1>

      {/* Date Range */}
      <div className="flex flex-wrap items-end gap-3 mb-6">
        <div>
          <label className="block text-xs uppercase tracking-widest text-ink/60 mb-1">Dari</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-white border-0 border-b-2 border-ink/10 px-0 py-2 text-sm focus:border-coral focus:ring-0" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-ink/60 mb-1">Sampai</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-white border-0 border-b-2 border-ink/10 px-0 py-2 text-sm focus:border-coral focus:ring-0" />
        </div>
        <button onClick={fetchData} className="bg-ink text-white px-4 py-2 text-xs uppercase tracking-widest hover:bg-ink/90 transition-all">Tampilkan</button>

        <div className="flex gap-2 ml-auto">
          <button onClick={exportExcel} className="flex items-center gap-1.5 border border-ink/10 px-3 py-2 text-xs uppercase tracking-widest text-ink/60 hover:text-ink hover:border-ink/30 transition-all">
            <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
          </button>
          <button onClick={exportPdf} className="flex items-center gap-1.5 border border-ink/10 px-3 py-2 text-xs uppercase tracking-widest text-ink/60 hover:text-ink hover:border-ink/30 transition-all">
            <FileText className="w-3.5 h-3.5" /> PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6">
          <p className="text-xs uppercase tracking-widest text-ink/40 mb-2">Total Pendapatan</p>
          <p className="font-display text-3xl text-ink">{formatRp(totalRevenue)}</p>
          <p className="text-xs text-ink/40 mt-1">{filteredOrders.length} order</p>
        </div>
        <div className="bg-white p-6">
          <p className="text-xs uppercase tracking-widest text-ink/40 mb-2">Total Pengeluaran</p>
          <p className="font-display text-3xl text-coral">{formatRp(totalExpenses)}</p>
          <p className="text-xs text-ink/40 mt-1">{expenses.length} transaksi</p>
        </div>
        <div className="bg-white p-6">
          <p className="text-xs uppercase tracking-widest text-ink/40 mb-2">Pendapatan Bersih</p>
          <p className={`font-display text-3xl ${netProfit >= 0 ? 'text-green-600' : 'text-coral'}`}>
            {formatRp(netProfit)}
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10">
              <th className="text-left px-4 py-4 text-xs uppercase tracking-widest text-ink/40 font-medium">Order</th>
              <th className="text-left px-4 py-4 text-xs uppercase tracking-widest text-ink/40 font-medium">Pelanggan</th>
              <th className="text-left px-4 py-4 text-xs uppercase tracking-widest text-ink/40 font-medium">Layanan</th>
              <th className="text-left px-4 py-4 text-xs uppercase tracking-widest text-ink/40 font-medium">Berat</th>
              <th className="text-right px-4 py-4 text-xs uppercase tracking-widest text-ink/40 font-medium">Total</th>
              <th className="text-left px-4 py-4 text-xs uppercase tracking-widest text-ink/40 font-medium">Status</th>
              <th className="text-left px-4 py-4 text-xs uppercase tracking-widest text-ink/40 font-medium">Tanggal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {filteredOrders.map((o) => (
              <tr key={o.id} className="hover:bg-cream/50 transition-colors">
                <td className="px-4 py-4 font-medium">{o.order_no}</td>
                <td className="px-4 py-4">{o.customer_name}</td>
                <td className="px-4 py-4 text-ink/60">{o.service_type}</td>
                <td className="px-4 py-4 text-ink/60">{o.weight > 0 ? `${o.weight} kg` : '-'}</td>
                <td className="px-4 py-4 text-right font-medium">Rp {o.total_price.toLocaleString()}</td>
                <td className="px-4 py-4 text-xs uppercase tracking-wider text-ink/50">{statusLabels[o.status] || o.status}</td>
                <td className="px-4 py-4 text-ink/40 text-xs">{o.created_at}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-ink/10 bg-ink/5">
              <td colSpan={4} className="px-4 py-4 text-xs uppercase tracking-widest text-ink/50 font-medium">Total</td>
              <td className="px-4 py-4 text-right font-display text-lg text-coral">Rp {totalRevenue.toLocaleString()}</td>
              <td colSpan={2}></td>
            </tr>
          </tfoot>
        </table>
        {filteredOrders.length === 0 && <p className="text-center text-ink/30 py-12 text-sm">Belum ada order</p>}
      </div>
    </div>
  );
}
