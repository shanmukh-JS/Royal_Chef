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

    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

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
      process.env.JWT_SECRET,
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

// Temporary dashboard functions
const getStats = async (req, res) => {
  res.json({
    success: true,
    stats: {}
  });
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