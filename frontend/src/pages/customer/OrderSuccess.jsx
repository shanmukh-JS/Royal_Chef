import React from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Check, Calendar, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get('orderId') || 'N/A';
  const total = parseFloat(searchParams.get('total') || '0').toFixed(2);
  const prepTime = '15 - 25 minutes'; // Default estimated kitchen preparation timeframe

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-8 animate-fade-in">
      
      {/* Animated Success Seal */}
      <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
        {/* Decorative pulsating rings */}
        <div className="absolute inset-0 bg-green-100 rounded-full scale-110 animate-ping opacity-60"></div>
        <div className="absolute inset-0 bg-green-200/80 rounded-full scale-105"></div>
        <div className="relative bg-green-500 text-white rounded-full p-6 shadow-lg shadow-green-500/20">
          <Check className="h-10 w-10 stroke-[2.5]" />
        </div>
      </div>

      {/* Confirmation text */}
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-extrabold text-restaurant-dark">Order Confirmed!</h1>
        <p className="text-xs text-restaurant-muted max-w-xs mx-auto">
          Your order has been transmitted directly to the kitchen. Our chefs are preparing your gourmet selection now.
        </p>
      </div>

      {/* Details Box */}
      <div className="bg-white p-6 rounded-3xl border border-restaurant-gold/10 text-left space-y-4">
        <div className="flex justify-between items-center text-xs pb-3 border-b border-restaurant-gold/5">
          <span className="text-restaurant-muted">Order Identifier</span>
          <span className="font-bold text-restaurant-dark"># {orderId}</span>
        </div>

        <div className="flex justify-between items-center text-xs pb-3 border-b border-restaurant-gold/5">
          <span className="text-restaurant-muted">Estimated Prep Time</span>
          <span className="font-bold text-restaurant-accent flex items-center space-x-1">
            <span>{prepTime}</span>
          </span>
        </div>

        <div className="flex justify-between items-center text-xs">
          <span className="text-restaurant-muted">Grand Total</span>
          <span className="font-display font-extrabold text-restaurant-dark text-sm">₹{total}</span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col space-y-3 pt-4">
        <button
          onClick={() => navigate(`/track/${orderId}`)}
          className="w-full flex items-center justify-center space-x-2 bg-restaurant-accent hover:bg-restaurant-accentHover text-white font-bold text-xs uppercase py-4 rounded-xl shadow-lg shadow-restaurant-accent/20 hover:-translate-y-0.5 transition-all duration-200"
        >
          <span>Track Live Prep Status</span>
          <ArrowRight className="h-4 w-4" />
        </button>

        <Link
          to="/menu"
          className="w-full inline-flex items-center justify-center bg-restaurant-cream hover:bg-restaurant-gold/10 text-restaurant-dark font-bold text-xs uppercase py-4 rounded-xl border border-restaurant-gold/30 transition-all"
        >
          <span>Return to Menu</span>
        </Link>
      </div>

      {/* Help message */}
      <div className="flex items-center justify-center space-x-1.5 text-[10px] text-restaurant-muted">
        <ShieldCheck className="h-3.5 w-3.5 text-restaurant-gold" />
        <span>Need adjustments? Speak to our staff and quote your Order ID.</span>
      </div>

    </div>
  );
}
