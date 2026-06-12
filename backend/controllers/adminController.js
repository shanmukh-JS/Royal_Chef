const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Admin Login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await db.query(
      'SELECT * FROM admins WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const admin = result.rows[0];

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        name: admin.name
      },
      process.env.JWT_SECRET || 'supersecretjwt',
      {
        expiresIn: process.env.JWT_EXPIRE || '24h'
      }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email
      }
    });

  } catch (error) {
    next(error);
  }
};

// Dashboard Stats
const getStats = async (req, res, next) => {
  try {
    const totalOrders = await db.query(
      'SELECT COUNT(*) FROM orders'
    );

    const totalRevenue = await db.query(
      'SELECT COALESCE(SUM(total_amount),0) FROM orders'
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
        totalOrders: Number(totalOrders.rows[0].count),
        totalRevenue: Number(totalRevenue.rows[0].coalesce),
        totalMenuItems: Number(totalMenuItems.rows[0].count),
        recentOrders: recentOrders.rows
      }
    });

  } catch (error) {
    next(error);
  }
};

// Daily Report
const getDailyReport = async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT
        EXTRACT(HOUR FROM created_at) AS hour,
        COUNT(*) AS orders,
        COALESCE(SUM(total_amount),0) AS revenue
      FROM orders
      WHERE DATE(created_at) = CURRENT_DATE
      GROUP BY hour
      ORDER BY hour
    `);

    res.json({
      success: true,
      report: result.rows
    });

  } catch (error) {
    next(error);
  }
};

// Weekly Report
const getWeeklyReport = async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT
        DATE(created_at) AS date,
        COUNT(*) AS orders,
        COALESCE(SUM(total_amount),0) AS revenue
      FROM orders
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at)
    `);

    res.json({
      success: true,
      report: result.rows
    });

  } catch (error) {
    next(error);
  }
};

// Monthly Report
const getMonthlyReport = async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT
        DATE(created_at) AS date,
        COUNT(*) AS orders,
        COALESCE(SUM(total_amount),0) AS revenue
      FROM orders
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at)
    `);

    res.json({
      success: true,
      report: result.rows
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  getStats,
  getDailyReport,
  getWeeklyReport,
  getMonthlyReport
};