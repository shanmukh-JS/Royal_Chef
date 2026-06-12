const express = require('express');
const { login } = require('../controllers/adminController');

const router = express.Router();

console.log('ADMIN ROUTES LOADED');

router.get('/login', login);

module.exports = router;