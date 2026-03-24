-- 004_fix_address_names.sql
-- Fix address updates that didn't match due to full restaurant names

-- 3. Fix Japonessa Sushi Cocina address
UPDATE food_deals
SET address = '500 Bellevue Way NE, Bellevue, WA 98004'
WHERE restaurant_name = 'Japonessa Sushi Cocina'
  AND address = '10500 NE 8th St #100, Bellevue, WA 98004';

-- 5. Fix Publico Kitchen & Tap address
UPDATE food_deals
SET address = '2013 Greene St, Columbia, SC 29205'
WHERE restaurant_name = 'Publico Kitchen & Tap'
  AND address = '2012 Greene St, Columbia, SC 29205';
