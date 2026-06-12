import React, { useEffect, useState } from 'react';
import { ShoppingBag, Eye, X, Phone, User, Calendar, UtensilsCrossed, RefreshCw } from 'lucide-react';
import API from '../../services/api';
import toast from 'react-hot-toast';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Details Modal configs
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchOrders = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await API.get('/orders');
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (error) {
      console.error(error);
      if (!silent) toast.error('Failed to load orders list');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Auto-refresh order dashboard every 10 seconds to catch table submissions
    const interval = setInterval(() => {
      fetchOrders(true);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await API.put(`/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        toast.success(`Order #${orderId} status updated to ${newStatus}`);
        
        // Update local list state
        setOrders(prev =>
          prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
        );
        
        // Update modal state if open
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(prev => ({ ...prev, status: newStatus }));
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status');
    }
  };

  const openDetailsModal = async (orderId) => {
    try {
      setIsModalOpen(true);
      setModalLoading(true);
      const res = await API.get(`/orders/${orderId}`);
      if (res.data.success) {
        setSelectedOrder(res.data.order);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load order details');
      setIsModalOpen(false);
    } finally {
      setModalLoading(false);
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'Received': return 'bg-blue-500/15 text-blue-400 border border-blue-500/30';
      case 'Preparing': return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
      case 'Ready': return 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30';
      case 'Served': return 'bg-green-500/15 text-green-400 border border-green-500/30';
      default: return 'bg-slate-500/15 text-slate-400';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Customer Orders Dispatch</h2>
          <p className="text-xs text-slate-500">Track and dispatch incoming tables orders live.</p>
        </div>
        <button
          onClick={() => fetchOrders()}
          className="flex items-center space-x-2 text-xs font-semibold bg-slate-850 hover:bg-slate-800 text-slate-200 px-4 py-2.5 rounded-xl border border-slate-800 transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Main orders table */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-restaurant-gold"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-slate-500 text-sm">
          No orders have been submitted yet.
        </div>
      ) : (
        <div className="bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4 text-center">Table #</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4">Status Flow</th>
                  <th className="py-3.5 px-4">Last Updated</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-slate-350">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-900/30 transition-colors">
                    
                    {/* ID */}
                    <td className="py-4 px-4 font-bold text-white"># {o.id}</td>
                    
                    {/* Customer */}
                    <td className="py-4 px-4">
                      <span className="font-semibold block text-slate-200">{o.customer_name}</span>
                      <span className="text-[10px] text-slate-500">{o.mobile_number}</span>
                    </td>
                    
                    {/* Table */}
                    <td className="py-4 px-4 text-center">
                      <span className="bg-restaurant-gold/10 text-restaurant-gold px-2.5 py-1 rounded font-bold border border-restaurant-gold/15">
                        Table {o.table_number}
                      </span>
                    </td>
                    
                    {/* Amount */}
                    <td className="py-4 px-4 text-right font-extrabold text-white">₹{parseFloat(o.total_amount).toFixed(2)}</td>
                    
                    {/* Status selection */}
                    <td className="py-4 px-4">
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        className={`text-[10px] font-extrabold px-3 py-1.5 rounded-full outline-none cursor-pointer border ${getStatusBgColor(o.status)}`}
                      >
                        <option value="Received" className="bg-slate-900 text-slate-300">Received</option>
                        <option value="Preparing" className="bg-slate-900 text-slate-300">Preparing</option>
                        <option value="Ready" className="bg-slate-900 text-slate-300">Ready</option>
                        <option value="Served" className="bg-slate-900 text-slate-300">Served</option>
                      </select>
                    </td>
                    
                    {/* Timestamp */}
                    <td className="py-4 px-4 text-slate-500">
                      <span className="block text-slate-350 font-semibold">
                        {new Date(o.updated_at || o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {new Date(o.updated_at || o.created_at).toLocaleDateString([], { day: 'numeric', month: 'short' })}
                      </span>
                    </td>
                    
                    {/* Action */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => openDetailsModal(o.id)}
                        className="px-3 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors flex items-center space-x-1.5 ml-auto"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Details</span>
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 max-w-lg w-full rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => { setIsModalOpen(false); setSelectedOrder(null); }}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {modalLoading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-restaurant-gold"></div>
              </div>
            ) : selectedOrder ? (
              <div className="space-y-6">
                
                {/* Header */}
                <div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${getStatusBgColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                  <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider mt-2.5">
                    Order Ticket # {selectedOrder.id}
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    Placed: {new Date(selectedOrder.created_at).toLocaleString()} | Updated: {new Date(selectedOrder.updated_at || selectedOrder.created_at).toLocaleString()}
                  </p>
                </div>

                {/* Info grids */}
                <div className="grid grid-cols-2 gap-4 text-xs bg-slate-950 p-4 rounded-xl border border-slate-850">
                  <div className="space-y-2">
                    <p className="text-slate-500 uppercase tracking-wider font-bold text-[9px]">Client Info</p>
                    <p className="font-semibold text-slate-200 flex items-center space-x-1.5">
                      <User className="h-3.5 w-3.5 text-restaurant-gold" />
                      <span>{selectedOrder.customer_name}</span>
                    </p>
                    <p className="text-slate-400 flex items-center space-x-1.5">
                      <Phone className="h-3.5 w-3.5 text-slate-600" />
                      <span>{selectedOrder.mobile_number}</span>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-slate-500 uppercase tracking-wider font-bold text-[9px]">Location</p>
                    <p className="font-semibold text-restaurant-gold flex items-center space-x-1.5">
                      <UtensilsCrossed className="h-3.5 w-3.5" />
                      <span>Table #{selectedOrder.table_number}</span>
                    </p>
                  </div>
                </div>

                {/* Items loop */}
                <div className="space-y-3">
                  <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Dishes List</h4>
                  
                  <div className="divide-y divide-slate-800/60 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2.5 text-xs">
                        <div className="min-w-0 flex-1 pr-3">
                          <p className="font-bold text-slate-200 truncate">{item.name}</p>
                          <p className="text-[10px] text-slate-500">Qty: {item.quantity} x ₹{item.price.toFixed(2)}</p>
                        </div>
                        <span className="font-semibold text-slate-100">₹{item.subtotal.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Summary amount */}
                  <div className="border-t border-slate-800 pt-4 flex justify-between font-bold text-sm text-white bg-slate-950 p-4 rounded-xl">
                    <span className="uppercase tracking-wider text-xs text-slate-400">Total Billed</span>
                    <span className="text-restaurant-gold font-display">₹{selectedOrder.total_amount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Direct Action Dropdown inside Modal */}
                <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Modify status:</label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                    className={`text-[10px] font-extrabold px-3 py-1.5 rounded-full outline-none cursor-pointer border ${getStatusBgColor(selectedOrder.status)}`}
                  >
                    <option value="Received" className="bg-slate-900 text-slate-350">Received</option>
                    <option value="Preparing" className="bg-slate-900 text-slate-350">Preparing</option>
                    <option value="Ready" className="bg-slate-900 text-slate-350">Ready</option>
                    <option value="Served" className="bg-slate-900 text-slate-350">Served</option>
                  </select>
                </div>

              </div>
            ) : null}
          </div>
        </div>
      )}

    </div>
  );
}
