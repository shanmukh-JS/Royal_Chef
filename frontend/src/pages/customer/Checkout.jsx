import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Sparkles, CheckCircle } from 'lucide-react';
import { CartContext } from '../../context/CartContext';
import API from '../../services/api';
import toast from 'react-hot-toast';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useContext(CartContext);

  const [customerName, setCustomerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const TAX_RATE = 0.08;
  const taxAmount = cartTotal * TAX_RATE;
  const grandTotal = cartTotal + taxAmount;

  useEffect(() => {
    // Redirect if cart is empty and we haven't just placed an order successfully
    if (cart.length === 0 && !isSuccess) {
      navigate('/menu');
      return;
    }

    // Auto-fill table number if saved in localStorage
    const savedTable = localStorage.getItem('restaurant_table_number');
    if (savedTable) {
      setTableNumber(savedTable);
    }
  }, [cart, navigate, isSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!customerName.trim()) {
      return toast.error('Please enter your name');
    }
    if (!mobileNumber.trim() || !/^\d{10,15}$/.test(mobileNumber)) {
      return toast.error('Please enter a valid 10-15 digit mobile number');
    }
    const tableInt = parseInt(tableNumber, 10);
    if (isNaN(tableInt) || tableInt < 1 || tableInt > 100) {
      return toast.error('Please enter a valid table number between 1 and 100');
    }

    setIsSubmitting(true);

    try {
      // Prepare payload mapping
      const itemsPayload = cart.map(item => ({
        menu_item_id: item.id,
        quantity: item.quantity
      }));

      const res = await API.post('/orders', {
        customer_name: customerName,
        mobile_number: mobileNumber,
        table_number: tableNumber,
        items: itemsPayload
      });

      if (res.data.success) {
  toast.success('Order placed successfully!');

  const orderId = res.data.orderId;

  setIsSuccess(true);

  clearCart();

  navigate(`/track/${orderId}`);

} else {
  toast.error(res.data.message || 'Failed to place the order.');
}
    } catch (err) {
      console.error('Checkout failed:', err);
      toast.error(err.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
      <div>
        <Link
          to="/cart"
          className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-restaurant-dark/70 hover:text-restaurant-gold transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Cart</span>
        </Link>
      </div>

      <h1 className="font-display text-2xl font-extrabold text-restaurant-dark">Complete Your Order</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Left Column: Form details */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 bg-white p-6 md:p-8 rounded-3xl border border-restaurant-gold/10 space-y-6">
          <h2 className="font-display text-md font-bold text-restaurant-dark flex items-center space-x-2 border-b border-restaurant-gold/10 pb-4">
            <CheckCircle className="h-4 w-4 text-restaurant-gold" />
            <span>Table Service Details</span>
          </h2>

          <div className="space-y-4">
            {/* Customer Name */}
            <div className="space-y-1">
              <label htmlFor="customer_name" className="text-xs font-bold text-restaurant-dark uppercase tracking-wider">
                Your Name
              </label>
              <input
                type="text"
                id="customer_name"
                required
                placeholder="e.g., Jane Doe"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-restaurant-gold/20 bg-white text-xs text-restaurant-dark placeholder-restaurant-muted focus:outline-none focus:border-restaurant-gold focus:ring-1 focus:ring-restaurant-gold"
              />
            </div>

            {/* Mobile Number */}
            <div className="space-y-1">
              <label htmlFor="mobile_number" className="text-xs font-bold text-restaurant-dark uppercase tracking-wider">
                Mobile Number
              </label>
              <input
                type="tel"
                id="mobile_number"
                required
                placeholder="e.g., 9876543210"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-restaurant-gold/20 bg-white text-xs text-restaurant-dark placeholder-restaurant-muted focus:outline-none focus:border-restaurant-gold focus:ring-1 focus:ring-restaurant-gold"
              />
            </div>

            {/* Table Number */}
            <div className="space-y-1">
              <label htmlFor="table_number" className="text-xs font-bold text-restaurant-dark uppercase tracking-wider">
                Table Number
              </label>
              <input
                type="number"
                id="table_number"
                required
                min="1"
                max="100"
                placeholder="e.g., 12"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-restaurant-gold/20 bg-white text-xs text-restaurant-dark placeholder-restaurant-muted focus:outline-none focus:border-restaurant-gold focus:ring-1 focus:ring-restaurant-gold"
              />
            </div>
          </div>

          <div className="bg-restaurant-cream p-4 rounded-2xl border border-restaurant-gold/15 text-[11px] text-restaurant-muted leading-relaxed">
            <Sparkles className="h-4 w-4 text-restaurant-gold mb-1.5 shrink-0" />
            <span>
              <strong>Note on Payment</strong>: In order to streamline our dining service, orders are placed immediately and billed directly to your table. You will make the final payment at the counter once you are ready to conclude your meal.
            </span>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center space-x-2 bg-restaurant-accent hover:bg-restaurant-accentHover text-white font-bold text-xs uppercase py-4 rounded-xl shadow-lg shadow-restaurant-accent/20 hover:-translate-y-0.5 transition-all duration-200 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <span>{isSubmitting ? 'Submitting Order...' : 'Confirm and Place Order'}</span>
            </button>
          </div>
        </form>

        {/* Right Column: Mini summary */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-restaurant-gold/10 space-y-6">
          <h2 className="font-display text-md font-bold text-restaurant-dark border-b border-restaurant-gold/10 pb-4">
            Order Review
          </h2>

          <div className="max-h-60 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center text-xs">
                <div className="min-w-0 flex-1 pr-3">
                  <p className="font-bold text-restaurant-dark truncate">{item.name}</p>
                  <p className="text-[10px] text-restaurant-muted">
                    Qty: {item.quantity} x ₹{parseFloat(item.price).toFixed(2)}
                  </p>
                </div>
                <span className="font-semibold text-restaurant-dark">
                  ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-restaurant-gold/10 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-restaurant-muted">
              <span>Items Total</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-restaurant-muted">
              <span>GST & Services Tax (8%)</span>
              <span>₹{taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-restaurant-gold/10 pt-2 text-sm font-bold text-restaurant-dark">
              <span>Grand Total</span>
              <span className="text-restaurant-accent">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
