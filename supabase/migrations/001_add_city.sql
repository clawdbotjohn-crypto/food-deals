-- Add city column to food_deals for multi-city support
ALTER TABLE food_deals ADD COLUMN IF NOT EXISTS city TEXT DEFAULT 'Eastside Seattle';

-- Update any existing rows that might have NULL city
UPDATE food_deals SET city = 'Eastside Seattle' WHERE city IS NULL;

-- Create index for city filtering
CREATE INDEX IF NOT EXISTS idx_food_deals_city ON food_deals(city);
