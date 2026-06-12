import React, { useContext } from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LayoutDashboard, Menu, ShoppingCart, BarChart3, LogOut, Utensils } from 'lucide-react';

export default function AdminLayout() {
  const { admin, loading, logout } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-300">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-restaurant-gold"></div>
          <p className="text-sm font-medium tracking-wider text-slate-500">Checking credentials...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  const navigationItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Menu Items', path: '/admin/menu', icon: Menu },
    { name: 'Orders List', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Sales Reports', path: '/admin/reports', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100 font-sans">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo area */}
          <div className="h-16 flex items-center px-6 border-b border-slate-800/80 space-x-2">
            <div className="bg-restaurant-gold/10 p-1.5 rounded-lg">
              <Utensils className="h-4.5 w-4.5 text-restaurant-gold" />
            </div>
            <span className="font-display font-extrabold text-sm tracking-widest text-slate-100">
              ROYAL CHEF <span className="text-restaurant-gold text-[10px] ml-1 px-1 bg-restaurant-gold/15 rounded">STAFF</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navigationItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'bg-restaurant-gold text-slate-950 shadow-md shadow-restaurant-gold/10 font-bold'
                      : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-100'
                  }`
                }
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Identity & Log Out */}
        <div className="p-4 border-t border-slate-800/80 space-y-4">
          <div className="px-4">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Account</p>
            <p className="text-xs font-semibold text-slate-300 truncate mt-0.5">{admin.name}</p>
            <p className="text-[10px] text-slate-500 truncate">{admin.email}</p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors duration-200"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-800/80 flex items-center justify-between px-8 bg-slate-950/40">
          <h1 className="font-display text-sm font-semibold tracking-wider text-slate-400 uppercase">
            Operational Dashboard
          </h1>
          <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-semibold bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
            <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>API Server Connect: Active</span>
          </div>
        </header>
        
        {/* Child Router Slots */}
        <main className="flex-1 p-8 overflow-y-auto bg-slate-900/20">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
