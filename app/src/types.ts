export interface FoodDeal {
  id: string;
  restaurant_name: string;
  deal_description: string;
  deal_price: number | null;
  regular_price: number | null;
  day_of_week: number;
  cuisine_type: string | null;
  location_area: string | null;
  address: string | null;
  source_url: string | null;
  is_recurring: boolean;
  created_at: string;
}
