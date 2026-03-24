# Data Accuracy Audit — 2026-03-24

## Data Pipeline

Deals are **100% manually seeded via SQL migration files**. There is no automated ingestion, scraping, or API integration.

- **Schema:** `supabase/schema.sql` defines the `food_deals` table and contains the initial Eastside Seattle seed data (32 deals)
- **Columbia SC data:** `supabase/migrations/002_seed_columbia_sc.sql` adds 24 deals for Columbia, SC
- **No update mechanism:** Once seeded, deals are static. There's no way to mark deals as expired, no freshness tracking, and no automated verification
- **Sources cited:** Some deals reference source URLs (restaurant websites, Yelp). Columbia SC data references `experiencecolumbiasc.com`, Yelp, and `r/ColumbiYEAH`
- **Too Good To Go table:** `food_tgtg_deals` table exists in schema but has no seed data — appears to be a planned future integration

**Total deals:** 56 (32 Eastside Seattle + 24 Columbia SC)

## Spot Check Results

| Restaurant | City | Deal | Status | Notes |
|---|---|---|---|---|
| Wing Dome Kirkland | Eastside Seattle | Various daily specials (Mon-Thu) | ❌ **CLOSED** | Yelp confirms "CLOSED" as of March 2026. Wing Dome website only lists Greenwood, Pier 56, and Armory locations. **5 deals reference this closed location.** |
| Matador Redmond | Eastside Seattle | Happy Hour deals (multiple days) | ✅ Open | Confirmed open at 7824 Leary Way NE. Active on OpenTable, Yelp (updated 2026). Address correct. Deal descriptions plausible. |
| Japonessa Sushi Cocina | Eastside Seattle | Half-price sushi rolls, $6 apps | ⚠️ **Wrong address** | Restaurant is open but address in seed is `10500 NE 8th St #100` — Yelp/website shows `500 Bellevue Way NE`. Happy hour is actually offered daily (open to 5:30pm, 9pm to close), not just Thursday as listed. |
| Bellevue Brewing Company | Eastside Seattle | Sunday HH, Friday HH | ✅ Open | Confirmed open at 12190 NE District Way. Address correct. Active Yelp listing updated March 2026. |
| Spark Pizza | Eastside Seattle | Monday pizza special, Saturday family deal | ⚠️ **Closed Mondays** | Restaurant is open and address is correct. However, they are **closed on Mondays** (hours: Tue-Sun only), making the Monday deal impossible. Saturday deal plausible. |
| Village Idiot Pizza | Columbia SC | BOGO Wednesdays, HH Thu | ⚠️ **Wrong address** | Restaurant is open (since 1990, 3 locations). Seed says `2009 Greene St` but actual Five Points address is `2009 Devine St`. BOGO Wednesday deal confirmed by experiencecolumbiasc.com. |
| Publico Kitchen & Tap | Columbia SC | Multiple daily specials | ⚠️ **Minor address discrepancy** | Open and active. Seed says `2012 Greene St`, Yelp shows `2013 Greene St`. Deals are plausible — $2 tacos, $4 margaritas consistent with their style. |
| SakiTumi Grill & Sushi | Columbia SC | Half-price sushi Thu, half-price sake Sat | ✅ Open | Confirmed open at 807 Gervais St. Closed Mondays. Active Yelp/Facebook. Address correct. |
| Group Therapy | Columbia SC | 50¢ wings Wednesday | ✅ Open | Confirmed open at 2107 Greene St. Yelp review mentions wing specials. Address correct. |
| The War Mouth | Columbia SC | $8 old fashioned Thursday | ✅ Open | Confirmed open at 1209 Franklin St. Active website, Yelp (updated March 2026). Address correct. |

## Accuracy Assessment

**Overall: ~65-70% of deals are likely still active and accurate.**

