import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { TrendingUp, Wallet, Calendar, Plus, Trash2, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { getSavings, saveSaving, deleteSaving } from '../lib/storage';
import { formatCurrency, formatDate } from '../lib/formatters';
import { startOfWeek, endOfWeek, subWeeks, format, startOfMonth, subMonths, startOfYear, subYears, isWithinInterval, isSameWeek } from 'date-fns';

const Dashboard = ({ onAddClick, onDelete }) => {
  const [savings, setSavings] = useState([]);
  const [filter, setFilter] = useState('weekly'); // weekly, monthly, yearly
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  useEffect(() => {
    setSavings(getSavings());
  }, []);

  const totalIncome = savings
    .filter(s => !s.type || s.type === 'income')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);
  
  const totalExpense = savings
    .filter(s => s.type === 'expense')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);
  
  const balance = totalIncome - totalExpense;

  // Weekly metrics for summary cards
  const weeklyIncome = savings
    .filter(s => (!s.type || s.type === 'income') && isSameWeek(new Date(s.date), new Date()))
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const weeklyExpense = savings
    .filter(s => s.type === 'expense' && isSameWeek(new Date(s.date), new Date()))
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const handleDelete = (id) => {
    if (window.confirm('Hapus data ini?')) {
      deleteSaving(id);
      setSavings(getSavings());
      if (onDelete) onDelete();
    }
  };

  const getChartData = () => {
    if (filter === 'weekly') {
      const last7Days = [...Array(7)].map((_, i) => {
        const date = subWeeks(new Date(), 0);
        // This is a simplification, let's just show daily for the current week
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const dayName = format(d, 'EEE');
        const daySavings = savings
          .filter(s => new Date(s.date).toDateString() === d.toDateString())
          .reduce((acc, curr) => acc + Number(curr.amount), 0);
        return { name: dayName, amount: daySavings };
      });
      return last7Days;
    }

    if (filter === 'monthly') {
      // Last 6 months
      return [...Array(6)].map((_, i) => {
        const d = subMonths(new Date(), 5 - i);
        const monthName = format(d, 'MMM');
        const monthSavings = savings
          .filter(s => {
            const sd = new Date(s.date);
            return sd.getMonth() === d.getMonth() && sd.getFullYear() === d.getFullYear();
          })
          .reduce((acc, curr) => acc + Number(curr.amount), 0);
        return { name: monthName, amount: monthSavings };
      });
    }

    if (filter === 'yearly') {
      // Last 3 years
      return [...Array(3)].map((_, i) => {
        const d = subYears(new Date(), 2 - i);
        const yearName = format(d, 'yyyy');
        const yearSavings = savings
          .filter(s => new Date(s.date).getFullYear() === d.getFullYear())
          .reduce((acc, curr) => acc + Number(curr.amount), 0);
        return { name: yearName, amount: yearSavings };
      });
    }
  };

  const chartData = getChartData();

  return (
    <div className="dashboard-container">
      {/* Main Balance Card */}
      <div className="stat-card balance glass">
        <div className="stat-info">
          <div className="label-with-toggle">
            <span className="stat-label">Tabungan Saat Ini</span>
            <button 
              className="privacy-toggle" 
              onClick={() => setIsBalanceHidden(!isBalanceHidden)}
            >
              {isBalanceHidden ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <h2 className="stat-value">
            {isBalanceHidden ? '••••••••' : formatCurrency(balance)}
          </h2>
        </div>
        <div className="stat-icon bg-primary shadow-glow">
          <Wallet size={24} color="white" />
        </div>
      </div>

      {/* Grid for Income & Expense (Weekly Focus) */}
      <div className="stats-grid">
        <div className="mini-stat-card glass">
          <span className="mini-label">Masuk (Minggu Ini)</span>
          <span className="mini-value text-income">+{formatCurrency(weeklyIncome)}</span>
        </div>
        <div className="mini-stat-card glass">
          <span className="mini-label">Keluar (Minggu Ini)</span>
          <span className="mini-value text-expense">-{formatCurrency(weeklyExpense)}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs glass">
        <button 
          className={`filter-tab ${filter === 'weekly' ? 'active' : ''}`} 
          onClick={() => setFilter('weekly')}
        >Mingguan</button>
        <button 
          className={`filter-tab ${filter === 'monthly' ? 'active' : ''}`} 
          onClick={() => setFilter('monthly')}
        >Bulanan</button>
        <button 
          className={`filter-tab ${filter === 'yearly' ? 'active' : ''}`} 
          onClick={() => setFilter('yearly')}
        >Tahunan</button>
      </div>

      {/* Chart Section */}
      <div className="chart-card glass">
        <div className="chart-header">
          <h3>Grafik Tabungan</h3>
          <TrendingUp size={20} className="text-secondary" />
        </div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={250}>
            {filter === 'monthly' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Line type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                   itemStyle={{ color: '#fff' }}
                   formatter={(value) => formatCurrency(value)}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#a855f7'} />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent History */}
      <div className="history-section">
        <div className="section-header">
          <h3>Riwayat Terakhir</h3>
          <button className="text-primary-link">Lihat Semua</button>
        </div>
        <div className="history-list">
          {savings.slice(-5).reverse().map((item) => (
            <div key={item.id} className="history-item glass">
              <div className={`history-icon ${item.type === 'expense' ? 'bg-red' : 'bg-blue'}`}>
                <Calendar size={18} />
              </div>
              <div className="history-meta">
                <span className="history-date">{formatDate(item.date)}</span>
                <span className="history-note">{item.note || (item.type === 'expense' ? 'Pengeluaran' : 'Tabungan')}</span>
              </div>
              <span className={`history-amount ${item.type === 'expense' ? 'text-expense' : 'text-income'}`}>
                {item.type === 'expense' ? '-' : '+'}{formatCurrency(item.amount)}
              </span>
              <button 
                className="delete-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id);
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {savings.length === 0 && <p className="empty-msg">Belum ada catatan.</p>}
        </div>
      </div>

      {/* FAB */}
      <button className="fab bg-primary shadow-lg" onClick={onAddClick}>
        <Plus size={28} color="white" />
      </button>
    </div>
  );
};

export default Dashboard;
