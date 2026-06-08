import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';

export default function DashboardFinansial() {
  const [grossRevenue, setGrossRevenue] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [recentOrdersCount, setRecentOrdersCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersRes = await fetch('/api/orders');
        const ordersData = await ordersRes.json();
        
        const expensesRes = await fetch('/api/expenses');
        const expensesData = await expensesRes.json();

        const totalRev = ordersData.reduce((sum, order) => sum + (order.total_price || 0), 0);
        const totalExp = expensesData.reduce((sum, exp) => sum + (exp.amount || 0), 0);

        setGrossRevenue(totalRev);
        setTotalExpenses(totalExp);
        setRecentOrdersCount(ordersData.length);
      } catch (err) {
        console.error('Gagal mengambil data dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const netProfit = grossRevenue - totalExpenses;
  const profitMargin = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;

  return (
    <div className="p-4 space-y-6 font-body bg-cream text-ink">
      <div className="space-y-1">
        <h2 className="text-xl font-display font-bold text-ink">Dashboard Finansial</h2>
        <p className="text-xs text-ink/60 font-medium">Ringkasan pendapatan kotor, pengeluaran operasional, dan profit bersih.</p>
      </div>

      {loading ? (
        <p className="text-center py-10 text-xs text-ink/40 font-medium animate-pulse font-mono">Menghitung keuangan...</p>
      ) : (
        <div className="space-y-4">
          {/* Card 1: Pendapatan Kotor */}
          <div className="p-5 bg-white border border-ink/10 rounded-2xl relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-24 h-24 bg-coral/5 rounded-full blur-2xl"></div>
            <p className="text-[10px] text-coral font-bold uppercase tracking-wider mb-1">Total Pendapatan Kotor</p>
            <p className="text-2xl font-display font-bold text-ink">Rp {grossRevenue.toLocaleString('id-ID')}</p>
            <p className="text-[10px] text-ink/40 mt-2">Akumulasi dari total {recentOrdersCount} transaksi cucian.</p>
          </div>

          {/* Card 2: Total Pengeluaran */}
          <div className="p-5 bg-white border border-ink/10 rounded-2xl relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-24 h-24 bg-ink/5 rounded-full blur-2xl"></div>
            <p className="text-[10px] text-ink/60 font-bold uppercase tracking-wider mb-1">Total Pengeluaran (Expenses)</p>
            <p className="text-2xl font-display font-bold text-ink">Rp {totalExpenses.toLocaleString('id-ID')}</p>
            <p className="text-[10px] text-ink/40 mt-2">Mencakup bahan baku sabun, listrik, air, dan gaji kurir.</p>
          </div>

          {/* Card 3: Profit Bersih */}
          <div className="p-5 bg-white border border-coral/25 rounded-2xl relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-24 h-24 bg-coral/5 rounded-full blur-2xl"></div>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1 text-coral">
              Profit Bersih (Net Profit)
            </p>
            <p className="text-2xl font-display font-bold text-coral">
              Rp {netProfit.toLocaleString('id-ID')}
            </p>
            <div className="flex justify-between items-center mt-2 text-[10px] text-ink/40 font-semibold border-t border-ink/5 pt-2">
              <span>Margin Keuntungan:</span>
              <span className="font-bold text-coral">
                {profitMargin.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Tips / Insights */}
          <div className="p-4 bg-white border border-ink/10 rounded-2xl space-y-2 shadow-sm flex items-start gap-2.5">
            <Info className="w-5 h-5 text-coral shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-[10px] font-bold text-ink uppercase tracking-wider">Insights Bisnis Hari Ini</h4>
              <p className="text-[11px] text-ink/75 leading-relaxed">
                {netProfit > 0 
                  ? 'Arus kas bisnis Anda sehat. Pertahankan profit margin di atas 30% dengan memantau pengeluaran operasional secara ketat.' 
                  : 'Peringatan: Pengeluaran melebihi pendapatan kotor. Lakukan audit pengeluaran bahan baku atau pertimbangkan penyesuaian tarif layanan laundry.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
