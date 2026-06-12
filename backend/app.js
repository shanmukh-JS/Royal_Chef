const express = require('express');

const app = express();

// Test Root Route
app.get('/', (req, res) => {
  res.json({
    message: 'ROOT WORKS'
  });
});

// Test Admin Route
app.get('/api/admin/login', (req, res) => {
  res.json({
    message: 'ADMIN ROUTE WORKS'
  });
});

module.exports = app;