### Breakdown:
- **Restaurants still open:** ~90% (Wing Dome Kirkland is the only confirmed closure)
- **Addresses correct:** ~85% (Japonessa, Village Idiot, Publico have wrong addresses)
- **Deals plausible:** ~75% (most happy hour/daily special formats are common and sustainable, but specific prices and terms drift over time)
- **Critical data errors:**
  - Wing Dome Kirkland: **5 deals for a closed restaurant** (Mon, Tue, Wed, Thu specials)
  - Spark Pizza Monday deal: **restaurant is closed on Mondays**
  - Japonessa address is completely wrong (different street)
  - Village Idiot Pizza address uses wrong street name (Greene vs Devine)

### Price Reasonableness (for 2026):
- Eastside Seattle prices look reasonable: $5-8 happy hour pints, $6-12 appetizers, $10 burger combos
- Columbia SC prices look slightly low but plausible for the market: $2 tacos, $5 wings, $3 drafts
- Some prices may have increased since data was researched (March 2026 data created March 14, 2026 — very recent)

## Usefulness Assessment

### For a real user in Eastside Seattle:
- **Moderately useful.** The 27 valid deals cover the major areas (Bellevue, Kirkland, Redmond) with a good mix of cuisines and days of the week.
- **Gaps:** No deals for Bothell, Woodinville, Issaquah, or Sammamish. Heavy on Mexican/wings, light on Asian cuisine (surprising for the Eastside). No fast-casual or chain deals beyond Red Robin and Wingstop.
- **Freshness risk:** Without a validation mechanism, deals will silently go stale.

### For a real user in Columbia SC:
- **Moderately useful.** Good coverage of Five Points and The Vista (the main nightlife/dining areas). 
- **Gaps:** No deals for Northeast Columbia, Irmo, Lexington, or Forest Acres. Missing major Columbia institutions (e.g., Lizard's Thicket, Rush's, Zesto). No breakfast or lunch-only deals.
- **Address errors** would hurt trust — a user navigating to 2009 Greene St instead of 2009 Devine St would end up in the wrong place.

### Overall gaps across both cities:
1. **No deal verification dates** — users can't tell how fresh the data is
2. **No hours of operation** — can't tell if a restaurant is even open for a given deal day
3. **No user reporting** — no way for users to flag closed restaurants or expired deals
4. **No photos or ratings** — bare-bones data compared to Yelp/Google
5. **Limited geographic coverage** — focused on small areas within each city
6. **No seasonal deals** — schema only supports recurring weekly deals, not limited-time promotions

## Recommendations

### Immediate (fix data quality):
1. **Remove all Wing Dome Kirkland deals** (5 entries) — restaurant is confirmed closed
2. **Remove or reschedule Spark Pizza Monday deal** — restaurant is closed Mondays
3. **Fix Japonessa address** to `500 Bellevue Way NE, Bellevue, WA 98004`
4. **Fix Village Idiot Pizza address** to `2009 Devine St, Columbia, SC 29205`
5. **Fix Publico address** to `2013 Greene St, Columbia, SC 29205`

### Short-term (improve data model):
6. **Add `last_verified_at` column** — timestamp for when a deal was last confirmed active
7. **Add `is_active` boolean** — allow soft-deleting stale deals without losing data
8. **Add `hours_note` field** — e.g., "4-6pm only" or "all day" to complement day_of_week
9. **Add latitude/longitude** — enable map-based browsing and distance calculations

### Medium-term (improve data sourcing):
10. **Automated web scraping** — scrape restaurant websites and Yelp for menu/deal changes
11. **User-submitted deals** — allow users to submit and upvote deals (requires auth)
12. **Google Places API integration** — verify restaurant open/closed status automatically
13. **Deal expiration alerts** — flag deals older than 90 days without verification

### Long-term (scalability):
14. **Crowdsourced verification** — "Is this deal still active?" prompts with community voting
15. **Multi-city expansion pipeline** — standardized process for adding new cities
16. **Restaurant API partnerships** — direct data feeds from restaurant POS/menu systems
