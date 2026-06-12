import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, SlidersHorizontal, Eye } from 'lucide-react';
import API from '../../services/api';
import { CartContext } from '../../context/CartContext';
import toast from 'react-hot-toast';

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState(['All', 'Starters', 'Main Course', 'Biryani', 'Rice', 'Desserts', 'Beverages']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        // Build query string
        let url = '/menu';
        const params = [];
        if (selectedCategory !== 'All') {
          params.push(`category=${encodeURIComponent(selectedCategory)}`);
        }
        if (searchQuery) {
          params.push(`search=${encodeURIComponent(searchQuery)}`);
        }
        if (params.length > 0) {
          url += `?${params.join('&')}`;
        }

        const response = await API.get(url);
        if (response.data.success) {
          setMenuItems(response.data.menu);
        }
      } catch (error) {
        console.error('Error loading menu:', error);
        toast.error('Failed to load menu items. Please refresh.');
      } finally {
        setLoading(false);
      }
    };

    // Simple debounce/delay trigger for search queries
    const delayDebounceFn = setTimeout(() => {
      fetchMenu();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [selectedCategory, searchQuery]);

  const handleAddToCart = (item, e) => {
    e.preventDefault(); // Prevent navigating to details
    if (!item.available) return;
    addToCart(item);
    toast.success(`Added ${item.name} to cart!`, {
      style: {
        border: '1px solid #c5a059',
        padding: '16px',
        color: '#111518',
        backgroundColor: '#faf8f5',
        fontFamily: 'Outfit, sans-serif',
        fontSize: '14px',
        fontWeight: '600'
      },
      iconTheme: {
        primary: '#b93c25',
        secondary: '#faf8f5'
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-restaurant-gold/10 pb-6">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-restaurant-dark">
            Our Culinary Collection
          </h1>
          <p className="text-xs text-restaurant-muted mt-1">
            Browse through our gourmet sections cooked fresh to order.
          </p>
        </div>
        
        {/* Search Input */}
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-restaurant-muted" />
          <input
            type="text"
            placeholder="Search for dishes, starters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-restaurant-gold/20 bg-white text-sm text-restaurant-dark placeholder-restaurant-muted focus:outline-none focus:border-restaurant-gold focus:ring-1 focus:ring-restaurant-gold"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        <div className="flex space-x-2 min-w-max">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-restaurant-accent text-white shadow-md shadow-restaurant-accent/10'
                  : 'bg-white text-restaurant-dark/70 hover:bg-restaurant-cream border border-restaurant-gold/10 hover:border-restaurant-gold/45'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Cards Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-restaurant-gold"></div>
        </div>
      ) : menuItems.length === 0 ? (
        <div className="text-center py-20 space-y-3">
          <p className="text-restaurant-muted font-medium">No dishes match your filters.</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className="text-xs font-bold uppercase tracking-wider text-restaurant-accent underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={`/menu/${item.id}`}
              className="bg-white rounded-2xl overflow-hidden border border-restaurant-gold/10 card-hover flex flex-col justify-between group"
            >
              <div>
                {/* Image & Price Tag */}
                <div className="h-48 overflow-hidden relative bg-restaurant-cream">
                  <img
                    src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Availability Overlay */}
                  {!item.available && (
                    <div className="absolute inset-0 bg-restaurant-dark/65 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md border border-red-500">
                        Sold Out
                      </span>
                    </div>
                  )}

                  <div className="absolute top-4 right-4 bg-restaurant-dark/80 backdrop-blur-sm text-restaurant-gold font-display font-bold text-xs px-3 py-1.5 rounded-full border border-restaurant-gold/20">
                    ₹{item.price.toFixed(2)}
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-2">
                  <span className="text-[9px] uppercase font-extrabold tracking-widest text-restaurant-gold">
                    {item.category}
                  </span>
                  <h3 className="font-display font-bold text-md text-restaurant-dark">
                    {item.name}
                  </h3>
                  <p className="text-xs text-restaurant-muted leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Add trigger */}
              <div className="p-6 pt-0 flex space-x-3">
                <div className="flex-1">
                  <button
                    disabled={!item.available}
                    onClick={(e) => handleAddToCart(item, e)}
                    className={`w-full flex items-center justify-center space-x-2 font-bold text-xs uppercase py-3.5 rounded-xl transition-all duration-200 ${
                      item.available
                        ? 'bg-restaurant-accent hover:bg-restaurant-accentHover text-white shadow-md shadow-restaurant-accent/15'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                    }`}
                  >
                    <ShoppingCart className="h-4 w-4 shrink-0" />
                    <span>Add to Cart</span>
                  </button>
                </div>
                <div className="bg-restaurant-cream hover:bg-restaurant-gold/10 p-3 rounded-xl border border-restaurant-gold/20 transition-all flex items-center justify-center">
                  <Eye className="h-4 w-4 text-restaurant-dark" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
