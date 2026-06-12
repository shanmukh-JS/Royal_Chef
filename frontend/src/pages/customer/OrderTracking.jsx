import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Check, UtensilsCrossed, Sparkles, AlertCircle, ShoppingBag, User } from 'lucide-react';
import API from '../../services/api';
import toast from 'react-hot-toast';

export default function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const statusMilestones = ['Received', 'Preparing', 'Ready', 'Served'];

  const fetchOrderStatus = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const response = await API.get(`/orders/${id}`);
      if (response.data.success) {
        setOrder(response.data.order);
      }
    } catch (error) {
      console.error('Failed to poll order status:', error);
      if (!silent) {
        toast.error('Order tracking session could not be established.');
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchOrderStatus();

    // Poll the server every 5 seconds to check for live chef modifications
    const pollInterval = setInterval(() => {
      fetchOrderStatus(true);
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-restaurant-gold"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="bg-red-50 p-6 rounded-full w-20 h-20 mx-auto flex items-center justify-center text-red-500">
          <AlertCircle className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display text-lg font-bold text-restaurant-dark">Order Session Missing</h2>
          <p className="text-xs text-restaurant-muted leading-relaxed">
            The requested order ID # {id} is not present in our systems.
          </p>
        </div>
        <Link
          to="/menu"
          className="inline-flex bg-restaurant-accent hover:bg-restaurant-accentHover text-white font-bold text-xs uppercase px-6 py-3.5 rounded-xl shadow-md"
        >
          Return to Menu
        </Link>
      </div>
    );
  }

  const activeIndex = statusMilestones.indexOf(order.status);
  const progressPercentage = (activeIndex / (statusMilestones.length - 1)) * 100;

  // Visual text mapping for each status stage
  const getStatusDetail = (status) => {
    switch (status) {
      case 'Received':
        return 'The kitchen has accepted your order and is queuing ingredients.';
      case 'Preparing':
        return 'Our chefs are actively cooking and preparing your fresh plate.';
      case 'Ready':
        return 'Your food is cooked and plated! Server is picking it up.';
      case 'Served':
        return 'Delicious! Your food has been successfully served at your table.';
      default:
        return 'Please wait...';
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Header card */}
      <div className="bg-restaurant-dark text-white p-6 md:p-8 rounded-3xl border border-restaurant-gold/15 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(197,160,89,0.1),transparent_50%)]"></div>
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[9px] font-bold uppercase tracking-widest text-restaurant-gold bg-restaurant-gold/15 border border-restaurant-gold/30 px-2.5 py-1 rounded-md">
              Order # {order.id}
            </span>
            <h1 className="font-display text-xl md:text-2xl font-extrabold text-white mt-2">
              Status: <span className="text-restaurant-gold">{order.status}</span>
            </h1>
            <p className="text-xs text-white/50">{getStatusDetail(order.status)}</p>
            <p className="text-[10px] text-white/45 mt-1.5">
              Last updated: {new Date(order.updated_at || order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, {new Date(order.updated_at || order.created_at).toLocaleDateString([], { day: 'numeric', month: 'short' })}
            </p>
          </div>
          
          <div className="shrink-0 flex items-center space-x-2 text-xs font-bold bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl">
            <Clock className="h-4 w-4 text-restaurant-gold animate-spin-slow" />
            <span>Prep: 15-20 min</span>
          </div>
        </div>
      </div>

      {/* Progress Tracker Card */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-restaurant-gold/10 space-y-8">
        <h2 className="font-display text-md font-bold text-restaurant-dark flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-restaurant-gold" />
          <span>Preparation Progress</span>
        </h2>

        {/* Visual Progress Bar and Milestones */}
        <div className="relative px-2">
          {/* Background gray track */}
          <div className="absolute top-4 left-4 right-4 h-1.5 bg-slate-100 rounded-full -translate-y-1/2"></div>
          
          {/* Active colored track */}
          <div
            className="absolute top-4 left-4 h-1.5 bg-restaurant-gold rounded-full -translate-y-1/2 transition-all duration-1000 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>

          {/* Stepper Dots */}
          <div className="relative flex justify-between">
            {statusMilestones.map((milestone, idx) => {
              const isCompleted = idx < activeIndex;
              const isActive = idx === activeIndex;
              
              return (
                <div key={milestone} className="flex flex-col items-center space-y-2.5">
                  {/* Circle Pin */}
                  <div
                    className={`h-8 w-8 rounded-full border-4 flex items-center justify-center transition-all duration-300 relative z-10 ${
                      isCompleted
                        ? 'bg-restaurant-gold border-restaurant-gold text-white shadow-md'
                        : isActive
                        ? 'bg-white border-restaurant-accent text-restaurant-accent shadow-md shadow-restaurant-accent/10 scale-110'
                        : 'bg-white border-slate-200 text-slate-300'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-3 w-3 stroke-[3]" />
                    ) : (
                      <span className="text-[10px] font-extrabold">{idx + 1}</span>
                    )}
                  </div>
                  
                  {/* Label */}
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      isActive
                        ? 'text-restaurant-accent'
                        : isCompleted
                        ? 'text-restaurant-gold'
                        : 'text-slate-400'
                    }`}
                  >
                    {milestone}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary of items being tracked */}
      <div className="bg-white p-6 rounded-3xl border border-restaurant-gold/10 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Order Details */}
        <div className="space-y-4">
          <h3 className="font-display font-bold text-sm text-restaurant-dark border-b border-restaurant-gold/5 pb-2.5">
            Table Details
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center space-x-2 text-restaurant-muted">
              <User className="h-4 w-4 text-restaurant-gold" />
              <span>Customer Name: <strong className="text-restaurant-dark">{order.customer_name}</strong></span>
            </div>
            <div className="flex items-center space-x-2 text-restaurant-muted">
              <UtensilsCrossed className="h-4 w-4 text-restaurant-gold" />
              <span>Served at: <strong className="text-restaurant-dark">Table #{order.table_number}</strong></span>
            </div>
          </div>
        </div>

        {/* Ordered items listing */}
        <div className="space-y-4">
          <h3 className="font-display font-bold text-sm text-restaurant-dark border-b border-restaurant-gold/5 pb-2.5">
            Your Selection
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
            {order.items?.map(item => (
              <div key={item.id} className="flex justify-between items-center text-xs">
                <span className="text-restaurant-muted">
                  {item.name} <strong className="text-restaurant-dark ml-1">x {item.quantity}</strong>
                </span>
                <span className="font-semibold text-restaurant-dark">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            
            <div className="border-t border-restaurant-gold/10 pt-2 flex justify-between font-bold text-xs text-restaurant-dark">
              <span>Grand Total</span>
              <span className="text-restaurant-accent">₹{order.total_amount?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
