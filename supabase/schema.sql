-- Food Deals App - Supabase Schema & Seed Data
-- Created: 2026-03-14

-- ============================================
-- TABLE 1: food_deals (recurring weekly deals)
-- ============================================
CREATE TABLE IF NOT EXISTS food_deals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_name TEXT NOT NULL,
  deal_description TEXT NOT NULL,
  deal_price NUMERIC(8,2),
  regular_price NUMERIC(8,2),
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  cuisine_type TEXT,
  location_area TEXT DEFAULT 'Eastside Seattle',
  address TEXT,
  source_url TEXT,
  is_recurring BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- day_of_week: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday

ALTER TABLE food_deals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON food_deals FOR SELECT USING (true);

-- ============================================
-- TABLE 2: food_tgtg_deals (Too Good To Go - future)
-- ============================================
CREATE TABLE IF NOT EXISTS food_tgtg_deals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(8,2),
  original_price NUMERIC(8,2),
  pickup_start TIMESTAMPTZ,
  pickup_end TIMESTAMPTZ,
  items_available INTEGER,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE food_tgtg_deals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON food_tgtg_deals FOR SELECT USING (true);

-- ============================================
-- SEED DATA: Real Eastside Seattle Deals
-- ============================================

INSERT INTO food_deals (restaurant_name, deal_description, deal_price, regular_price, day_of_week, cuisine_type, address, source_url) VALUES

-- === SUNDAY (0) ===
('Bellevue Brewing Company', 'All-Day Sunday Happy Hour - discounted pints and appetizers', 5.00, 8.00, 0, 'Brewery/American', '12190 NE District Way, Bellevue, WA 98005', 'https://www.bellevuebrewing.com/'),
('Paddy Coynes', '50% off entire check after 9pm on Sundays', NULL, NULL, 0, 'Irish Pub', '700 Bellevue Way NE #50, Bellevue, WA 98004', NULL),
('Cactus Restaurants - Kirkland', 'Sunday Brunch with $8 brunch cocktails', 8.00, 14.00, 0, 'Southwest/Mexican', '121 Park Ln, Kirkland, WA 98033', 'https://www.cactusrestaurants.com/'),
('Matador Redmond', 'Sunday Happy Hour 4-6pm & 10pm-close - $6 appetizers', 6.00, 12.00, 0, 'Mexican', '7824 Leary Way NE, Redmond, WA 98052', 'https://www.matadorrestaurants.com/locations/redmond'),

-- === MONDAY (1) ===
('Wing Dome Kirkland', 'Monday $0.99 Boneless Wings (quantities of 6, with beverage purchase)', 0.99, 2.00, 1, 'Wings/American', '232 Central Way, Kirkland, WA 98033', 'https://thewingdome.com/daily-specials/'),
('Spark Pizza', 'Monday Pizza Night - large cheese pizza special', 12.00, 18.00, 1, 'Pizza', '8110 164th Ave NE, Redmond, WA 98052', 'https://www.sparkpizzaredmond.com/'),
('Matador Redmond', 'Monday Happy Hour 4-6pm & 10pm-close - discounted margaritas and apps', 6.00, 13.00, 1, 'Mexican', '7824 Leary Way NE, Redmond, WA 98052', 'https://www.matadorrestaurants.com/menus/redmond/happy-hour'),
('Wingstop Bellevue', 'Monday Boneless Wing Deal - 6pc boneless combo', 7.99, 11.99, 1, 'Wings/American', '645 156th Ave SE, Bellevue, WA 98007', 'https://www.wingstop.com/'),

-- === TUESDAY (2) ===
('Aceituno''s Mexican Food', 'Taco Tuesday - $1.50 street tacos', 1.50, 3.00, 2, 'Mexican', '11747 124th Ave NE, Kirkland, WA 98034', 'https://www.aceitunosmexicanfood.com/'),
('Red Robin Redmond', '$10 Gourmet Cheeseburger Tuesday with Bottomless Steak Fries', 10.00, 15.00, 2, 'Burgers/American', '2390 148th Ave NE, Redmond, WA 98052', 'https://www.redrobin.com/'),
('Red Robin Bellevue', '$10 Gourmet Cheeseburger Tuesday with Bottomless Steak Fries', 10.00, 15.00, 2, 'Burgers/American', '3909 Factoria Blvd SE, Bellevue, WA 98006', 'https://www.redrobin.com/'),
('Matador Redmond', 'Tequila Tuesday - 1/2 off all tequilas $16+, margarita specials', NULL, NULL, 2, 'Mexican', '7824 Leary Way NE, Redmond, WA 98052', 'https://www.matadorrestaurants.com/menus/redmond/happy-hour'),
('Wing Dome Kirkland', 'Tuesday Kids Eat Free with adult entrée purchase', 0.00, 8.00, 2, 'Wings/American', '232 Central Way, Kirkland, WA 98033', 'https://thewingdome.com/daily-specials/'),
('Juanita Cantina & Grill', 'Taco Tuesday - $2 tacos and $5 margaritas', 2.00, 4.00, 2, 'Mexican', '9709 NE 119th Way, Kirkland, WA 98034', NULL),

