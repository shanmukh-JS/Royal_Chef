const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Enable CORS for all domains
app.use(cors());

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve menu uploads statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const adminRoutes = require('./routes/adminRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/admin', adminRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// Root Route
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Welcome to the Smart Restaurant Self-Ordering System REST API' 
  });
});

// Catch-All 404 Route
app.use((req, res, next) => {
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Central Error Handler
app.use(errorHandler);

module.exports = app;
