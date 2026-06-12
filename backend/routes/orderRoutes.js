const express = require('express');
const { body } = require('express-validator');
const { createOrder, getOrders, getOrderById, updateOrderStatus } = require('../controllers/orderController');
const { protectAdmin } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

// Validation Rules for checkout
const checkoutValidationRules = [
  body('customer_name').trim().notEmpty().withMessage('Name is required'),
  body('mobile_number')
    .trim()
    .notEmpty().withMessage('Mobile number is required')
    .isLength({ min: 10, max: 15 }).withMessage('Enter a valid mobile number (10-15 digits)')
    .isNumeric().withMessage('Mobile number must contain only numbers'),
  body('table_number')
    .trim()
    .notEmpty().withMessage('Table number is required')
    .isInt({ min: 1, max: 100 }).withMessage('Table number must be an integer between 1 and 100'),
  body('items')
    .isArray({ min: 1 }).withMessage('Your cart must contain at least one item')
];

// Public checkout & tracking
router.post('/', checkoutValidationRules, validate, createOrder);
router.get('/:id', getOrderById);

// Admin operations (Secured)
router.get('/', protectAdmin, getOrders);
router.put(
  '/:id/status',
  protectAdmin,
  [
    body('status')
      .notEmpty().withMessage('Status is required')
      .isIn(['Received', 'Preparing', 'Ready', 'Served']).withMessage('Invalid status type')
  ],
  validate,
  updateOrderStatus
);

module.exports = router;
