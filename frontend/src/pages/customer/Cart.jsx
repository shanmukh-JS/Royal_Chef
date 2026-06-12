import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { CartContext } from '../../context/CartContext';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal } = useContext(CartContext);

  const TAX_RATE = 0.08; // 8% State Tax
  const taxAmount = cartTotal * TAX_RATE;
  const grandTotal = cartTotal + taxAmount;

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6 animate-fade-in">
        <div className="bg-restaurant-gold/10 p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center text-restaurant-gold">
          <ShoppingBag className="h-10 w-10 stroke-[1.5]" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display text-xl font-bold text-restaurant-dark">Your Cart is Empty</h2>
          <p className="text-xs text-restaurant-muted max-w-xs mx-auto">
            You haven't added any dishes to your order yet. Take a look at our rich menu selections.
          </p>
        </div>
        <div>
          <Link
            to="/menu"
            className="inline-flex items-center space-x-2 bg-restaurant-accent hover:bg-restaurant-accentHover text-white font-bold text-xs uppercase px-6 py-3.5 rounded-xl shadow-md transition-colors"
          >
            <span>Browse Our Menu</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
      <div className="flex items-center justify-between border-b border-restaurant-gold/10 pb-4">
        <h1 className="font-display text-2xl font-extrabold text-restaurant-dark">
          Shopping Cart ({cart.reduce((sum, i) => sum + i.quantity, 0)})
        </h1>
        
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-red-500 hover:text-red-700 flex items-center space-x-1"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-2xl border border-restaurant-gold/10 flex items-center justify-between gap-4"
            >
              {/* Product Thumbnail */}
              <div className="h-20 w-20 rounded-xl overflow-hidden bg-restaurant-cream shrink-0">
                <img
                  src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Name & price info */}
              <div className="flex-1 min-w-0 space-y-1">
                <h3 className="font-display font-bold text-sm text-restaurant-dark truncate">{item.name}</h3>
                <p className="text-xs text-restaurant-accent font-semibold">₹{parseFloat(item.price).toFixed(2)}</p>
                
                {/* Mobile quantity controls */}
                <div className="flex items-center space-x-2 sm:hidden pt-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="h-6 w-6 flex items-center justify-center bg-restaurant-cream text-restaurant-dark font-bold text-xs rounded border border-restaurant-gold/15"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold text-restaurant-dark">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="h-6 w-6 flex items-center justify-center bg-restaurant-cream text-restaurant-dark font-bold text-xs rounded border border-restaurant-gold/15"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Desktop controls */}
              <div className="hidden sm:flex items-center space-x-3">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="h-8 w-8 flex items-center justify-center bg-restaurant-cream text-restaurant-dark font-bold text-sm rounded-lg border border-restaurant-gold/15 hover:bg-slate-100 transition-colors"
                >
                  -
                </button>
                <span className="text-sm font-bold w-4 text-center text-restaurant-dark">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="h-8 w-8 flex items-center justify-center bg-restaurant-cream text-restaurant-dark font-bold text-sm rounded-lg border border-restaurant-gold/15 hover:bg-slate-100 transition-colors"
                >
                  +
                </button>
              </div>

              {/* Subtotal & trash */}
              <div className="flex flex-col items-end space-y-2 shrink-0">
                <p className="font-display font-extrabold text-sm text-restaurant-dark">
                  ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Continue shopping links */}
          <div>
            <Link
              to="/menu"
              className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-restaurant-dark/70 hover:text-restaurant-gold transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Add More Dishes</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Checkout Summary Card */}
        <div className="bg-white p-6 rounded-3xl border border-restaurant-gold/10 space-y-6 shadow-sm">
          <h2 className="font-display text-lg font-bold text-restaurant-dark">Order Pricing</h2>
          
          <div className="space-y-3 text-xs border-b border-restaurant-gold/10 pb-4">
            <div className="flex items-center justify-between text-restaurant-muted">
              <span>Subtotal</span>
              <span className="font-semibold text-restaurant-dark">₹{cartTotal.toFixed(2)}</span>
            </div>
            
            <div className="flex items-center justify-between text-restaurant-muted">
              <span>GST & Services Tax (8%)</span>
              <span className="font-semibold text-restaurant-dark">₹{taxAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-restaurant-gold/10 pb-4">
            <span className="text-sm font-bold text-restaurant-dark">Grand Total</span>
            <span className="text-lg font-display font-extrabold text-restaurant-accent">₹{grandTotal.toFixed(2)}</span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full flex items-center justify-center space-x-2 bg-restaurant-accent hover:bg-restaurant-accentHover text-white font-bold text-xs uppercase py-4 rounded-xl shadow-lg shadow-restaurant-accent/20 hover:-translate-y-0.5 transition-all duration-200"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
