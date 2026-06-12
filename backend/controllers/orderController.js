const db = require('../config/db');

// Place Customer Order (SQL Transaction)
const createOrder = async (req, res, next) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { customer_name, mobile_number, table_number, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty. Please add items to checkout.'
      });
    }

    let totalAmount = 0;
    const resolvedItems = [];

    // Retrieve active prices from the database to prevent client manipulation
    for (const item of items) {
      const [menuRows] = await connection.query(
        'SELECT name, price, available FROM menu_items WHERE id = ?',
        [item.menu_item_id]
      );

      if (menuRows.length === 0) {
        throw new Error(`Item ${item.name || 'with ID ' + item.menu_item_id} no longer exists in our menu.`);
      }

      const dbItem = menuRows[0];
      if (dbItem.available === 0) {
        throw new Error(`"${dbItem.name}" is currently sold out. Please remove it and try again.`);
      }

      const itemPrice = parseFloat(dbItem.price);
      const itemQty = parseInt(item.quantity, 10);
      totalAmount += itemPrice * itemQty;

      resolvedItems.push({
        menu_item_id: item.menu_item_id,
        quantity: itemQty,
        price: itemPrice
      });
    }

    // Insert order header
    const [orderResult] = await connection.query(
      'INSERT INTO orders (customer_name, mobile_number, table_number, total_amount, status) VALUES (?, ?, ?, ?, ?)',
      [customer_name, mobile_number, table_number, totalAmount, 'Received']
    );

    const orderId = orderResult.insertId;

    // Insert order items
    for (const rItem of resolvedItems) {
      await connection.query(
        'INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, rItem.menu_item_id, rItem.quantity, rItem.price]
      );
    }

    // Commit Transaction
    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Your order has been placed successfully.',
      orderId,
      totalAmount
    });

  } catch (error) {
    await connection.rollback();
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to place the order.'
    });
  } finally {
    connection.release();
  }
};

// Get All Orders (Admin only)
const getOrders = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
    
    res.json({
      success: true,
      orders: rows
    });
  } catch (error) {
    next(error);
  }
};

// Get Order and Item Details by ID (Tracking / Admin Detail View)
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [orderRows] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (orderRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orderRows[0];

    const [itemRows] = await db.query(
      `SELECT oi.id, oi.menu_item_id, oi.quantity, oi.price, mi.name, mi.image_url
       FROM order_items oi
       JOIN menu_items mi ON oi.menu_item_id = mi.id
       WHERE oi.order_id = ?`,
      [id]
    );

    const items = itemRows.map(item => ({
      ...item,
      price: parseFloat(item.price),
      subtotal: parseFloat(item.price) * item.quantity,
      image_url: item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `${req.protocol}://${req.get('host')}${item.image_url}`) : null
    }));

    res.json({
      success: true,
      order: {
        ...order,
        total_amount: parseFloat(order.total_amount),
        items
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update Order Status (Admin only)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Received', 'Preparing', 'Ready', 'Served'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Must be Received, Preparing, Ready, or Served.'
      });
    }

    const [result] = await db.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: `Order status updated to ${status} successfully.`
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
