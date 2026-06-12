import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Admin Layout
import AdminLayout from './components/admin/AdminLayout';

// Customer Pages
import Home from './pages/customer/Home';
import Menu from './pages/customer/Menu';
import FoodDetails from './pages/customer/FoodDetails';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import OrderSuccess from './pages/customer/OrderSuccess';
import OrderTracking from './pages/customer/OrderTracking';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import MenuManagement from './pages/admin/MenuManagement';
import OrderManagement from './pages/admin/OrderManagement';
import SalesReport from './pages/admin/SalesReport';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-restaurant-cream text-restaurant-dark">
            
            {/* Global Customer Navigation (hidden on admin pages) */}
            <Navbar />
            
            {/* Main Application Routes */}
            <div className="flex-grow">
              <Routes>
                {/* Customer Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/menu/:id" element={<FoodDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/success" element={<OrderSuccess />} />
                <Route path="/track/:id" element={<OrderTracking />} />

                {/* Admin Public Route */}
                <Route path="/admin/login" element={<Login />} />

                {/* Admin Secured Management Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="menu" element={<MenuManagement />} />
                  <Route path="orders" element={<OrderManagement />} />
                  <Route path="reports" element={<SalesReport />} />
                </Route>

                {/* Fallback Catch-All */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>

            {/* Global Customer Footer (hidden on admin pages) */}
            <Footer />

          </div>
          
          {/* Toast Notification Container */}
          <Toaster 
            position="top-center" 
            toastOptions={{
              duration: 3500,
              style: {
                fontFamily: 'Outfit, sans-serif',
                fontSize: '13px',
                borderRadius: '12px'
              }
            }}
          />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
