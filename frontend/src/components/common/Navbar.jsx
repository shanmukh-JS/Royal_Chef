import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Utensils } from 'lucide-react';
import { CartContext } from '../../context/CartContext';

export default function Navbar() {
  const { cartCount } = useContext(CartContext);
  const location = useLocation();

  // Suppress rendering if inside admin sections
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-restaurant-gold/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-restaurant-gold/10 p-2 rounded-xl group-hover:bg-restaurant-gold/20 transition-all duration-300">
              <Utensils className="h-5 w-5 text-restaurant-gold" />
            </div>
            <span className="font-display font-extrabold text-lg tracking-wider text-restaurant-dark">
              ROYAL <span className="text-restaurant-gold">CHEF</span>
            </span>
          </Link>

          {/* Actions */}
          <div className="flex items-center space-x-5">
            <Link 
              to="/menu" 
              className="text-sm font-semibold text-restaurant-dark/80 hover:text-restaurant-gold transition-colors duration-200"
            >
              Explore Menu
            </Link>
            
            {/* Shopping Bag Badge */}
            <Link to="/cart" className="relative p-2 text-restaurant-dark/80 hover:text-restaurant-gold transition-colors duration-200 group">
              <ShoppingBag className="h-5 w-5 stroke-[2]" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-restaurant-accent text-[9px] font-extrabold text-white ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
