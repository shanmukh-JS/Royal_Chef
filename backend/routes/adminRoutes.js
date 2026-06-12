const express = require('express');

const router = express.Router();

console.log('ADMIN ROUTES LOADED');

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'ADMIN ROUTER LOADED'
  });
});

router.get('/login', (req, res) => {
  res.json({
    success: true,
    message: 'ADMIN LOGIN ROUTE FOUND'
  });
});

router.post('/login', (req, res) => {
  res.json({
    success: true,
    message: 'POST LOGIN WORKS',
    body: req.body
  });
});

module.exports = router;