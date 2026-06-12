const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// TEST ROUTE
app.get('/api/admin/login', (req, res) => {
  res.json({
    success: true,
    message: 'ADMIN LOGIN ROUTE FOUND'
  });
});

// IMPORT ROUTES
const adminRoutes = require('./routes/adminRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');

// REGISTER ROUTES
app.use('/api/admin', adminRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// ROOT ROUTE
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Smart Restaurant Self-Ordering System REST API'
  });
});

// 404 HANDLER
app.use((req, res, next) => {
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// ERROR HANDLER
app.use(errorHandler);

module.exports = app;