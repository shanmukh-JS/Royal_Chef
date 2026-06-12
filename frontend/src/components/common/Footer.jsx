import React from 'react';
import { useLocation } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const location = useLocation();

  // Suppress rendering if inside admin sections
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-restaurant-dark text-white/80 py-12 mt-20 border-t border-restaurant-gold/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand Philosophy */}
          <div>
            <h3 className="text-restaurant-gold font-display font-bold text-lg tracking-wider mb-4">ROYAL CHEF</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Fine dining, redefined. We create sensory culinary experiences with traditional spices, fresh organic produce, and modern cooking methodologies.
            </p>
          </div>

          {/* Timings */}
          <div>
            <h3 className="text-restaurant-gold font-display font-semibold text-lg tracking-wide mb-4">Service Hours</h3>
            <ul className="text-sm text-white/50 space-y-2">
              <li>Weekday Lunch: 11:30 AM – 3:00 PM</li>
              <li>Weekday Dinner: 5:00 PM – 10:30 PM</li>
              <li>Weekends (All-Day): 11:30 AM – 11:30 PM</li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-3">
            <h3 className="text-restaurant-gold font-display font-semibold text-lg tracking-wide mb-4">Find Us</h3>
            <div className="flex items-center space-x-3 text-sm text-white/50">
              <MapPin className="h-4 w-4 text-restaurant-gold shrink-0" />
              <span>123 Gourmet Lane, Culinary Heights, NY 10001</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-white/50">
              <Phone className="h-4 w-4 text-restaurant-gold shrink-0" />
              <span>+1 (212) 555-0199</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-white/50">
              <Mail className="h-4 w-4 text-restaurant-gold shrink-0" />
              <span>reservations@royalchef.com</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/5 mt-10 pt-6 text-center text-xs text-white/30">
          &copy; {new Date().getFullYear()} Royal Chef Hospitality. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
