USE `restaurant_db`;

-- Clear existing data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `order_items`;
TRUNCATE TABLE `orders`;
TRUNCATE TABLE `menu_items`;
TRUNCATE TABLE `admins`;
SET FOREIGN_KEY_CHECKS = 1;

-- Seed Admin User (Password: AdminPassword123)
INSERT INTO `admins` (`id`, `name`, `email`, `password`) VALUES
(1, 'Restaurant Admin', 'admin@restaurant.com', '$2a$10$KbsIRZTXE0PAHQnc2fGpjeUm8O7qnxfG7qTTkXwgH1MHumwW6Jkoa');

-- Seed Menu Items
INSERT INTO `menu_items` (`id`, `name`, `description`, `price`, `category`, `image_url`, `available`) VALUES
-- Starters
(1, 'Paneer Tikka', 'Cottage cheese cubes marinated in spiced yogurt and grilled in a clay oven with bell peppers.', 250.00, 'Starters', 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500', 1),
(2, 'Chicken Tikka', 'Tender boneless chicken pieces marinated in yogurt and tandoori spices, cooked to perfection.', 280.00, 'Starters', 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500', 1),
(3, 'Vegetable Spring Rolls', 'Crispy wrapper filled with stir-fried cabbage, carrots, and spring onions. Served with sweet chili sauce.', 160.00, 'Starters', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500', 1),
(4, 'Crispy Chilli Potatoes', 'Crispy fried potato strips tossed in a sweet, spicy, and tangy honey chili sauce.', 180.00, 'Starters', 'https://images.unsplash.com/photo-1518013002798-e37b23b21c4e?w=500', 1),
(5, 'Samosa Chaat', 'Deconstructed samosas topped with spicy chickpeas, yogurt, sweet tamarind, and mint chutneys.', 140.00, 'Starters', 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500', 1),

-- Main Course
(6, 'Butter Chicken', 'Charcoal-grilled chicken cooked in a rich, creamy, and mildly sweet tomato-butter gravy.', 340.00, 'Main Course', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500', 1),
(7, 'Paneer Butter Masala', 'Soft cottage cheese cubes simmered in a luscious tomato-butter gravy finished with fresh cream.', 320.00, 'Main Course', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500', 1),
(8, 'Dal Makhani', 'Slow-cooked black lentils and kidney beans simmered overnight with cream, butter, and spices.', 260.00, 'Main Course', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500', 1),
(9, 'Chana Masala', 'Chickpeas cooked in a traditional Punjabi style with onions, tomatoes, and robust spices.', 240.00, 'Main Course', 'https://images.unsplash.com/photo-1585938338392-50a59970d2ee?w=500', 1),
(10, 'Chicken Korma', 'Chicken pieces cooked in a luxurious Mughlai-style cashew nut, poppy seed, and yogurt gravy.', 360.00, 'Main Course', 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500', 1),

-- Biryani
(11, 'Hyderabadi Chicken Biryani', 'Basmati rice cooked in layers with marinated chicken, saffron, mint, and fried onions. Served with raita.', 380.00, 'Biryani', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500', 1),
(12, 'Vegetable Biryani', 'Fragrant basmati rice cooked with assorted vegetables, fresh herbs, and exotic spices.', 320.00, 'Biryani', 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500', 1),
(13, 'Mutton Biryani', 'Tender goat meat slow-cooked with basmati rice, aromatic spices, and clarified butter.', 440.00, 'Biryani', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500', 1),
(14, 'Egg Biryani', 'Spiced boiled eggs cooked layered with aromatic basmati rice and fried onions.', 340.00, 'Biryani', 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=500', 1),

-- Rice
(15, 'Steamed Basmati Rice', 'Fluffy, long-grain premium basmati rice steamed to perfection.', 90.00, 'Rice', 'https://images.unsplash.com/photo-1536304997881-a372c179924b?w=500', 1),
(16, 'Jeera Rice', 'Aromatic basmati rice tempered with cumin seeds and fresh ghee.', 130.00, 'Rice', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500', 1),
(17, 'Vegetable Fried Rice', 'Stir-fried basmati rice tossed with fresh carrots, beans, peas, and light soy sauce.', 220.00, 'Rice', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500', 1),

-- Desserts
(18, 'Gulab Jamun', 'Warm, soft, syrup-soaked milk dumplings flavored with cardamom and rose water.', 110.00, 'Desserts', 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500', 1),
(19, 'Rasmalai', 'Soft paneer patties soaked in sweet, saffron-infused milk and garnished with pistachios.', 130.00, 'Desserts', 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500', 1),
(20, 'Mango Kulfi', 'Traditional Indian dense ice cream made with condensed milk and sweet mango pulp.', 110.00, 'Desserts', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500', 1),

-- Beverages
(21, 'Fresh Lime Soda', 'Refreshing lime juice mixed with soda, served sweet or salted.', 70.00, 'Beverages', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500', 1),
(22, 'Masala Chai', 'Indian spiced milk tea brewed with cardamom, ginger, cloves, and loose tea leaves.', 50.00, 'Beverages', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500', 1),
(23, 'Mango Lassi', 'Chilled, creamy yogurt drink blended with fresh sweet mango pulp and sugar.', 90.00, 'Beverages', 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500', 1);

