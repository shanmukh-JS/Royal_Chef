import React, { useEffect, useState } from 'react';
import {
  ShoppingBag,
  DollarSign,
  RefreshCw,
  BarChart2,
  Package,
  Clock
} from 'lucide-react';
import API from '../../services/api';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await API.get('/admin/dashboard/stats');

      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (error) {
      console.error(error);
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
      <div className="flex justify-center items-center h-screen text-white text-xl">
        Loading Dashboard...
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl">
        No dashboard data found
      </div>
    );
  }

  const cardItems = [
    {
      title: 'Pending Orders',
      value: stats.pendingOrders || 0,
      icon: Clock
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders || 0,
      icon: ShoppingBag
    },
    {
      title: 'Revenue Today',
      value: `₹${Number(stats.revenueToday || 0).toFixed(2)}`,
      icon: DollarSign
    },
    {
      title: 'Total Revenue',
      value: `₹${Number(stats.totalRevenue || 0).toFixed(2)}`,
      icon: BarChart2
    },
    {
      title: 'Menu Items',
      value: stats.totalMenuItems || 0,
      icon: Package
    }
  ];

  return (
    <div className="p-6 text-white min-h-screen bg-slate-900">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Operational Dashboard
        </h1>

        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg flex items-center gap-2 transition"
        >
          <RefreshCw size={16} />
          Refresh Stats
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
        {cardItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="bg-slate-800 rounded-xl p-5 shadow-lg"
            >
              <Icon size={28} className="mb-3 text-yellow-400" />

              <h3 className="text-sm text-gray-400">
                {item.title}
              </h3>

              <p className="text-3xl font-bold mt-2">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">
          Recent Orders
        </h2>

        {(stats.recentOrders || []).length === 0 ? (
          <p className="text-gray-400">
            No orders found
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="py-3">ID</th>
                  <th className="py-3">Customer</th>
                  <th className="py-3">Table</th>
                  <th className="py-3">Amount</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-slate-700"
                  >
                    <td className="py-3">{order.id}</td>
                    <td className="py-3">{order.customer_name}</td>
                    <td className="py-3">{order.table_number}</td>
                    <td className="py-3">
                      ₹{Number(order.total_amount).toFixed(2)}
                    </td>
                    <td className="py-3">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}