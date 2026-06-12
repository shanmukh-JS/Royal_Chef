const express = require('express');
const { login } = require('../controllers/adminController');

const router = express.Router();

console.log('ADMIN ROUTES LOADED');

router.post('/login', login);

module.exports = router;