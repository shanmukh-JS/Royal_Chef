const db = require('../config/db');
const fs = require('fs');
const path = require('path');

// Get All Menu Items (supports search & category filters)
const getMenu = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let sql = 'SELECT * FROM menu_items WHERE 1=1';
    const params = [];

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY category, name';

    const [rows] = await db.query(sql, params);
    
    // Map standard availability to boolean and construct full image URLs
    const menu = rows.map(item => ({
      ...item,
      price: parseFloat(item.price),
      available: item.available === 1,
      image_url: item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `${req.protocol}://${req.get('host')}${item.image_url}`) : null
    }));

    res.json({
      success: true,
      menu
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Menu Item by ID
const getMenuItemById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM menu_items WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    const item = {
      ...rows[0],
      price: parseFloat(rows[0].price),
      available: rows[0].available === 1,
      image_url: rows[0].image_url ? (rows[0].image_url.startsWith('http') ? rows[0].image_url : `${req.protocol}://${req.get('host')}${rows[0].image_url}`) : null
    };

    res.json({
      success: true,
      item
    });
  } catch (error) {
    next(error);
  }
};

// Create Menu Item
const createMenuItem = async (req, res, next) => {
  try {
    const { name, description, price, category, available } = req.body;
    let imageUrl = null;

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const isAvailable = available === 'false' || available === '0' || available === 0 ? 0 : 1;

    const [result] = await db.query(
      'INSERT INTO menu_items (name, description, price, category, image_url, available) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, parseFloat(price), category, imageUrl, isAvailable]
    );

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      itemId: result.insertId
    });
  } catch (error) {
    next(error);
  }
};

// Update Menu Item
const updateMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, available } = req.body;

    const [existing] = await db.query('SELECT * FROM menu_items WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    let imageUrl = existing[0].image_url;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
      
      // Attempt to delete old image if it is local
      if (existing[0].image_url && existing[0].image_url.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '..', existing[0].image_url);
        fs.unlink(oldPath, (err) => {
          if (err) console.error('Error deleting old menu image file:', err.message);
        });
      }
    }

    const isAvailable = available === 'false' || available === '0' || available === 0 ? 0 : 1;

    await db.query(
      'UPDATE menu_items SET name = ?, description = ?, price = ?, category = ?, image_url = ?, available = ? WHERE id = ?',
      [name, description, parseFloat(price), category, imageUrl, isAvailable, id]
    );

    res.json({
      success: true,
      message: 'Menu item updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete Menu Item
const deleteMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query('SELECT * FROM menu_items WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    // Try deleting. If foreign key constraint fails, handle it gracefully.
    try {
      await db.query('DELETE FROM menu_items WHERE id = ?', [id]);

      // Delete image if it is local
      if (existing[0].image_url && existing[0].image_url.startsWith('/uploads/')) {
        const imagePath = path.join(__dirname, '..', existing[0].image_url);
        fs.unlink(imagePath, (err) => {
          if (err) console.error('Error deleting image file:', err.message);
        });
      }

      res.json({
        success: true,
        message: 'Menu item deleted successfully'
      });
    } catch (dbError) {
      if (dbError.code === 'ER_ROW_IS_REFERENCED_2' || dbError.errno === 1451) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete this menu item because it is referenced in past customer orders. Please disable availability instead.'
        });
      }
      throw dbError;
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMenu,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
};
