import React, { useState } from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  PieChart as PieIcon,
  BarChart2,
  Calendar,
} from 'lucide-react';
import { Transaction, Category, Wallet } from '../types/finance';
import { formatRupiah, getTodayDateString, formatShortDateIndonesian } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';

interface AnalyticsViewProps {
  transactions: Transaction[];
  categories: Category[];
  wallets: Wallet[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  transactions,
  categories,
}) => {
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | 'all'>('7days');
  const categoryMap = new Map<string, Category>(categories.map((c) => [c.id, c]));

  // Filter transactions based on selected range
  const today = getTodayDateString();
  const d = new Date();

  const filteredTransactions = transactions.filter((tx) => {
    if (timeRange === 'all') return true;
    const txDate = new Date(tx.date);
    const daysAgo = (Date.now() - txDate.getTime()) / (1000 * 3600 * 24);
    if (timeRange === '7days') return daysAgo <= 7;
    if (timeRange === '30days') return daysAgo <= 30;
    return true;
  });

  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = totalIncome - totalExpense;

  // Breakdown expenses by category
  const expenseByCategory: Record<string, number> = {};
  filteredTransactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      expenseByCategory[t.categoryId] = (expenseByCategory[t.categoryId] || 0) + t.amount;
    });

  const sortedCategories = Object.entries(expenseByCategory)
    .map(([catId, amount]) => ({
      category: categoryMap.get(catId) || {
        id: catId,
        name: 'Lainnya',
        iconName: 'Package',
        color: '#64748b',
        type: 'expense' as const,
      },
      amount,
      percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  // Daily Trend: Past 7 days data points
  const last7Days: { dateStr: string; label: string; expense: number; income: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const cur = new Date(d);
    cur.setDate(cur.getDate() - i);
    const yr = cur.getFullYear();
    const mo = String(cur.getMonth() + 1).padStart(2, '0');
    const dy = String(cur.getDate()).padStart(2, '0');
    const dateStr = `${yr}-${mo}-${dy}`;

    const dayDayTxs = transactions.filter((t) => t.date === dateStr);
    const exp = dayDayTxs
      .filter((t) => t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0);
    const inc = dayDayTxs
      .filter((t) => t.type === 'income')
      .reduce((s, t) => s + t.amount, 0);

    const dayName = cur.toLocaleDateString('id-ID', { weekday: 'short' });
    last7Days.push({
      dateStr,
      label: `${dayName} (${cur.getDate()})`,
      expense: exp,
      income: inc,
    });
  }

  const maxDailyExpense = Math.max(...last7Days.map((d) => d.expense), 50000);
  const activeDaysCount = new Set(filteredTransactions.map((t) => t.date)).size || 1;
  const avgDailyExpense = Math.round(totalExpense / activeDaysCount);

  // Highest single expense
  const highestExpenseTx = [...filteredTransactions]
    .filter((t) => t.type === 'expense')
    .sort((a, b) => b.amount - a.amount)[0];

  return (
    <div className="space-y-6">
      {/* Top Range Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-emerald-600" />
            <span>Laporan & Analisis Pengeluaran Harian</span>
          </h2>
          <p className="text-xs text-stone-500">
            Pahami pola pengeluaran untuk mengelola keuangan lebih bijak
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg text-xs font-medium self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setTimeRange('7days')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              timeRange === '7days'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            7 Hari Terakhir
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('30days')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              timeRange === '30days'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            30 Hari Terakhir
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('all')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              timeRange === 'all'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Semua Data
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Rata-rata Pengeluaran Harian</span>
          <div className="text-xl font-bold font-mono text-stone-900 mt-1">
            {formatRupiah(avgDailyExpense)}
          </div>
          <span className="text-[11px] text-stone-600">Dihitung dari hari aktif belanja</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Pengeluaran Terbesar</span>
          <div className="text-xl font-bold font-mono text-rose-600 mt-1">
            {highestExpenseTx ? formatRupiah(highestExpenseTx.amount) : 'Rp 0'}
          </div>
          <span className="text-[11px] text-stone-600 truncate block">
            {highestExpenseTx?.note || 'Belum ada transaksi'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Sisa Tabungan (Net Cashflow)</span>
          <div
            className={`text-xl font-bold font-mono mt-1 ${
              netSavings >= 0 ? 'text-emerald-700' : 'text-rose-600'
            }`}
          >
            {formatRupiah(netSavings)}
          </div>
          <span className="text-[11px] text-stone-600">
            {netSavings >= 0 ? 'Surplus / aman terkendali' : 'Defisit / pengeluaran melebihi pemasukan'}
          </span>
        </div>
      </div>

      {/* Chart: 7 Days Daily Spending Graph */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Grafik Pengeluaran 7 Hari Terakhir
            </h3>
            <p className="text-xs text-stone-500">
              Perbandingan pengeluaran harian sepanjang minggu
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-stone-600">
              <span className="w-2.5 h-2.5 rounded-xs bg-rose-500 inline-block" />
              <span>Pengeluaran</span>
            </div>
          </div>
        </div>

        {/* Bar chart representation */}
        <div className="pt-4 pb-2">
          <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 border-b border-stone-200 px-2">
            {last7Days.map((day) => {
              const heightPercent = Math.max(
                Math.round((day.expense / maxDailyExpense) * 100),
                day.expense > 0 ? 8 : 2
              );
              const isToday = day.dateStr === today;

              return (
                <div
                  key={day.dateStr}
                  className="flex-1 flex flex-col items-center justify-end h-full group relative"
                >
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-stone-900 text-white text-[11px] font-mono py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10 shadow-md">
                    {formatRupiah(day.expense)}
                  </div>

                  {/* Bar */}
                  <div
                    className={`w-full max-w-[36px] rounded-t-md transition-all duration-300 ${
                      day.expense > 0
                        ? isToday
                          ? 'bg-rose-600'
                          : 'bg-rose-400 group-hover:bg-rose-500'
                        : 'bg-stone-100'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* Labels under bars */}
          <div className="flex items-center justify-between gap-2 sm:gap-4 px-2 pt-2">
            {last7Days.map((day) => {
              const isToday = day.dateStr === today;
              return (
                <div
                  key={day.dateStr}
                  className="flex-1 text-center text-[10px] sm:text-xs truncate font-medium text-stone-600"
                >
                  <span className={isToday ? 'text-emerald-700 font-bold' : ''}>
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <PieIcon className="w-3.5 h-3.5 text-stone-600" />
              <span>Rincian Pengeluaran per Kategori</span>
            </h3>
            <p className="text-xs text-stone-500">
              Kategori mana yang paling banyak menghabiskan anggaran Anda
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-rose-700">
            Total: {formatRupiah(totalExpense)}
          </span>
        </div>

        {sortedCategories.length === 0 ? (
          <div className="text-center py-8 text-xs text-stone-400">
            Belum ada data pengeluaran pada rentang waktu ini.
          </div>
        ) : (
          <div className="space-y-3.5">
            {sortedCategories.map(({ category, amount, percentage }) => (
              <div key={category.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: `${category.color}20`,
                        color: category.color,
                      }}
                    >
                      <CategoryIcon
                        name={category.iconName}
                        className="w-3.5 h-3.5"
                        color={category.color}
                      />
                    </div>
                    <span className="font-semibold text-stone-900">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-stone-500 text-[11px]">
                      {percentage.toFixed(1)}%
                    </span>
                    <span className="font-bold text-stone-900">
                      {formatRupiah(amount)}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: category.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
