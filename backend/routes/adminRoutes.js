const express = require('express');
const { body } = require('express-validator');
const { login, getStats, getDailyReport, getWeeklyReport, getMonthlyReport } = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  login
);

router.get('/dashboard/stats', protectAdmin, getStats);
router.get('/reports/daily', protectAdmin, getDailyReport);
router.get('/reports/weekly', protectAdmin, getWeeklyReport);
router.get('/reports/monthly', protectAdmin, getMonthlyReport);

module.exports = router;