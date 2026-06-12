const db = require('../config/db');
const fs = require('fs');
const path = require('path');

// Get All Menu Items
const getMenu = async (req, res, next) => {
try {
const result = await db.query(
'SELECT * FROM menu_items ORDER BY category, name'
);

```
const menu = result.rows.map(item => ({
  ...item,
  price: parseFloat(item.price),
  image_url: item.image_url
    ? (item.image_url.startsWith('http')
        ? item.image_url
        : `${req.protocol}://${req.get('host')}${item.image_url}`)
    : null
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

// Get Menu Item By ID
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
let imageUrl = null;

if (req.file) {
  imageUrl = `/uploads/${req.file.filename}`;
}

const result = await db.query(
  `INSERT INTO menu_items
  (name, description, price, category, image_url, available)
  VALUES ($1,$2,$3,$4,$5,$6)
  RETURNING id`,
  [
    name,
    description,
    price,
    category,
    imageUrl,
    available !== false
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

```
const existing = await db.query(
  'SELECT * FROM menu_items WHERE id = $1',
  [id]
);

if (existing.rows.length === 0) {
  return res.status(404).json({
    success: false,
    message: 'Menu item not found'
  });
}

let imageUrl = existing.rows[0].image_url;

if (req.file) {
  imageUrl = `/uploads/${req.file.filename}`;
}

const { name, description, price, category, available } = req.body;

await db.query(
  `UPDATE menu_items
   SET name=$1,
       description=$2,
       price=$3,
       category=$4,
       image_url=$5,
       available=$6
   WHERE id=$7`,
  [
    name,
    description,
    price,
    category,
    imageUrl,
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
const { id } = req.params;

```
await db.query(
  'DELETE FROM menu_items WHERE id = $1',
  [id]
);

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
