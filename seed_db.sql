-- Disable FK checks to allow truncation
SET FOREIGN_KEY_CHECKS = 0;

-- Clear existing data
TRUNCATE TABLE sales;
TRUNCATE TABLE inventory;
TRUNCATE TABLE plants;
TRUNCATE TABLE categories;

-- Seed Categories
INSERT INTO categories (id, name, parent_id) VALUES
(1, 'Herbs', NULL),
(2, 'Roses', NULL),          -- Renamed from Flowers for API test
(3, 'UI_Ad_01', NULL),       -- Required for Category UI tests
(4, 'API_Ad_04', NULL),      -- Required for Category API Search
(5, 'UI_Us_02', NULL),       -- Required for Category UI Search/Filter
(6, 'Sub_Us_02', 5),         -- Required for Category UI Filter (Sub of UI_Us_02)
(8, 'Category 8', NULL),     -- Required for Plant API Create
(9, 'Category 9', NULL);     -- Required for Plant API Create

-- Seed Plants
INSERT INTO plants (id, name, price, quantity, category_id) VALUES
(1, 'Rose', 10.00, 100, 2),        -- General tests, in "Roses" category
(2, 'DeleteMe', 5.00, 5, 1),       -- Deletion tests, Low stock for overselling
(3, 'Basil', 3.00, 20, 1),         -- Search tests
(4, 'Expensive Plant', 100.00, 5, 1), -- Sorting tests
(5, 'anthurium', 15.00, 50, 2),    -- Sales tests
(130, 'Plant 130', 50.00, 10, 1);  -- API Edit test

-- Seed Sales
INSERT INTO sales (id, quantity, sold_at, total_price, plant_id) VALUES
(1, 1, NOW(), 10.00, 1),           -- Recent sale (Rose), Forbidden Delete test
(2, 2, DATE_SUB(NOW(), INTERVAL 1 DAY), 6.00, 3), -- Older sale (Basil)
(3, 1, NOW(), 15.00, 5),
(4, 5, NOW(), 50.00, 1),
(5, 1, DATE_SUB(NOW(), INTERVAL 2 DAY), 3.00, 3),
(6, 1, NOW(), 10.00, 1),
(7, 2, NOW(), 30.00, 5),
(8, 1, NOW(), 10.00, 1),
(9, 3, DATE_SUB(NOW(), INTERVAL 3 DAY), 9.00, 3),
(10, 1, NOW(), 100.00, 4),
(11, 1, NOW(), 10.00, 1),
(12, 1, NOW(), 10.00, 1),
(13, 1, NOW(), 10.00, 1),
(14, 1, NOW(), 10.00, 1),
(15, 1, NOW(), 10.00, 1),
(16, 1, NOW(), 10.00, 1),
(17, 1, NOW(), 10.00, 1),
(18, 1, NOW(), 10.00, 1),
(19, 1, NOW(), 10.00, 1),
(20, 1, NOW(), 10.00, 1),
(23, 1, NOW(), 10.00, 1);          -- Get Specific Sale by ID test

-- Re-enable FK checks
SET FOREIGN_KEY_CHECKS = 1;
