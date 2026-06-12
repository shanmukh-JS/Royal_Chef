// TEMPORARY ADMIN CONTROLLER FOR LOGIN TEST

const login = async (req, res, next) => {
  try {
    res.json({
      success: true,
      token: 'test-token',
      admin: {
        id: 1,
        name: 'Restaurant Admin',
        email: 'admin@restaurant.com'
      }
    });
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res) => {
  res.json({
    success: true,
    stats: {
      totalOrders: 0,
      totalRevenue: 0,
      totalMenuItems: 0,
      recentOrders: []
    }
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