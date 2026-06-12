const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Admin Login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Fetch Admin
    const [rows] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const admin = rows[0];

    // Check Password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate Token
    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name },
      process.env.JWT_SECRET || 'supersecretrestaurantjwtkey123!',
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
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
    // 1. Total Orders
    const [totalOrdersRow] = await db.query('SELECT COUNT(*) as count FROM orders');
    const totalOrders = totalOrdersRow[0].count;

    // 2. Revenue Today
    const [revenueTodayRow] = await db.query('SELECT IFNULL(SUM(total_amount), 0) as total FROM orders WHERE DATE(created_at) = CURDATE()');
    const revenueToday = parseFloat(revenueTodayRow[0].total);

    // 3. Total Revenue
    const [totalRevenueRow] = await db.query('SELECT IFNULL(SUM(total_amount), 0) as total FROM orders');
    const totalRevenue = parseFloat(totalRevenueRow[0].total);

    // 4. Total Menu Items
    const [totalMenuItemsRow] = await db.query('SELECT COUNT(*) as count FROM menu_items');
    const totalMenuItems = totalMenuItemsRow[0].count;

    // 5. Pending Orders
    const [pendingOrdersRow] = await db.query("SELECT COUNT(*) as count FROM orders WHERE status IN ('Received', 'Preparing', 'Ready')");
    const pendingOrders = pendingOrdersRow[0].count;

    // 6. Recent Orders
    const [recentOrders] = await db.query('SELECT id, customer_name, total_amount, status, created_at, updated_at FROM orders ORDER BY created_at DESC LIMIT 10');

    // 7. Graph Data (Last 7 Days) for Dashboard preview
    const [weeklySales] = await db.query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m-%d') as date, 
        COUNT(*) as orders, 
        ROUND(IFNULL(SUM(total_amount), 0), 2) as revenue 
      FROM orders 
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
      ORDER BY date ASC
    `);

    res.json({
      success: true,
      stats: {
        totalOrders,
        revenueToday,
        totalRevenue,
        totalMenuItems,
        pendingOrders,
        recentOrders,
        weeklySales
      }
    });

  } catch (error) {
    next(error);
  }
};

// Sales Report - Daily (Hourly distribution of today's sales)
const getDailyReport = async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        HOUR(created_at) as hour, 
        COUNT(*) as orders, 
        ROUND(IFNULL(SUM(total_amount), 0), 2) as revenue 
      FROM orders 
      WHERE DATE(created_at) = CURDATE() 
      GROUP BY HOUR(created_at) 
      ORDER BY hour ASC
    `);

    // Standardize all 24 hours
    const report = Array.from({ length: 24 }, (_, hour) => {
      const existing = rows.find(r => r.hour === hour);
      return {
        label: `${hour.toString().padStart(2, '0')}:00`,
        orders: existing ? existing.orders : 0,
        revenue: existing ? parseFloat(existing.revenue) : 0
      };
    });

    res.json({
      success: true,
      report
    });
  } catch (error) {
    next(error);
  }
};

// Sales Report - Weekly (Last 7 Days)
const getWeeklyReport = async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m-%d') as date,
        DAYNAME(created_at) as dayName,
        COUNT(*) as orders, 
        ROUND(IFNULL(SUM(total_amount), 0), 2) as revenue 
      FROM orders 
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d'), DAYNAME(created_at)
      ORDER BY date ASC
    `);

    res.json({
      success: true,
      report: rows.map(r => ({
        label: r.dayName,
        date: r.date,
        orders: r.orders,
        revenue: parseFloat(r.revenue)
      }))
    });
  } catch (error) {
    next(error);
  }
};

// Sales Report - Monthly (Last 30 Days)
const getMonthlyReport = async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m-%d') as date, 
        COUNT(*) as orders, 
        ROUND(IFNULL(SUM(total_amount), 0), 2) as revenue 
      FROM orders 
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 29 DAY)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
      ORDER BY date ASC
    `);

    res.json({
      success: true,
      report: rows.map(r => ({
        label: DATE_FORMAT_JS(r.date),
        date: r.date,
        orders: r.orders,
        revenue: parseFloat(r.revenue)
      }))
    });
  } catch (error) {
    next(error);
  }
};

// Helper for formatting date strings
function DATE_FORMAT_JS(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}

module.exports = {
  login,
  getStats,
  getDailyReport,
  getWeeklyReport,
  getMonthlyReport
};
