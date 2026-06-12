import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = () => {
      const token = localStorage.getItem('restaurant_admin_token');
      const savedAdmin = localStorage.getItem('restaurant_admin_info');
      
      if (token && savedAdmin) {
        try {
          setAdmin(JSON.parse(savedAdmin));
        } catch (e) {
          logout();
        }
      }
      setLoading(false);
    };
    verifySession();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await API.post('/admin/login', { email, password });
      
      if (response.data.success) {
        const { token, admin: adminData } = response.data;
        localStorage.setItem('restaurant_admin_token', token);
        localStorage.setItem('restaurant_admin_info', JSON.stringify(adminData));
        setAdmin(adminData);
        return { success: true };
      }
      return { success: false, message: response.data.message || 'Authentication failed' };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('restaurant_admin_token');
    localStorage.removeItem('restaurant_admin_info');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
