import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { FileSpreadsheet, FileText } from 'lucide-react';

export default function LaporanKeuangan() {
  const [orders, setOrders] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const oRes = await fetch('/api/orders');
        const oData = await oRes.json();
        setOrders(oData);

        const eRes = await fetch('/api/expenses');
        const eData = await eRes.json();
        setExpenses(eData);
      } catch (err) {
        console.error('Gagal mengambil data laporan:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const isWithinRange = (dateStr) => {
    if (!dateStr) return false;
    const dateOnly = dateStr.split(' ')[0];
    return dateOnly >= startDate && dateOnly <= endDate;
  };

  const filteredOrders = orders.filter(o => isWithinRange(o.created_at));
  const filteredExpenses = expenses.filter(e => isWithinRange(e.date || e.created_at));

  const totalIncome = filteredOrders.reduce((sum, o) => sum + (o.total_price || 0), 0);
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const netProfit = totalIncome - totalExpenses;

  // EXPORT EXCEL (SheetJS)
  const handleExportExcel = () => {
    try {
      const ordersSheetData = filteredOrders.map(o => ({
        'No Order': o.order_no,
        'Pelanggan': o.customer_name,
        'No WA': o.phone,
        'Layanan': o.service_type,
        'Berat (kg)': o.weight || 0,
        'Status': o.status,
        'Total Harga (Rp)': o.total_price,
        'Tanggal': o.created_at
      }));

      const expensesSheetData = filteredExpenses.map(e => ({
        'Nama Pengeluaran': e.name,
        'Kategori': e.category,
        'Nominal (Rp)': e.amount,
        'Tanggal': e.date,
        'Catatan': e.notes || ''
      }));

      const workbook = XLSX.utils.book_new();
      
      const oWorksheet = XLSX.utils.json_to_sheet(ordersSheetData);
      XLSX.utils.book_append_sheet(workbook, oWorksheet, 'Pendapatan Laundry');

      const eWorksheet = XLSX.utils.json_to_sheet(expensesSheetData);
      XLSX.utils.book_append_sheet(workbook, eWorksheet, 'Pengeluaran Operasional');

      XLSX.writeFile(workbook, `Laporan_LundryKu_${startDate}_to_${endDate}.xlsx`);
    } catch (err) {
      console.error('Gagal mengekspor Excel:', err);
      alert('Gagal mengekspor Excel');
    }
  };

  // EXPORT PDF (jsPDF + AutoTable)
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(16);
      doc.setTextColor(26, 26, 46); // ink #1a1a2e
      doc.text('Laporan Transaksi Finansial LundryKu', 14, 15);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`Periode: ${startDate} s.d. ${endDate}`, 14, 22);
      doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`, 14, 27);

      doc.setFontSize(11);
      doc.setTextColor(26, 26, 46);
      doc.text(`Total Pendapatan Kotor: Rp ${totalIncome.toLocaleString('id-ID')}`, 14, 38);
      doc.text(`Total Pengeluaran: Rp ${totalExpenses.toLocaleString('id-ID')}`, 14, 44);
      doc.text(`Total Keuntungan Bersih: Rp ${netProfit.toLocaleString('id-ID')}`, 14, 50);

      doc.setFontSize(13);
      doc.text('A. Transaksi Masuk (Pendapatan)', 14, 60);

      const orderHeaders = ['No Order', 'Pelanggan', 'Layanan', 'Berat', 'Total Harga', 'Tanggal'];
      const orderRows = filteredOrders.map(o => [
        o.order_no,
        o.customer_name,
        o.service_type,
        `${o.weight || 0} kg`,
        `Rp ${o.total_price.toLocaleString('id-ID')}`,
        o.created_at ? o.created_at.split(' ')[0] : '-'
      ]);

      doc.autoTable({
        head: [orderHeaders],
        body: orderRows,
        startY: 64,
        theme: 'striped',
        headStyles: { fillColor: [26, 26, 46] }, // warna ink
        styles: { fontSize: 9 }
      });

      const finalY = doc.previousAutoTable.finalY + 12;
      doc.setFontSize(13);
      doc.text('B. Pengeluaran Operasional', 14, finalY);

      const expenseHeaders = ['Pengeluaran', 'Kategori', 'Nominal', 'Tanggal', 'Catatan'];
      const expenseRows = filteredExpenses.map(e => [
        e.name,
        e.category,
        `Rp ${e.amount.toLocaleString('id-ID')}`,
        e.date,
        e.notes || '-'
      ]);

      doc.autoTable({
        head: [expenseHeaders],
        body: expenseRows,
        startY: finalY + 4,
        theme: 'striped',
        headStyles: { fillColor: [233, 69, 96] }, // warna coral #e94560
        styles: { fontSize: 9 }
      });

      doc.save(`Laporan_LundryKu_${startDate}_to_${endDate}.pdf`);
    } catch (err) {
      console.error('Gagal mengekspor PDF:', err);
      alert('Gagal mengekspor PDF');
    }
  };

  return (
    <div className="p-4 space-y-6 font-body bg-cream text-ink">
      <div className="space-y-1">
        <h2 className="text-xl font-display font-bold text-ink">Laporan Keuangan</h2>
        <p className="text-xs text-ink/60 font-medium">Pilih rentang tanggal untuk menganalisis arus kas laundry Anda.</p>
      </div>

      {/* Date Range Picker Form */}
      <div className="p-4 bg-white border border-ink/10 rounded-2xl space-y-3.5 shadow-sm">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-ink/40 uppercase tracking-wider">Tanggal Mulai</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-cream border border-ink/10 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-coral text-ink font-mono"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-ink/40 uppercase tracking-wider">Tanggal Akhir</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-cream border border-ink/10 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-coral text-ink font-mono"
            />
          </div>
        </div>

        {/* Action Export Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleExportExcel}
            className="py-2.5 bg-emerald-600/10 border border-emerald-500/20 hover:bg-emerald-600/20 active:scale-[0.98] text-emerald-600 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export Excel
          </button>
          <button
            onClick={handleExportPDF}
            className="py-2.5 bg-coral/10 border border-coral/20 hover:bg-coral/20 active:scale-[0.98] text-coral text-xs font-bold rounded-xl transition-all font-display uppercase tracking-wider flex items-center justify-center gap-1.5"
          >
            <FileText className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center py-10 text-xs text-ink/40 font-medium animate-pulse font-mono">Menghitung laporan keuangan...</p>
      ) : (
        <div className="space-y-5">
          {/* Summary Box */}
          <div className="p-4 bg-white border border-ink/10 rounded-2xl space-y-3 font-medium text-xs shadow-sm">
            <h3 className="text-[10px] font-bold text-ink/40 uppercase tracking-wider mb-1">Rincian Finansial Periode Ini</h3>
            <div className="flex justify-between">
              <span className="text-ink/50">Omzet Kotor:</span>
              <span className="text-ink font-bold">Rp {totalIncome.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/50">Biaya Pengeluaran:</span>
              <span className="text-coral font-bold">Rp {totalExpenses.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between border-t border-ink/5 pt-2 text-sm font-display font-bold">
              <span className="text-ink">Profit Bersih:</span>
              <span className="text-coral">
                Rp {netProfit.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Mini Tables Preview */}
          <div className="space-y-4">
            {/* Orders Summary */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-ink/40 uppercase tracking-wider">Pendapatan ({filteredOrders.length} Order)</h4>
              <div className="bg-white border border-ink/10 rounded-2xl overflow-hidden shadow-sm">
                <div className="max-h-40 overflow-y-auto text-[10px]">
                  <table className="w-full text-left">
                    <thead className="bg-cream border-b border-ink/5 text-ink/60 font-bold">
                      <tr>
                        <th className="px-3 py-2">No Order</th>
                        <th className="px-3 py-2 text-right">Nominal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/5">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan="2" className="text-center py-4 text-ink/35">Tidak ada transaksi</td>
                        </tr>
                      ) : (
                        filteredOrders.map(o => (
                          <tr key={o.id} className="hover:bg-cream/40">
                            <td className="px-3 py-2 text-ink/80 font-mono font-bold">{o.order_no}</td>
                            <td className="px-3 py-2 text-right text-ink font-bold">Rp {o.total_price.toLocaleString('id-ID')}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Expenses Summary */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-ink/40 uppercase tracking-wider">Pengeluaran ({filteredExpenses.length} Transaksi)</h4>
              <div className="bg-white border border-ink/10 rounded-2xl overflow-hidden shadow-sm">
                <div className="max-h-40 overflow-y-auto text-[10px]">
                  <table className="w-full text-left">
                    <thead className="bg-cream border-b border-ink/5 text-ink/60 font-bold">
                      <tr>
                        <th className="px-3 py-2">Deskripsi</th>
                        <th className="px-3 py-2 text-right">Nominal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/5">
                      {filteredExpenses.length === 0 ? (
                        <tr>
                          <td colSpan="2" className="text-center py-4 text-ink/35">Tidak ada pengeluaran</td>
                        </tr>
                      ) : (
                        filteredExpenses.map(e => (
                          <tr key={e.id} className="hover:bg-cream/40">
                            <td className="px-3 py-2 text-ink/80">{e.name}</td>
                            <td className="px-3 py-2 text-right text-coral font-bold">Rp {e.amount.toLocaleString('id-ID')}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
