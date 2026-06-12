```js
const db = require('../config/db');

// TEMP LOGIN
const login = async (req, res) => {
  res.json({
    success: true,
    token: 'test-token',
    admin: {
      id: 1,
      name: 'Restaurant Admin',
      email: 'admin@restaurant.com'
    }
  });
};

const getStats = async (req, res, next) => {
  try {
    const totalOrders = await db.query(
      'SELECT COUNT(*) FROM orders'
    );

    const totalRevenue = await db.query(
      'SELECT COALESCE(SUM(total_amount),0) AS total FROM orders'
    );

    const totalMenuItems = await db.query(
      'SELECT COUNT(*) FROM menu_items'
    );

    const recentOrders = await db.query(
      'SELECT * FROM orders ORDER BY created_at DESC LIMIT 10'
    );

    res.json({
      success: true,
      stats: {
        pendingOrders: 0,
        totalOrders: Number(totalOrders.rows[0].count),
        revenueToday: 0,
        totalRevenue: Number(totalRevenue.rows[0].total),
        totalMenuItems: Number(totalMenuItems.rows[0].count),
        weeklySales: [],
        recentOrders: recentOrders.rows || []
      }
    });

  } catch (error) {
    next(error);
  }
};

const getDailyReport = async (req, res) => {
  res.json({
    success: true,
    report: []
  });
};

const getWeeklyReport = async (req, res) => {
  res.json({
    success: true,
    report: []
  });
};

const getMonthlyReport = async (req, res) => {
  res.json({
    success: true,
    report: []
  });
};

module.exports = {
  login,
  getStats,
  getDailyReport,
  getWeeklyReport,
  getMonthlyReport
};
```
