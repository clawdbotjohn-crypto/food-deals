-- 003_fix_data_quality.sql
-- Fix critical data issues found in DATA-AUDIT.md

-- 1. Remove Wing Dome Kirkland deals (restaurant confirmed CLOSED)
DELETE FROM food_deals WHERE restaurant_name = 'Wing Dome Kirkland';

-- 2. Remove Spark Pizza Monday deal (closed Mondays, keep Saturday deal)
DELETE FROM food_deals WHERE restaurant_name = 'Spark Pizza' AND day_of_week = 1;

-- 3. Fix Japonessa address
UPDATE food_deals
SET address = '500 Bellevue Way NE, Bellevue, WA 98004'
WHERE restaurant_name = 'Japonessa'
  AND address = '10500 NE 8th St #100, Bellevue, WA 98004';

-- 4. Fix Village Idiot Pizza address
UPDATE food_deals
SET address = '2009 Devine St, Columbia, SC 29205'
WHERE restaurant_name = 'Village Idiot Pizza'
  AND address = '2009 Greene St, Columbia, SC 29205';

-- 5. Fix Publico address
UPDATE food_deals
SET address = '2013 Greene St, Columbia, SC 29205'
WHERE restaurant_name = 'Publico'
  AND address = '2012 Greene St, Columbia, SC 29205';

-- 6. Add data quality tracking columns
ALTER TABLE food_deals
  ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
