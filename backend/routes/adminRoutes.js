const express = require('express');
const { protectAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// TEST LOGIN ROUTE
router.post('/login', (req, res) => {
  res.json({
    success: true,
    message: 'Login route works'
  });
});

// TEST DASHBOARD ROUTE
router.get('/dashboard/stats', protectAdmin, (req, res) => {
  res.json({
    success: true,
    message: 'Dashboard route works'
  });
});

// TEST REPORT ROUTES
router.get('/reports/daily', protectAdmin, (req, res) => {
  res.json({
    success: true,
    report: []
  });
});

router.get('/reports/weekly', protectAdmin, (req, res) => {
  res.json({
    success: true,
    report: []
  });
});

router.get('/reports/monthly', protectAdmin, (req, res) => {
  res.json({
    success: true,
    report: []
  });
});

module.exports = router;