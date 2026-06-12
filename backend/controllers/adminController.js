const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Admin Login
const login = async (req, res, next) => {
try {
const result = await db.query(
'SELECT * FROM admins WHERE email = $1',
[req.body.email]
);

```
if (result.rows.length === 0) {
  return res.status(401).json({
    success: false,
    message: 'Invalid email or password'
  });
}

const admin = result.rows[0];

const isMatch = await bcrypt.compare(
  req.body.password,
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
```

} catch (error) {
next(error);
}
};

// Dashboard Stats
const getStats = async (req, res, next) => {
try {
const totalOrdersResult = await db.query(
'SELECT COUNT(*) FROM orders'
);

```
const totalRevenueResult = await db.query(
  'SELECT COALESCE(SUM(total_amount),0) FROM orders'
);

const menuItemsResult = await db.query(
  'SELECT COUNT(*) FROM menu_items'
);

const recentOrdersResult = await db.query(
  'SELECT * FROM orders ORDER BY created_at DESC LIMIT 10'
);

res.json({
  success: true,
  stats: {
    totalOrders: Number(totalOrdersResult.rows[0].count),
    totalRevenue: Number(totalRevenueResult.rows[0].coalesce),
    totalMenuItems: Number(menuItemsResult.rows[0].count),
    recentOrders: recentOrdersResult.rows
  }
});
```

} catch (error) {
next(error);
}
};

const getDailyReport = async (req, res, next) => {
try {
res.json({
success: true,
report: []
});
} catch (error) {
next(error);
}
};

const getWeeklyReport = async (req, res, next) => {
try {
res.json({
success: true,
report: []
});
} catch (error) {
next(error);
}
};

const getMonthlyReport = async (req, res, next) => {
try {
res.json({
success: true,
report: []
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
