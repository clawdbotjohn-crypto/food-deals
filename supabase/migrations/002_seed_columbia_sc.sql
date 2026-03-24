-- Seed data: Real Columbia, SC food deals
-- Researched from experiencecolumbiasc.com, Yelp, Reddit r/ColumbiYEAH

INSERT INTO food_deals (restaurant_name, deal_description, deal_price, regular_price, day_of_week, cuisine_type, location_area, address, city, source_url) VALUES

-- === SUNDAY (0) ===
('Publico Kitchen & Tap', 'Sunday Funday - $5 cocktails, $20 mimosa pitchers', 5.00, 12.00, 0, 'Mexican/American', 'Five Points', '2012 Greene St, Columbia, SC 29205', 'Columbia SC', NULL),
('Tin Roof', 'Weekend Happy Hour 2-7pm - 50% off appetizers, $3 domestic drafts & wells', 3.00, 7.00, 0, 'American', 'The Vista', '1022 Senate St, Columbia, SC 29201', 'Columbia SC', NULL),
('Hickory Tavern', 'Sunday Funday - every drink special served all day 4-8pm', 4.00, 8.00, 0, 'American/Bar', 'The Vista', '902 Gervais St, Columbia, SC 29201', 'Columbia SC', NULL),

-- === MONDAY (1) ===
('D''s Wings', 'Monday All Day Wing Special + blackened chicken wrap lunch $8.99', 8.99, 13.00, 1, 'Wings/American', 'West Columbia', '2522 Augusta Rd, West Columbia, SC 29169', 'Columbia SC', NULL),
('Publico Kitchen & Tap', 'Monday - $2 tacos, $4 margaritas & $4 Micheladas', 2.00, 5.00, 1, 'Mexican', 'Five Points', '2012 Greene St, Columbia, SC 29205', 'Columbia SC', NULL),
('Hickory Tavern', 'Monday 4-11pm - half price burgers, $4 house pours, $3 domestic drafts', 6.00, 12.00, 1, 'American/Bar', 'The Vista', '902 Gervais St, Columbia, SC 29201', 'Columbia SC', NULL),

-- === TUESDAY (2) ===
('Hickory Tavern', 'Taco Tuesday 4-11pm - half price tacos, $5 house margarita, $4 Modelo draft', 5.00, 10.00, 2, 'Mexican/American', 'The Vista', '902 Gervais St, Columbia, SC 29201', 'Columbia SC', NULL),
('Masa Mexican Street Food', 'Tuesday $3.50 street tacos all day', 3.50, 5.00, 2, 'Mexican', 'Rosewood', '2855 Rosewood Dr, Columbia, SC 29205', 'Columbia SC', 'https://www.masamexicanstreetfood.com'),
('D''s Wings', 'Taco Tuesday Special', 2.50, 5.00, 2, 'Mexican/Wings', 'West Columbia', '2522 Augusta Rd, West Columbia, SC 29169', 'Columbia SC', NULL),
('Cantina 76', 'Happy Hour 4-7pm - $1 off all drinks, half-off house margarita (Mon & Wed)', 5.00, 10.00, 2, 'Mexican', 'Main Street', '1215 Main St, Columbia, SC 29201', 'Columbia SC', NULL),
('COA Agaveria y Cocina', 'Tue-Fri Happy Hour 4-7pm - $9 Feliz margarita, $3 Tecate, $1 off wells', 3.00, 6.00, 2, 'Mexican', 'The Vista', '1101 Lincoln St, Columbia, SC 29201', 'Columbia SC', NULL),

-- === WEDNESDAY (3) ===
('Village Idiot Pizza', 'BOGO Pizzas all day Wednesday', 10.00, 20.00, 3, 'Pizza', 'Five Points', '2009 Greene St, Columbia, SC 29205', 'Columbia SC', NULL),
('Group Therapy', '50¢ wings - 10 for $5, 20 for $10', 5.00, 12.00, 3, 'Wings/American', 'Five Points', '2107 Greene St, Columbia, SC 29205', 'Columbia SC', NULL),
('Hickory Tavern', 'Wing Wednesday 4-11pm - half price wings, $4 Blue Moon, $3 domestic drafts', 5.00, 10.00, 3, 'Wings/American', 'The Vista', '902 Gervais St, Columbia, SC 29201', 'Columbia SC', NULL),
('Publico Kitchen & Tap', 'Smash burger and draft beer combo $14', 14.00, 22.00, 3, 'American', 'Five Points', '2012 Greene St, Columbia, SC 29205', 'Columbia SC', NULL),
('Masa Mexican Street Food', 'Wednesday $8 burritos all day', 8.00, 12.00, 3, 'Mexican', 'Rosewood', '2855 Rosewood Dr, Columbia, SC 29205', 'Columbia SC', 'https://www.masamexicanstreetfood.com'),

-- === THURSDAY (4) ===
('SakiTumi Grill & Sushi', 'Thursday - half-price select sushi rolls', 7.00, 14.00, 4, 'Japanese/Sushi', 'The Vista', '807 Gervais St, Columbia, SC 29201', 'Columbia SC', NULL),
('The War Mouth', 'Thursday - $8 old fashioned all day', 8.00, 14.00, 4, 'Southern/American', 'Cottontown', '1209 Franklin St, Columbia, SC 29201', 'Columbia SC', NULL),
('Village Idiot Pizza', 'Happy Hour 4-7pm - $2 cheese slices, $3 well liquor, $2 off pints', 2.00, 4.50, 4, 'Pizza', 'Five Points', '2009 Greene St, Columbia, SC 29205', 'Columbia SC', NULL),

-- === FRIDAY (5) ===
('Pearlz Oyster Bar', 'Happy Hour 4-6pm - $12 char-broiled oysters, $4 drafts, $3 champagne', 4.00, 8.00, 5, 'Seafood', 'The Vista', '936 Gervais St, Columbia, SC 29201', 'Columbia SC', NULL),
('Prohibition', 'Happy Hour 4-6pm - $5 draft beer, wells, cocktail of the day, $1.50 oysters', 5.00, 10.00, 5, 'American/Cocktail Bar', 'Main Street', '1217 Main St, Columbia, SC 29201', 'Columbia SC', NULL),

-- === SATURDAY (6) ===
('SakiTumi Grill & Sushi', 'Saturday 5-10pm - half price sake all night', 6.00, 12.00, 6, 'Japanese/Sushi', 'The Vista', '807 Gervais St, Columbia, SC 29201', 'Columbia SC', NULL),
('Publico Kitchen & Tap', 'Saturday - pineapple margarita + cocktails, $20 mimosa/sangria pitchers', 7.00, 14.00, 6, 'Mexican/American', 'Five Points', '2012 Greene St, Columbia, SC 29205', 'Columbia SC', NULL);
