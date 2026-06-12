const db = require('../config/db');

// Get All Menu Items
const getMenu = async (req, res, next) => {
try {
const result = await db.query(
'SELECT * FROM menu_items ORDER BY category, name'
);

```
const menu = result.rows.map(item => ({
  ...item,
  price: parseFloat(item.price)
}));

res.json({
  success: true,
  menu
});
```

} catch (error) {
next(error);
}
};

// Get Single Menu Item
const getMenuItemById = async (req, res, next) => {
try {
const result = await db.query(
'SELECT * FROM menu_items WHERE id = $1',
[req.params.id]
);

```
if (result.rows.length === 0) {
  return res.status(404).json({
    success: false,
    message: 'Menu item not found'
  });
}

res.json({
  success: true,
  item: result.rows[0]
});
```

} catch (error) {
next(error);
}
};

// Create Menu Item
const createMenuItem = async (req, res, next) => {
try {
const { name, description, price, category, available } = req.body;

```
const result = await db.query(
  `INSERT INTO menu_items
  (name, description, price, category, available)
  VALUES ($1,$2,$3,$4,$5)
  RETURNING id`,
  [
    name,
    description,
    price,
    category,
    available ?? true
  ]
);

res.status(201).json({
  success: true,
  itemId: result.rows[0].id
});
```

} catch (error) {
next(error);
}
};

// Update Menu Item
const updateMenuItem = async (req, res, next) => {
try {
const { id } = req.params;
const { name, description, price, category, available } = req.body;

```
await db.query(
  `UPDATE menu_items
   SET name=$1,
       description=$2,
       price=$3,
       category=$4,
       available=$5
   WHERE id=$6`,
  [
    name,
    description,
    price,
    category,
    available,
    id
  ]
);

res.json({
  success: true,
  message: 'Menu item updated successfully'
});
```

} catch (error) {
next(error);
}
};

// Delete Menu Item
const deleteMenuItem = async (req, res, next) => {
try {
await db.query(
'DELETE FROM menu_items WHERE id = $1',
[req.params.id]
);

```
res.json({
  success: true,
  message: 'Menu item deleted successfully'
});
```

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
