-- Add new columns to food_tgtg_deals for richer data
ALTER TABLE food_tgtg_deals ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE food_tgtg_deals ADD COLUMN IF NOT EXISTS store_id TEXT;
ALTER TABLE food_tgtg_deals ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE food_tgtg_deals ADD COLUMN IF NOT EXISTS cover_image_url TEXT;
ALTER TABLE food_tgtg_deals ADD COLUMN IF NOT EXISTS rating NUMERIC(3,1);
