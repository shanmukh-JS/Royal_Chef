const express = require('express');

const router = express.Router();

router.post('/login', (req, res) => {
  res.json({
    success: true,
    message: 'Admin Login Route Working'
  });
});

module.exports = router;