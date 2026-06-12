import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, MapPin, Sparkles } from 'lucide-react';
import API from '../../services/api';

export default function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableNo, setTableNo] = useState(null);

  useEffect(() => {
    // Pre-fill table number if scanning QR code (?table=X)
    const table = searchParams.get('table');
    if (table) {
      localStorage.setItem('restaurant_table_number', table);
      setTableNo(table);
    } else {
      const savedTable = localStorage.getItem('restaurant_table_number');
      if (savedTable) {
        setTableNo(savedTable);
      }
    }

    const fetchFeatured = async () => {
      try {
        const response = await API.get('/menu');
        if (response.data.success) {
          // Select 3 popular dishes for the homepage (e.g., Tikka, Butter Chicken, Biryani)
          const items = response.data.menu;
          const selected = items.filter(item => [1, 6, 11].includes(item.id));
          setFeatured(selected.length > 0 ? selected : items.slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to load featured items:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, [searchParams]);

  return (
    <div className="animate-fade-in">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-restaurant-dark text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-restaurant-gold/20">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.15),transparent_45%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(185,60,37,0.1),transparent_40%)]"></div>
        
        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          {tableNo && (
            <div className="inline-flex items-center space-x-2 bg-restaurant-gold/10 border border-restaurant-gold/30 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-restaurant-gold uppercase">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>Dining at Table #{tableNo}</span>
            </div>
          )}
          
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight leading-none">
            Savor the Art of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-restaurant-gold via-restaurant-goldLight to-restaurant-gold">
              Exquisite Dining
            </span>
          </h1>
          
          <p className="max-w-xl mx-auto text-sm sm:text-base text-white/60 font-light leading-relaxed">
            Scan. Choose. Order. Skip the wait and enjoy fresh gourmet creations served straight to your table in minutes.
          </p>

          <div className="pt-4">
            <button
              onClick={() => navigate('/menu')}
              className="inline-flex items-center space-x-3 bg-restaurant-accent hover:bg-restaurant-accentHover text-white font-bold text-sm tracking-wider uppercase px-8 py-4 rounded-xl shadow-lg shadow-restaurant-accent/20 hover:-translate-y-0.5 transition-all duration-300"
            >
              <span>Explore Menu & Order</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Dishes Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-2 mb-12">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-restaurant-dark">
            Chef's Recommendations
          </h2>
          <p className="text-xs sm:text-sm text-restaurant-muted max-w-md mx-auto">
            Handpicked specialties crafted with local organic ingredients and authentic recipes.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-restaurant-gold"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden border border-restaurant-gold/10 card-hover flex flex-col justify-between"
              >
                <div>
                  <div className="h-52 overflow-hidden relative">
                    <img
                      src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-restaurant-dark/80 backdrop-blur-sm text-restaurant-gold font-display font-bold text-xs px-3 py-1.5 rounded-full border border-restaurant-gold/20">
                      ₹{item.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="p-6 space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-restaurant-gold">
                      {item.category}
                    </span>
                    <h3 className="font-display font-bold text-lg text-restaurant-dark">
                      {item.name}
                    </h3>
                    <p className="text-xs text-restaurant-muted leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
                
                <div className="p-6 pt-0">
                  <Link
                    to={`/menu/${item.id}`}
                    className="w-full inline-flex items-center justify-center space-x-2 bg-restaurant-cream hover:bg-restaurant-gold/10 text-restaurant-dark font-bold text-xs uppercase py-3 rounded-xl border border-restaurant-gold/30 transition-colors duration-200"
                  >
                    <span>View Ingredients</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Info & About Section */}
      <section className="bg-restaurant-cream py-16 border-y border-restaurant-gold/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex items-start space-x-4">
            <div className="bg-restaurant-gold/10 p-3 rounded-xl text-restaurant-gold shrink-0">
              <Clock className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-bold text-md text-restaurant-dark">Opening Hours</h4>
              <p className="text-xs text-restaurant-muted leading-relaxed">
                Open every day: 11:30 AM – 11:00 PM <br />
                Kitchen closes at 10:30 PM.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-restaurant-gold/10 p-3 rounded-xl text-restaurant-gold shrink-0">
              <MapPin className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-bold text-md text-restaurant-dark">Our Location</h4>
              <p className="text-xs text-restaurant-muted leading-relaxed">
                123 Gourmet Lane, Culinary Heights, NY 10001 <br />
                Valet parking available.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-restaurant-gold/10 p-3 rounded-xl text-restaurant-gold shrink-0">
              <Star className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-bold text-md text-restaurant-dark">Our Standard</h4>
              <p className="text-xs text-restaurant-muted leading-relaxed">
                100% fresh organic food, hygiene-certified chefs, and a touch of royal culinary legacy.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
