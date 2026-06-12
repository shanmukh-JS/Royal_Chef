const express = require('express');

console.log('ADMIN ROUTES LOADED');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'ADMIN ROUTER LOADED'
  });
});

router.post('/login', (req, res) => {
  res.json({
    success: true,
    message: 'LOGIN ROUTE WORKS'
  });
});

module.exports = router;