#!/usr/bin/env python3
"""
TGTG (Too Good To Go) sync script for Food Deals.

Fetches surplus food deals from TGTG for configured locations
and syncs them to the food_tgtg_deals Supabase table.

Usage:
    python3 tgtg_sync.py

Requires:
    - ~/.tgtg_credentials.json (run tgtg_setup.py first)
    - ~/.supabase_env (SUPABASE_URL)
    - projects/food-deals/app/.env (VITE_SUPABASE_ANON_KEY)
    - pip install tgtg requests
"""

import json
import os
import sys
import uuid
from datetime import datetime, timezone
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
CREDENTIALS_PATH = Path.home() / ".tgtg_credentials.json"
SUPABASE_ENV_PATH = Path.home() / ".supabase_env"
APP_ENV_PATH = PROJECT_DIR / "app" / ".env"
CONFIG_PATH = SCRIPT_DIR / "tgtg_config.json"

# City mapping: location name -> city value (must match food_deals.city values)
LOCATION_CITY_MAP = {
    "Eastside Seattle": "Seattle",
    "Columbia SC": "Columbia",
}


def load_supabase_config():
    """Load Supabase URL and anon key from env files."""
    supabase_url = None
    anon_key = None

    # Read from app/.env (has both URL and anon key)
    if APP_ENV_PATH.exists():
        for line in APP_ENV_PATH.read_text().splitlines():
            line = line.strip()
            if line.startswith("VITE_SUPABASE_URL="):
                supabase_url = line.split("=", 1)[1].strip().strip('"')
            elif line.startswith("VITE_SUPABASE_ANON_KEY="):
                anon_key = line.split("=", 1)[1].strip().strip('"')

    # Fallback: check ~/.supabase_env for URL
    if not supabase_url and SUPABASE_ENV_PATH.exists():
        for line in SUPABASE_ENV_PATH.read_text().splitlines():
            line = line.strip()
            if line.startswith("SUPABASE_URL="):
                supabase_url = line.split("=", 1)[1].strip().strip('"')

    if not supabase_url or not anon_key:
        print("❌ Missing Supabase config. Need SUPABASE_URL in ~/.supabase_env and VITE_SUPABASE_ANON_KEY in app/.env")
        sys.exit(1)

    return supabase_url, anon_key


def load_credentials():
    """Load TGTG credentials from ~/.tgtg_credentials.json."""
    if not CREDENTIALS_PATH.exists():
        print("⚠️  TGTG credentials not found at ~/.tgtg_credentials.json")
        print("   Run tgtg_setup.py first to authenticate with Too Good To Go.")
        return None

    try:
        creds = json.loads(CREDENTIALS_PATH.read_text())
        required = ["access_token", "refresh_token", "cookie", "user_id"]
        missing = [k for k in required if k not in creds]
        if missing:
            print(f"❌ Credentials file missing keys: {missing}")
            return None
        return creds
    except json.JSONDecodeError:
        print("❌ Invalid JSON in ~/.tgtg_credentials.json")
        return None


def load_config():
    """Load location config from tgtg_config.json."""
    if not CONFIG_PATH.exists():
        print(f"❌ Config not found at {CONFIG_PATH}")
        sys.exit(1)

    return json.loads(CONFIG_PATH.read_text())


