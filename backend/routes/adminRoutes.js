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

// TEMPORARY: Browser testing
router.get('/login', login);

// Protected Routes
router.get('/dashboard/stats', protectAdmin, getStats);
router.get('/reports/daily', protectAdmin, getDailyReport);
router.get('/reports/weekly', protectAdmin, getWeeklyReport);
router.get('/reports/monthly', protectAdmin, getMonthlyReport);

module.exports = router;