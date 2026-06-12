const express = require('express');
const {
  login,
  getStats,
  getDailyReport,
  getWeeklyReport,
  getMonthlyReport
} = require('../controllers/adminController');

const { protectAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// LOGIN ROUTE
router.post('/login', login);

// Protected Routes
router.post('/dashboard/stats', protectAdmin, getStats);
router.post('/reports/daily', protectAdmin, getDailyReport);
router.post('/reports/weekly', protectAdmin, getWeeklyReport);
router.post('/reports/monthly', protectAdmin, getMonthlyReport);

module.exports = router;