def fetch_tgtg_items(creds, locations):
    """Fetch items from TGTG API for all configured locations."""
    try:
        from tgtg import TgtgClient
    except ImportError:
        print("❌ tgtg library not installed. Run: pip install tgtg")
        sys.exit(1)

    client = TgtgClient(
        access_token=creds["access_token"],
        refresh_token=creds["refresh_token"],
        cookie=creds["cookie"],
        user_id=creds["user_id"],
    )

    all_items = []
    for loc in locations:
        print(f"📍 Fetching deals for {loc['name']}...")
        try:
            items = client.get_items(
                favorites_only=False,
                latitude=loc["lat"],
                longitude=loc["lng"],
                radius=loc.get("radius", 15),
            )
            print(f"   Found {len(items)} items")
            for item in items:
                item["_location_name"] = loc["name"]
            all_items.extend(items)
        except Exception as e:
            error_msg = str(e)
            if "401" in error_msg or "unauthorized" in error_msg.lower():
                print(f"   ⚠️  Auth error for {loc['name']} — token may be expired. Run tgtg_setup.py to re-auth.")
            elif "429" in error_msg or "rate" in error_msg.lower():
                print(f"   ⚠️  Rate limited for {loc['name']} — try again later.")
            else:
                print(f"   ❌ Error fetching {loc['name']}: {e}")

    return all_items


def parse_tgtg_item(item):
    """Parse a TGTG API item into our database schema."""
    store = item.get("store", {})
    item_info = item.get("item", {})
    display_name = item.get("display_name") or store.get("store_name", "Unknown Store")

    price_obj = item_info.get("price_including_taxes") or item.get("item", {}).get("price", {})
    orig_price_obj = item_info.get("value_including_taxes") or item.get("item", {}).get("value", {})

    price = None
    if price_obj:
        minor = price_obj.get("minor_units", 0)
        decimals = price_obj.get("decimals", 2)
        price = minor / (10 ** decimals) if minor else None

    original_price = None
    if orig_price_obj:
        minor = orig_price_obj.get("minor_units", 0)
        decimals = orig_price_obj.get("decimals", 2)
        original_price = minor / (10 ** decimals) if minor else None

    pickup_interval = item.get("pickup_interval") or {}
    pickup_start = pickup_interval.get("start")
    pickup_end = pickup_interval.get("end")

    store_location = store.get("store_location", {})
    location = store_location.get("location", {})
    lat = location.get("latitude")
    lng = location.get("longitude")

    items_available = item.get("items_available", 0)
    store_id = store.get("store_id") or str(item.get("item", {}).get("item_id", ""))

    description = item_info.get("description", "")
    category = item_info.get("food_handling_instructions") or item_info.get("item_category", "")
    cover_url = item_info.get("cover_picture", {}).get("current_url") if item_info.get("cover_picture") else None
    rating = item.get("average_overall_rating", {}).get("average_overall_rating") if item.get("average_overall_rating") else None

    location_name = item.get("_location_name", "")
    city = LOCATION_CITY_MAP.get(location_name, location_name)

    return {
        "store_name": display_name,
        "description": description or None,
        "price": price,
        "original_price": original_price,
        "pickup_start": pickup_start,
        "pickup_end": pickup_end,
        "items_available": items_available,
        "lat": lat,
        "lng": lng,
        "last_seen": datetime.now(timezone.utc).isoformat(),
        "store_id": store_id or None,
        "city": city,
        "category": category or None,
        "cover_image_url": cover_url,
        "rating": float(rating) if rating else None,
    }


