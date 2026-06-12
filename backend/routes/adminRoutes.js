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

// LOGIN
router.post('/login', login);

// DASHBOARD
router.get('/dashboard/stats', protectAdmin, getStats);

// REPORTS
router.get('/reports/daily', protectAdmin, getDailyReport);
router.get('/reports/weekly', protectAdmin, getWeeklyReport);
router.get('/reports/monthly', protectAdmin, getMonthlyReport);

module.exports = router;