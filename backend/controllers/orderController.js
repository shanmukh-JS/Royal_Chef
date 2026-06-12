const db = require('../config/db');

// Create Order
const createOrder = async (req, res, next) => {
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    const { customer_name, mobile_number, table_number, items } = req.body;

    let totalAmount = 0;

    for (const item of items) {
      const menuResult = await client.query(
        'SELECT * FROM menu_items WHERE id = $1',
        [item.menu_item_id]
      );

      if (menuResult.rows.length === 0) {
        throw new Error('Menu item not found');
      }

      const menuItem = menuResult.rows[0];
      totalAmount += Number(menuItem.price) * item.quantity;
    }

    const orderResult = await client.query(
      `INSERT INTO orders
      (customer_name, mobile_number, table_number, total_amount, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id`,
      [
        customer_name,
        mobile_number,
        table_number,
        totalAmount,
        'Received'
      ]
    );

    const orderId = orderResult.rows[0].id;

    for (const item of items) {
      const menuResult = await client.query(
        'SELECT price FROM menu_items WHERE id = $1',
        [item.menu_item_id]
      );

      await client.query(
        `INSERT INTO order_items
        (order_id, menu_item_id, quantity, price)
        VALUES ($1, $2, $3, $4)`,
        [
          orderId,
          item.menu_item_id,
          item.quantity,
          menuResult.rows[0].price
        ]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      orderId,
      totalAmount
    });

  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

// Get Orders
const getOrders = async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT * FROM orders ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      orders: result.rows
    });

  } catch (error) {
    next(error);
  }
};

// Get Order By ID
const getOrderById = async (req, res, next) => {
  try {
    const orderResult = await db.query(
      'SELECT * FROM orders WHERE id = $1',
      [req.params.id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const itemsResult = await db.query(
      `SELECT oi.*, mi.name, mi.image_url
       FROM order_items oi
       JOIN menu_items mi ON oi.menu_item_id = mi.id
       WHERE oi.order_id = $1`,
      [req.params.id]
    );

    res.json({
      success: true,
      order: {
        ...orderResult.rows[0],
        items: itemsResult.rows
      }
    });

  } catch (error) {
    next(error);
  }
};

// Update Order Status
const updateOrderStatus = async (req, res, next) => {
  try {
    const result = await db.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [req.body.status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully'
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
};