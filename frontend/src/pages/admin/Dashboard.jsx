import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, DollarSign, RefreshCw, BarChart2, Package, Clock, Eye 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import API from '../../services/api';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/dashboard/stats');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
      toast.error('Failed to retrieve dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-restaurant-gold"></div>
      </div>
    );
  }

  if (!stats) return null;

  const cardItems = [
    { title: 'Pending Orders', value: stats.pendingOrders, icon: Clock, color: 'text-amber-500 bg-amber-500/10' },
    { title: 'Orders Today/Total', value: stats.totalOrders, icon: ShoppingBag, color: 'text-sky-500 bg-sky-500/10' },
    { title: 'Revenue Today', value: `₹${stats.revenueToday.toFixed(2)}`, icon: DollarSign, color: 'text-emerald-500 bg-emerald-500/10' },
    { title: 'Total Revenue', value: `₹${stats.totalRevenue.toFixed(2)}`, icon: BarChart2, color: 'text-restaurant-gold bg-restaurant-gold/10' },
    { title: 'Total Menu Items', value: stats.totalMenuItems, icon: Package, color: 'text-purple-500 bg-purple-500/10' },
  ];

  // Format weekly sales date labels (YYYY-MM-DD -> Short date like '07 Jun')
  const formattedGraphData = stats.weeklySales.map(day => {
    const d = new Date(day.date);
    return {
      name: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      Revenue: parseFloat(day.revenue),
      Orders: day.orders
    };
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Received': return 'bg-blue-500/15 text-blue-400 border border-blue-500/30';
      case 'Preparing': return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
      case 'Ready': return 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30';
      case 'Served': return 'bg-green-500/15 text-green-400 border border-green-500/30';
      default: return 'bg-slate-500/15 text-slate-400';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Upper header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Live Restaurant Overview</h2>
          <p className="text-xs text-slate-500">Realtime activity tracking and sales snapshots.</p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center space-x-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl border border-slate-700/60 transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh Stats</span>
        </button>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {cardItems.map((card, idx) => (
          <div key={idx} className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">{card.title}</span>
              <p className="text-lg font-display font-extrabold text-white">{card.value}</p>
            </div>
            <div className={`p-3 rounded-xl ${card.color} shrink-0`}>
              <card.icon className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Sales Chart Section */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80 space-y-4">
        <div>
          <h3 className="font-display font-bold text-sm text-slate-200 uppercase tracking-wider">Weekly Revenue Stream</h3>
          <p className="text-[10px] text-slate-500">Daily ticket invoice totals compiled over the last 7 days.</p>
        </div>
        
        <div className="h-80 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedGraphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c5a059" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#c5a059" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '12px', color: '#f8fafc' }}
                labelClassName="font-bold font-display"
              />
              <Area type="monotone" dataKey="Revenue" stroke="#c5a059" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-display font-bold text-sm text-slate-200 uppercase tracking-wider">Recent Orders</h3>
            <p className="text-[10px] text-slate-500 font-medium">Logs of the latest 5 incoming food tickets.</p>
          </div>
          <button
            onClick={() => navigate('/admin/orders')}
            className="text-xs font-semibold text-restaurant-gold hover:underline"
          >
            Manage All Orders
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider font-bold">
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Last Updated</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-slate-300">
              {stats.recentOrders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-slate-900/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white"># {order.id}</td>
                  <td className="py-3.5 px-4 font-semibold">{order.customer_name}</td>
                  <td className="py-3.5 px-4 text-slate-500 font-medium">
                    {new Date(order.updated_at || order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })},{' '}
                    {new Date(order.updated_at || order.created_at).toLocaleDateString([], { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-restaurant-gold">
                    ₹{parseFloat(order.total_amount).toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => navigate('/admin/orders')}
                      className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
