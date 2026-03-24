# Too Good To Go (TGTG) Integration Research

**Date:** 2026-03-24
**Purpose:** Evaluate options for integrating TGTG surplus food data into the Food Deals app

---

## Executive Summary

TGTG has **no public API**. All integration options rely on reverse-engineered mobile app endpoints. The most mature library is `tgtg-python` (Python), which is actively maintained and works as of early 2026. However, TGTG uses **Datadome anti-bot protection**, which can trigger CAPTCHAs and block automated access — this is the primary risk. For a small personal project, **a Python script on the Pi running via cron** using `tgtg-python` is the most practical approach, with the caveat that it may require occasional manual re-authentication.

---

## Options Ranked by Feasibility

### 1. 🏆 `tgtg-python` Library (Recommended)

**What:** Python client for the TGTG mobile API (reverse-engineered)
**Repo:** [ahivert/tgtg-python](https://github.com/ahivert/tgtg-python) — ~1.5k stars
**PyPI:** `pip install tgtg` (latest: v0.18.3)
**Last release:** July 2025 (actively maintained, fixing login/auth issues)
**Status:** Working as of 2025, with periodic breakages when TGTG changes API versions

**What it can do:**
- Login via email (magic link auth)
- List stores by location (lat/lng + radius)
- Get store details
- Get favorites
- Create/manage orders
- Refresh auth tokens automatically

**Data fields available:**
| Field | Available | Notes |
|-------|-----------|-------|
| Store name | ✅ | `store.store_name` |
| Description | ✅ | `item.description` |
| Price | ✅ | `item.item_price.minor_units` (in cents) |
| Original value | ✅ | `item.value_including_taxes.minor_units` |
| Pickup times | ⚠️ | Available in sales window info, not always granular |
| Items available | ✅ | `items_available` (integer count) |
| Location (lat/lng) | ✅ | `store.store_location.location` |
| Cover image | ✅ | `item.cover_picture.current_url` |
| Rating | ✅ | Badges with rating percentage |
| Category | ✅ | `item.item_category` (MEAL, BAKED_GOODS, etc.) |
| Distance | ✅ | Computed from your search coordinates |

**Auth flow:**
1. First login: provide email → TGTG sends magic link email → click link → library receives tokens
2. Subsequent calls: use stored `access_token`, `refresh_token`, `cookie`
3. Tokens auto-refresh, but can expire if unused for extended periods

**Setup:**
```python
from tgtg import TgtgClient

# First-time login (interactive — need to click email link)
client = TgtgClient(email="your-tgtg-account@email.com")
credentials = client.get_credentials()
# Save credentials to file/env for reuse

# Subsequent runs
client = TgtgClient(
    access_token="<saved>",
    refresh_token="<saved>",
    cookie="<saved>"
)

# Fetch nearby items (Redmond, WA area)
items = client.get_items(
    favorites_only=False,
    latitude=47.6740,
    longitude=-122.1215,
    radius=15,  # km
)

for item in items:
    print(f"{item['display_name']}: {item['items_available']} available")
    print(f"  Price: ${item['item']['item_price']['minor_units']/100:.2f}")
    print(f"  Value: ${item['item']['value_including_taxes']['minor_units']/100:.2f}")
```

**Pros:**
- Most complete and maintained library
- Good documentation with example responses
- Handles token refresh
- All the data fields we need

**Cons:**
- Datadome anti-bot can block requests (see Risks section)
- Requires a real TGTG account
- No official support — can break when TGTG updates their API
- First-time auth requires manual email click

---

### 2. `node-toogoodtogo-watcher` (Node.js Alternative)

**What:** Node.js CLI tool for monitoring TGTG favorites
**Repo:** [marklagendijk/node-toogoodtogo-watcher](https://github.com/marklagendijk/node-toogoodtogo-watcher)
**Install:** `npm install -g toogoodtogo-watcher`

**Limitations vs. tgtg-python:**
- Primarily designed for watching favorites (not arbitrary location search)
- More of a notification tool than a data extraction library
- Less flexible for our use case (writing to Supabase)

**When to consider:** If you want to avoid Python entirely and only care about favorite stores. Not recommended for our use case.

---

### 3. Direct API Calls (DIY)

**What:** Call the TGTG API endpoints directly (no library)
**Base URL:** `https://apptoogoodtogo.com/api/`
**Key endpoints:**
- `auth/v3/authByEmail` — initiate login
- `auth/v3/authByRequestPollingId` — poll for email verification
- `auth/v3/token/refresh` — refresh tokens
- `item/v8/` — get item details
- `discover/v1/bucket` — discover items by location

**Pros:** Full control, can implement in any language (JS/TS for Supabase Edge Functions)
**Cons:** Must handle Datadome cookies, user agent spoofing, token management yourself. The `tgtg-python` library already solved all these edge cases.

**Verdict:** Only worth it if you need a JS implementation for Supabase Edge Functions and can't run Python. Even then, port the tgtg-python logic.

---

### 4. Web Scraping

**What:** Scrape toogoodtogo.com website
**Verdict:** ❌ **Not viable.** TGTG is primarily a mobile app. Their website (`toogoodtogo.com`) doesn't expose store/item listings — it's a marketing site. There's no web interface to scrape deals from. The data lives entirely behind the mobile API.

---

### 5. Third-Party Aggregators

**What:** Use another service that aggregates TGTG data
**Verdict:** ❌ **None exist.** There are no public data feeds, RSS feeds, or third-party aggregators that include TGTG deal data. TGTG is a closed ecosystem. Other food surplus apps (Flashfood, FoodHero) are separate services with their own data — they don't aggregate TGTG.

---

## Risks & Concerns

### 🔴 Datadome Anti-Bot (Primary Risk)

TGTG uses **Datadome** (enterprise anti-bot service) to detect and block automated access. This has been the #1 issue for all unofficial libraries since 2023.

**What happens:**
- API requests may receive a CAPTCHA challenge instead of data
- Can happen on login or on data fetching
- Changing IP, user agent, or account doesn't always help
- Residential IPs (like the Pi's home internet) are less likely to be flagged than cloud IPs

**Mitigations:**
- Use residential IP (the Pi at home — good!)
- Don't poll too frequently (every 30-60 min is safe)
- Keep tokens alive by using them regularly
- The `tgtg-python` library includes Datadome handling and cookie management
- If blocked, wait a few hours and retry

### 🟡 Terms of Service

TGTG's Terms of Service almost certainly prohibit automated/programmatic access (standard for mobile apps). However:
- This is a **personal project**, not commercial
- You're just reading data, not placing orders or reselling
- Risk of legal action: essentially zero for personal use
- Risk of account ban: possible but low with conservative polling

### 🟡 Account Requirement

- You need a **real TGTG account** (free to create)
- Use your regular TGTG email
- If the account gets flagged/banned, create a new one
- Recommendation: use a secondary email, not your primary

### 🟢 Rate Limits

No official rate limits documented, but based on community experience:
- Polling every 30-60 minutes is safe
- Polling every 5 minutes will likely get you blocked
- Keep requests to <50/day and you should be fine

---

## Recommended Architecture

### Server-Side Component: Yes, Required

TGTG auth tokens and API calls **cannot be done client-side** (CORS, credentials exposure). You need a server-side component.

**Recommended setup:**

```
┌─────────────────┐     cron (every 30 min)     ┌──────────────┐
│  Pi (Python)    │ ──────────────────────────── │  TGTG API    │
│  tgtg_sync.py   │                              └──────────────┘
│                 │
│  Writes to ──── │ ──────────────────────────── ┌──────────────┐
│                 │      Supabase client          │  Supabase    │
└─────────────────┘                               │  food_tgtg_  │
                                                  │  deals table │
                                                  └──────┬───────┘
                                                         │
                                                  ┌──────┴───────┐
                                                  │  React App   │
                                                  │  (reads via  │
                                                  │   Supabase)  │
                                                  └──────────────┘
```

**Why the Pi and not Supabase Edge Functions:**
1. `tgtg-python` is Python — Edge Functions are Deno/TypeScript
2. Residential IP (Pi) is much less likely to trigger Datadome than cloud IPs
3. Can store auth credentials securely on the Pi
4. Cron job on the Pi is simple to manage

### Implementation Plan

#### Step 1: Install tgtg-python on the Pi
```bash
pip install tgtg supabase
```

#### Step 2: Create the sync script (`tgtg_sync.py`)
```python
#!/usr/bin/env python3
"""Fetch TGTG deals and sync to Supabase."""

import json
import os
from datetime import datetime
from tgtg import TgtgClient
from supabase import create_client

# Config
TGTG_CREDENTIALS_FILE = os.path.expanduser("~/.tgtg_credentials.json")
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_KEY"]

# Redmond, WA coordinates
LATITUDE = 47.6740
LONGITUDE = -122.1215
RADIUS_KM = 15

def load_credentials():
    with open(TGTG_CREDENTIALS_FILE) as f:
        return json.load(f)

def save_credentials(creds):
    with open(TGTG_CREDENTIALS_FILE, "w") as f:
        json.dump(creds, f)

def fetch_tgtg_items():
    creds = load_credentials()
    client = TgtgClient(
        access_token=creds["access_token"],
        refresh_token=creds["refresh_token"],
        cookie=creds["cookie"],
    )

    items = client.get_items(
        favorites_only=False,
        latitude=LATITUDE,
        longitude=LONGITUDE,
        radius=RADIUS_KM,
    )

    # Save refreshed credentials
    new_creds = client.get_credentials()
    save_credentials(new_creds)

    return items

def sync_to_supabase(items):
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

    # Clear old data
    supabase.table("food_tgtg_deals").delete().neq("id", 0).execute()

    # Insert fresh data
    rows = []
    for item in items:
        if item.get("items_available", 0) == 0:
            continue  # Skip sold-out items

        price_cents = item["item"]["item_price"]["minor_units"]
        value_cents = item["item"]["value_including_taxes"]["minor_units"]

        rows.append({
            "store_name": item.get("display_name", "Unknown"),
            "description": item["item"].get("description", ""),
            "price": price_cents / 100,
            "original_price": value_cents / 100 if value_cents > 0 else None,
            "items_available": item.get("items_available", 0),
            "lat": item.get("pickup_location", {}).get("location", {}).get("latitude"),
            "lng": item.get("pickup_location", {}).get("location", {}).get("longitude"),
            # pickup_start/pickup_end would need sales_window parsing
        })

    if rows:
        supabase.table("food_tgtg_deals").insert(rows).execute()

    print(f"[{datetime.now()}] Synced {len(rows)} TGTG deals to Supabase")

if __name__ == "__main__":
    items = fetch_tgtg_items()
    sync_to_supabase(items)
```

#### Step 3: Initial login (one-time, manual)
```python
from tgtg import TgtgClient
import json

client = TgtgClient(email="your-email@example.com")
# Check your email and click the TGTG login link
credentials = client.get_credentials()

with open(os.path.expanduser("~/.tgtg_credentials.json"), "w") as f:
    json.dump(credentials, f)
print("Credentials saved!")
```

#### Step 4: Set up cron on the Pi
```bash
# Run every 30 minutes during reasonable hours (7am-10pm)
*/30 7-22 * * * cd /home/john/.openclaw/workspace/projects/food-deals && python3 scripts/tgtg_sync.py >> /tmp/tgtg_sync.log 2>&1
```

---

## Alternative Approach: Manual Curation

If the TGTG API approach proves too fragile (frequent blocks), a simpler alternative:

1. **Use TGTG normally on your phone**
2. **Manually flag favorite stores** in the TGTG app
3. **Use `tgtg-python` to only fetch favorites** (lighter API usage, less likely to be blocked)
4. This gives you a curated list of known-good stores rather than a full area scan

---

## Cost

- **TGTG account:** Free
- **tgtg-python:** Free (MIT license)
- **Server costs:** $0 (runs on existing Pi)
- **Supabase:** Within free tier (small table, low writes)

---

## Decision Matrix

| Approach | Effort | Reliability | Data Quality | Risk |
|----------|--------|------------|-------------|------|
| tgtg-python + Pi cron | Medium | Medium | High | Datadome blocks |
| Node.js watcher | Medium | Medium | Low (favorites only) | Same Datadome risk |
| Direct API (JS) | High | Medium | High | Same + more work |
| Web scraping | N/A | N/A | N/A | No web UI to scrape |
| Manual curation | Low | High | Medium | None |

---

## Recommendation

**Start with `tgtg-python` on the Pi:**
1. Create a TGTG account (or use existing one)
2. Do the one-time email auth
3. Set up the 30-min cron sync script
4. If it works reliably for a week, integrate the data into the React frontend
5. If Datadome becomes a problem, fall back to favorites-only mode or manual curation

**Key principle:** Don't over-engineer this. Start simple, see if the API is stable enough for your use, then decide how deeply to integrate.
