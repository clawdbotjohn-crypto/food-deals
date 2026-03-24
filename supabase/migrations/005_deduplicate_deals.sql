-- 005_deduplicate_deals.sql
-- Remove duplicate food_deals created by re-running seed migrations
-- Keep only one row per unique combination (using ctid for dedup)

DELETE FROM food_deals a
USING food_deals b
WHERE a.ctid > b.ctid
  AND a.restaurant_name = b.restaurant_name
  AND a.day_of_week = b.day_of_week
  AND a.deal_description = b.deal_description;