-- === WEDNESDAY (3) ===
('Wing Dome Kirkland', 'All You Can Eat Wings Wednesday (classic or boneless)', 25.95, NULL, 3, 'Wings/American', '232 Central Way, Kirkland, WA 98033', 'https://thewingdome.com/daily-specials/'),
('Buffalo Wild Wings Redmond', 'Wing Wednesday - BOGO Traditional Wings', NULL, NULL, 3, 'Wings/American', '7225 170th Ave NE #120, Redmond, WA 98052', 'https://www.buffalowildwings.com/'),
('Bandido''s Mexican Grill', 'Wednesday special - $3 fish tacos', 3.00, 5.50, 3, 'Mexican', '120 Central Way, Kirkland, WA 98033', NULL),
('Zio Sal Ristorante', 'Weekday Happy Hour 2:30-5:30pm - discounted pizza and wine', 8.00, 16.00, 3, 'Italian', '7525 166th Ave NE Ste D110, Redmond, WA 98052', 'https://ziosal.com/'),

-- === THURSDAY (4) ===
('Wing Dome Kirkland', 'Thursday $2.50 Smash Burger Sliders (with beverage purchase)', 2.50, 5.00, 4, 'Wings/American', '232 Central Way, Kirkland, WA 98033', 'https://thewingdome.com/daily-specials/'),
('Seastar Restaurant', 'Happy Hour 4-7pm daily - $8 small plates and $2 oysters', 8.00, 16.00, 4, 'Seafood', '205 108th Ave NE, Bellevue, WA 98004', 'https://seastarrestaurant.com/happy-hour/'),
('Japonessa Sushi Cocina', 'Happy Hour - half-price select sushi rolls and $6 apps', 6.00, 14.00, 4, 'Japanese/Sushi', '10500 NE 8th St #100, Bellevue, WA 98004', NULL),
('Castilla Restaurant', 'Thursday happy hour tapas - $5-8 small plates', 5.00, 12.00, 4, 'Spanish', '2608 Bellevue Way NE, Bellevue, WA 98004', NULL),

-- === FRIDAY (5) ===
('Bellevue Brewing Company', 'Friday Happy Hour 2-5pm - $5 pints and $3 off appetizers', 5.00, 8.00, 5, 'Brewery/American', '12190 NE District Way, Bellevue, WA 98005', 'https://www.bellevuebrewing.com/'),
('Matador Redmond', 'Friday Happy Hour 4-6pm - $12-14 margaritas, $6 appetizers', 6.00, 12.00, 5, 'Mexican', '7824 Leary Way NE, Redmond, WA 98052', 'https://www.matadorrestaurants.com/menus/redmond/happy-hour'),
('Cantina Monarca', 'Friday Happy Hour - $9 margaritas, $6 street tacos', 6.00, 12.00, 5, 'Mexican', '10421 NE 4th St, Bellevue, WA 98004', NULL),
('Ramen Nori', 'Friday special - $12 tonkotsu ramen bowl', 12.00, 16.00, 5, 'Japanese/Ramen', '1033 Bellevue Way NE, Bellevue, WA 98004', NULL),

-- === SATURDAY (6) ===
('Cosmos Bellevue', 'Saturday Brunch special with $7 mimosas', 7.00, 14.00, 6, 'American/Brunch', '10246 Main St, Bellevue, WA 98004', NULL),
('Señor Taco', 'Saturday special - $2.50 al pastor tacos', 2.50, 4.00, 6, 'Mexican', '12546 Totem Lake Blvd NE, Kirkland, WA 98034', NULL),
('Spark Pizza', 'Saturday Family Pizza Deal - 2 large pizzas + salad', 28.00, 42.00, 6, 'Pizza', '8110 164th Ave NE, Redmond, WA 98052', 'https://www.sparkpizzaredmond.com/'),
('Tres Hermanos Family Mexican', 'Saturday $10 combo plate special', 10.00, 15.00, 6, 'Mexican', '12010 NE 85th St, Kirkland, WA 98033', NULL);
