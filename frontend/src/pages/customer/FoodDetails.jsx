import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, CheckCircle, Info, Sparkles } from 'lucide-react';
import API from '../../services/api';
import { CartContext } from '../../context/CartContext';
import toast from 'react-hot-toast';

export default function FoodDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const { addToCart, updateQuantity, cart } = useContext(CartContext);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await API.get(`/menu/${id}`);
        if (response.data.success) {
          setItem(response.data.item);
        }
      } catch (error) {
        console.error('Failed to load item:', error);
        toast.error('Dish details could not be found.');
        navigate('/menu');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-restaurant-gold"></div>
      </div>
    );
  }

  if (!item) return null;

  // Dynamically yield mock ingredients list based on the item category/name
  const getIngredients = () => {
    if (item.category === 'Biryani') {
      return ['Long-grain Basmati Rice', 'Saffron spices infusion', 'Traditional Fried Onions', 'Mint and Coriander herbs', 'Yogurt marination blend'];
    }
    if (item.category === 'Starters') {
      return ['Spiced Tandoori marination', 'Grilled red bell peppers', 'Sliced red onions', 'Lemon zest dressing', 'Fresh mint chutney base'];
    }
    if (item.category === 'Desserts') {
      return ['Condensed milk reductions', 'Cardamom spice notes', 'Saffron strands', 'Chopped pistachio garnish', 'Organic cane syrup sugar'];
    }
    if (item.category === 'Beverages') {
      return ['Freshly picked limes/mangoes', 'Pure carbonated soda/yogurt', 'Crushed ice', 'Raw brown sugar', 'Mint leaves garnish'];
    }
    return ['Aromatic local spices', 'Fresh organic farm produce', 'Extra virgin olive oil', 'Clarified butter (Ghee) wash', 'Selected protein / cottage cheese'];
  };

  const handleAddToCart = () => {
    if (!item.available) return;
    
    // Add multiple quantities
    for (let i = 0; i < quantity; i++) {
      addToCart(item);
    }
    
    toast.success(`Added ${quantity}x ${item.name} to cart!`, {
      style: {
        border: '1px solid #c5a059',
        padding: '16px',
        color: '#111518',
        backgroundColor: '#faf8f5',
        fontFamily: 'Outfit, sans-serif',
        fontSize: '14px',
        fontWeight: '600'
      }
    });
    navigate('/menu');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
      {/* Back Button */}
      <div>
        <Link
          to="/menu"
          className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-restaurant-dark/70 hover:text-restaurant-gold transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Menu</span>
        </Link>
      </div>

      {/* Main Detail Card */}
      <div className="bg-white rounded-3xl overflow-hidden border border-restaurant-gold/10 grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
        
        {/* Left: Image */}
        <div className="relative rounded-2xl overflow-hidden bg-restaurant-cream h-72 md:h-full min-h-[300px]">
          <img
            src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          {!item.available && (
            <div className="absolute inset-0 bg-restaurant-dark/65 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-red-600 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg border border-red-500">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-restaurant-gold px-2.5 py-1 bg-restaurant-gold/10 rounded-md">
                {item.category}
              </span>
              
              <div className="flex items-center space-x-1 text-[11px] font-bold">
                {item.available ? (
                  <span className="text-green-600 flex items-center space-x-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-600 animate-ping"></span>
                    <span>Ready in 15 mins</span>
                  </span>
                ) : (
                  <span className="text-red-500">Currently unavailable</span>
                )}
              </div>
            </div>

            <h1 className="font-display text-2xl md:text-3xl font-extrabold text-restaurant-dark">
              {item.name}
            </h1>

            <p className="text-2xl font-display font-extrabold text-restaurant-accent">
              ₹{item.price.toFixed(2)}
            </p>

            <div className="border-t border-restaurant-gold/10 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-restaurant-dark mb-1">Description</h4>
              <p className="text-xs text-restaurant-muted leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Ingredients */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-restaurant-dark flex items-center space-x-1">
                <Sparkles className="h-3.5 w-3.5 text-restaurant-gold" />
                <span>Primary Ingredients</span>
              </h4>
              <ul className="grid grid-cols-2 gap-2">
                {getIngredients().map((ing, i) => (
                  <li key={i} className="text-[11px] text-restaurant-muted flex items-center space-x-2">
                    <span className="h-1 w-1 bg-restaurant-gold rounded-full shrink-0"></span>
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Add to Cart Actions */}
          <div className="border-t border-restaurant-gold/10 pt-6 space-y-4">
            {item.available && (
              <div className="flex items-center justify-between bg-restaurant-cream p-2 rounded-xl border border-restaurant-gold/10">
                <span className="text-xs font-bold uppercase tracking-wide px-3 text-restaurant-dark">Quantity</span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="h-8 w-8 flex items-center justify-center bg-white text-restaurant-dark font-bold rounded-lg border border-restaurant-gold/15 active:bg-slate-100"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold w-4 text-center text-restaurant-dark">{quantity}</span>
                  <button
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="h-8 w-8 flex items-center justify-center bg-white text-restaurant-dark font-bold rounded-lg border border-restaurant-gold/15 active:bg-slate-100"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <button
              disabled={!item.available}
              onClick={handleAddToCart}
              className={`w-full flex items-center justify-center space-x-2 font-bold text-xs uppercase py-4 rounded-xl transition-all duration-200 ${
                item.available
                  ? 'bg-restaurant-accent hover:bg-restaurant-accentHover text-white shadow-lg shadow-restaurant-accent/20 hover:-translate-y-0.5'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              }`}
            >
              <ShoppingBag className="h-4 w-4 shrink-0" />
              <span>Add {quantity > 1 ? `${quantity} Items` : 'to Cart'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
