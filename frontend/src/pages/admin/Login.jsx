import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Lock, Mail, Utensils, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const { login, admin, loading } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // If already authenticated, bypass login
    if (admin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [admin, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!email.trim() || !password.trim()) {
      return setError('Please fill in all credentials fields');
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Welcome back, Admin!');
      navigate('/admin/dashboard', { replace: true });
    } else {
      setError(result.message);
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8 bg-slate-950 p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
        
        {/* Background Gradients */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-restaurant-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-restaurant-accent/5 rounded-full blur-3xl"></div>

        {/* Logo and Greeting */}
        <div className="text-center relative">
          <div className="bg-restaurant-gold/15 p-3.5 rounded-2xl w-14 h-14 mx-auto flex items-center justify-center text-restaurant-gold mb-4 border border-restaurant-gold/25">
            <Utensils className="h-6 w-6" />
          </div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-white leading-tight">
            Admin Portal
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Access the restaurant management interface
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-950/30 border border-red-500/40 p-4 rounded-xl flex items-start space-x-3 text-red-400 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5 relative">
          <div className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1">
              <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  id="email"
                  required
                  placeholder="admin@restaurant.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-800 bg-slate-900/50 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-restaurant-gold focus:ring-1 focus:ring-restaurant-gold"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label htmlFor="password" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  id="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-800 bg-slate-900/50 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-restaurant-gold focus:ring-1 focus:ring-restaurant-gold"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center bg-restaurant-gold hover:bg-restaurant-gold/90 text-slate-950 font-bold text-xs uppercase py-4 rounded-xl shadow-lg shadow-restaurant-gold/10 hover:-translate-y-0.5 transition-all duration-200 ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </div>
        </form>

        <div className="text-center pt-2 relative">
          <p className="text-[10px] text-slate-600">
            For access requests, please contact restaurant technical operations.
          </p>
        </div>

      </div>
    </div>
  );
}
