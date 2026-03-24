export interface TGTGDeal {
  id: string;
  store_name: string;
  description: string | null;
  price: number | null;
  original_price: number | null;
  pickup_start: string | null;
  pickup_end: string | null;
  items_available: number;
  lat: number | null;
  lng: number | null;
  last_seen: string;
  created_at: string;
  city: string | null;
  store_id: string | null;
  category: string | null;
  cover_image_url: string | null;
  rating: number | null;
}

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
  city: string | null;
  created_at: string;
}
