const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');
const { getMenu, getMenuItemById, createMenuItem, updateMenuItem, deleteMenuItem } = require('../controllers/menuController');
const { protectAdmin } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File Type Filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Only image files (JPEG, JPG, PNG, WEBP) are allowed'));
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Validation rules for adding/updating menu items
const menuValidationRules = [
  body('name').trim().notEmpty().withMessage('Food name is required'),
  body('price').isFloat({ min: 0.01 }).withMessage('Price must be a positive number'),
  body('category').trim().notEmpty().withMessage('Category is required')
];

// Public routes
router.get('/', getMenu);
router.get('/:id', getMenuItemById);

// Admin-only routes (Secured)
router.post(
  '/',
  protectAdmin,
  upload.single('image'),
  menuValidationRules,
  validate,
  createMenuItem
);

router.put(
  '/:id',
  protectAdmin,
  upload.single('image'),
  menuValidationRules,
  validate,
  updateMenuItem
);

router.delete('/:id', protectAdmin, deleteMenuItem);

module.exports = router;