def supabase_request(url, anon_key, method="GET", endpoint="", data=None, params=None):
    """Make a request to the Supabase REST API."""
    import requests

    full_url = f"{url}/rest/v1/{endpoint}"
    headers = {
        "apikey": anon_key,
        "Authorization": f"Bearer {anon_key}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }

    if method == "GET":
        resp = requests.get(full_url, headers=headers, params=params)
    elif method == "POST":
        headers["Prefer"] = "return=representation,resolution=merge-duplicates"
        resp = requests.post(full_url, headers=headers, json=data)
    elif method == "PATCH":
        resp = requests.patch(full_url, headers=headers, json=data, params=params)
    elif method == "DELETE":
        resp = requests.delete(full_url, headers=headers, params=params)
    else:
        raise ValueError(f"Unknown method: {method}")

    if resp.status_code >= 400:
        print(f"   Supabase API error ({resp.status_code}): {resp.text[:200]}")
        return None

    try:
        return resp.json() if resp.text else []
    except Exception:
        return []


def sync_deals(parsed_items, supabase_url, anon_key):
    """Sync parsed TGTG items to Supabase."""
    import requests

    now = datetime.now(timezone.utc).isoformat()

    # Get existing deals
    existing = supabase_request(
        supabase_url, anon_key, "GET", "food_tgtg_deals",
        params={"select": "id,store_name,lat,lng,store_id"}
    ) or []

    # Build lookup by store_id and store_name
    existing_by_store_id = {}
    existing_by_name = {}
    for e in existing:
        if e.get("store_id"):
            existing_by_store_id[e["store_id"]] = e
        if e.get("store_name"):
            existing_by_name[e["store_name"]] = e

    # Track which existing deals we've seen
    seen_ids = set()
    upserted = 0

    for item in parsed_items:
        # Find existing record
        match = None
        if item.get("store_id") and item["store_id"] in existing_by_store_id:
            match = existing_by_store_id[item["store_id"]]
        elif item["store_name"] in existing_by_name:
            match = existing_by_name[item["store_name"]]

        if match:
            # Update existing
            seen_ids.add(match["id"])
            supabase_request(
                supabase_url, anon_key, "PATCH", "food_tgtg_deals",
                data=item,
                params={"id": f"eq.{match['id']}"}
            )
        else:
            # Insert new
            item["id"] = str(uuid.uuid4())
            item["created_at"] = now
            result = supabase_request(
                supabase_url, anon_key, "POST", "food_tgtg_deals",
                data=item
            )
            if result and len(result) > 0:
                seen_ids.add(result[0].get("id", item["id"]))

        upserted += 1

    # Mark unseen deals as sold out (items_available = 0)
    unseen_ids = [e["id"] for e in existing if e["id"] not in seen_ids]
    if unseen_ids:
        for uid in unseen_ids:
            supabase_request(
                supabase_url, anon_key, "PATCH", "food_tgtg_deals",
                data={"items_available": 0, "last_seen": now},
                params={"id": f"eq.{uid}"}
            )
        print(f"   Marked {len(unseen_ids)} deals as sold out")

    return upserted


def main():
    print("🥡 TGTG Sync — Too Good To Go → Food Deals")
    print("=" * 45)

    # Load config
    config = load_config()
    locations = config.get("locations", [])
    if not locations:
        print("❌ No locations configured in tgtg_config.json")
        sys.exit(1)

    print(f"📋 {len(locations)} locations configured")

    # Load Supabase config
    supabase_url, anon_key = load_supabase_config()

    # Load credentials
    creds = load_credentials()
    if not creds:
        print("\n💡 To set up TGTG credentials, run:")
        print("   python3 tgtg_setup.py")
        print("\nExiting gracefully — no sync performed.")
        sys.exit(0)

    # Fetch items from TGTG
    print()
    items = fetch_tgtg_items(creds, locations)
    if not items:
        print("\n📭 No items found from TGTG API")
        sys.exit(0)

    # Parse items
    parsed = [parse_tgtg_item(item) for item in items]
    print(f"\n📦 Parsed {len(parsed)} deals total")

    # Sync to Supabase
    print("\n💾 Syncing to Supabase...")
    synced = sync_deals(parsed, supabase_url, anon_key)
    print(f"\n✅ Synced {synced} deals for {len(locations)} locations")

    # Save updated credentials (tokens may have been refreshed)
    try:
        from tgtg import TgtgClient
        client = TgtgClient(
            access_token=creds["access_token"],
            refresh_token=creds["refresh_token"],
            cookie=creds["cookie"],
            user_id=creds["user_id"],
        )
        new_creds = client.get_credentials()
        if new_creds:
            CREDENTIALS_PATH.write_text(json.dumps(new_creds, indent=2))
            print("🔑 Credentials refreshed and saved")
    except Exception:
        pass  # Non-critical


if __name__ == "__main__":
    main()
