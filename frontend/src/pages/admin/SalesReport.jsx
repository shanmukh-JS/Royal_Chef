import React, { useEffect, useState } from 'react';
import { BarChart3, Download, RefreshCw, TrendingUp, DollarSign, ShoppingBag, FileSpreadsheet } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import API from '../../services/api';
import toast from 'react-hot-toast';

export default function SalesReport() {
  const [activeTab, setActiveTab] = useState('weekly'); // daily | weekly | monthly
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/admin/reports/${activeTab}`);
      if (res.data.success) {
        setReportData(res.data.report);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [activeTab]);

  // Aggregate stats
  const totalRevenue = reportData.reduce((sum, r) => sum + r.revenue, 0);
  const totalOrders = reportData.reduce((sum, r) => sum + r.orders, 0);
  const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;

  // Export report to CSV
  const handleExportCSV = () => {
    if (reportData.length === 0) {
      return toast.error('No data available to export');
    }

    const headers = ['Time Period', 'Orders Count', 'Revenue (₹)'];
    const rows = reportData.map(row => `"${row.label}",${row.orders},${row.revenue.toFixed(2)}`);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sales_report_${activeTab}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Report successfully exported to CSV file.');
  };

  // Export simulated PDF
  const handleExportPDF = () => {
    toast.success('Preparing report document formatting...');
    
    // Simple mock print layout opening window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Sales Report - Royal Chef</title>
          <style>
            body { font-family: 'Outfit', 'Inter', sans-serif; padding: 40px; color: #1e293b; }
            h1 { font-size: 24px; font-weight: bold; margin-bottom: 5px; color: #0f172a; }
            p { font-size: 12px; color: #64748b; margin-top: 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
            th { background-color: #f1f5f9; text-align: left; padding: 12px; font-weight: bold; border-bottom: 2px solid #e2e8f0; }
            td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
            .totals { margin-top: 30px; font-size: 14px; font-weight: bold; text-align: right; }
          </style>
        </head>
        <body>
          <h1>Royal Chef Sales Report</h1>
          <p>Reporting Period: ${activeTab.toUpperCase()} | Generated: ${new Date().toLocaleString()}</p>
          <hr />
          <div style="display: flex; gap: 30px; margin-top: 20px;">
            <div>Total Revenue: <strong>₹${totalRevenue.toFixed(2)}</strong></div>
            <div>Total Tickets: <strong>${totalOrders}</strong></div>
            <div>Average Ticket: <strong>₹${avgOrderValue.toFixed(2)}</strong></div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Period</th>
                <th>Orders Count</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              ${reportData.map(row => `
                <tr>
                  <td>${row.label}</td>
                  <td>${row.orders}</td>
                  <td>₹{row.revenue.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Financial Sales Reports</h2>
          <p className="text-xs text-slate-500">Aggregate statistics, average ticket sizes, and revenue metrics.</p>
        </div>

        {/* Buttons actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-2 text-xs font-semibold bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-300 px-4 py-2.5 rounded-xl transition-all"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Export CSV</span>
          </button>
          
          <button
            onClick={handleExportPDF}
            className="flex items-center space-x-2 text-xs font-semibold bg-restaurant-gold hover:bg-restaurant-gold/90 text-slate-950 px-4 py-2.5 rounded-xl font-bold uppercase transition-all"
          >
            <Download className="h-4 w-4 shrink-0" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Tabs selectors */}
      <div className="flex space-x-1 bg-slate-950 p-1 rounded-xl w-fit border border-slate-850">
        <button
          onClick={() => setActiveTab('daily')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
            activeTab === 'daily' ? 'bg-restaurant-gold text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Today Sales
        </button>
        <button
          onClick={() => setActiveTab('weekly')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
            activeTab === 'weekly' ? 'bg-restaurant-gold text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Weekly Sales
        </button>
        <button
          onClick={() => setActiveTab('monthly')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
            activeTab === 'monthly' ? 'bg-restaurant-gold text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Monthly Sales
        </button>
      </div>

      {/* Stats summaries */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-restaurant-gold"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Invoiced</span>
                <p className="text-xl font-display font-extrabold text-restaurant-gold">₹{totalRevenue.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-xl bg-restaurant-gold/10 text-restaurant-gold shrink-0">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Tickets</span>
                <p className="text-xl font-display font-extrabold text-white">{totalOrders} Orders</p>
              </div>
              <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 shrink-0">
                <ShoppingBag className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Average Order Size</span>
                <p className="text-xl font-display font-extrabold text-emerald-400">₹{avgOrderValue.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Graph Section */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80 space-y-4">
            <div>
              <h3 className="font-display font-bold text-sm text-slate-200 uppercase tracking-wider">Revenue & Tickets Chart</h3>
              <p className="text-[10px] text-slate-500 font-medium">Trends showing incoming revenue spikes relative to orders volume.</p>
            </div>

            <div className="h-80 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={reportData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorReportRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#b93c25" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#b93c25" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="label" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '12px', color: '#f8fafc' }}
                    labelClassName="font-bold font-display"
                  />
                  <Legend />
                  <Area name="Revenue (₹)" type="monotone" dataKey="revenue" stroke="#b93c25" strokeWidth={2.5} fillOpacity={1} fill="url(#colorReportRevenue)" />
                  <Area name="Orders Count" type="monotone" dataKey="orders" stroke="#c5a059" strokeWidth={1.5} fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
