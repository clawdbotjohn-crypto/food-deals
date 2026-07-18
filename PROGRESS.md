# Food Deals — Progress

**Created:** 2026-03-14
**Status:** MVP Build
**Live URL:** https://salmon-forest-04b26e91e.1.azurestaticapps.net
**GitHub:** https://github.com/clawdbotjohn-crypto/food-deals
**Repo:** local at projects/food-deals/

## Vision

Two-part food deals finder:
1. **Weekly Recurring Deals** — Curated database of local restaurant specials organized by day of week (Taco Tuesday $2, Half-price sushi Wednesday, etc.) for the Redmond/Bellevue/Seattle area
2. **Too Good To Go Integration** — Surface best TGTG surplus food deals nearby, detect scheduling patterns so users can claim early, highlight cheapest/most-discounted items

## MVP Scope (Session 1 Target)

Build a working web app that users can visit and immediately see today's food deals.

### P0 — Must Have for MVP
- [x] React + Vite web app with Tailwind CSS
- [x] Day-of-week tabbed interface (Mon-Sun) showing deals for each day
- [x] Supabase backend with `food_deals` table
- [x] Seed data: 30 real recurring deals in Redmond/Bellevue/Eastside area
- [x] Location/area display (Eastside Seattle)
- [x] Deploy to Azure Static Web Apps
- [x] Mobile-friendly responsive design

### P0 — John's Priorities (Mar 24)
- [x] **Geolocation + default city:** Browser geolocation → Nominatim reverse geocoding → nearest city match. Defaults to Columbia SC. City selector dropdown in header. 46 Columbia SC deals seeded. (2026-03-24)
- [x] **Data accuracy audit:** Full audit documented in `docs/DATA-AUDIT.md`. ~65-70% accuracy. Found 5 Wing Dome deals for closed location, wrong addresses for Japonessa/Village Idiot/Publico, Spark Pizza Monday deal impossible (closed Mondays). Recommendations logged. (2026-03-24)
- [x] **Too Good To Go integration:** Research complete (docs/TGTG-RESEARCH.md). Built tgtg_sync.py + tgtg_setup.py scripts, added city/store_id/category/cover_image/rating columns to tgtg_deals table, updated TGTGSection frontend to show real data. **Blocker:** John needs to run tgtg_setup.py to authenticate with a TGTG account before data flows. (2026-03-24)
- [x] **App completeness / missing screens:** Added bottom navigation (Deals/Favorites/About), deal detail view with map link + share, favorites with localStorage persistence, About page with disclaimer. App feels complete. (2026-03-24)

### P1 — After MVP
- [ ] TGTG schedule pattern detection (which stores post when, price trends)
- [x] Deal submission form (users can submit deals they know about) — ✅ 2026-07-10: Full form with validation, Supabase insert, new "Submit" nav tab (PR #2, needs `submitted_deals` table migration)
- [ ] Price alerts / daily digest notification
- [x] Search and filter by cuisine type, price range (search bar + cuisine chips implemented, 2026-03-24)

### P2 — Future
- [ ] Admin panel for deal management
- [ ] Deal verification/voting (confirm still active)
- [x] Map view of deals (Leaflet/OpenStreetMap, list/map toggle, markers with popups, 2026-03-24)
- [ ] Multi-city expansion
- [ ] TGTG card accessibility (role="button", tabIndex, keyboard handler)

## Core Flows
1. Open app → see today's deals immediately
2. Switch between days of week → see that day's deals
3. View deal details (restaurant, price, times, location)
4. See TGTG surplus deals section (P1)
5. Submit a new deal (P1)

## Tech Stack
- **Frontend:** React + Vite + Tailwind CSS + TypeScript
- **Backend:** Supabase (shared project `uyqhmcjoddmocgybbyib` — use `food_deals` schema or prefixed tables)
- **Hosting:** Azure Static Web Apps
- **Data:** Seed with web-researched local deals, later add TGTG API

## Log

### QA Findings — 2026-07-10 to 2026-07-12
- [x] **UX: Deal card clickability** — QA flagged 3 days in a row (Jul 10-12). **Root cause:** Stale deployment — root `/assets/` had old build without `onClick` handler. Source code (`DealCard.tsx`) already had `onClick={onSelect}` and `cursor-pointer` since Mar 24. **Fix (Jul 18):** Rebuilt from source, updated root assets to match `app/dist/`. PR opened. Deploy will fix.
- [x] **Day tabs** — ✅ PASS (verified 3x)
- [x] **Deals display** — ✅ PASS

### Discovered — 2026-03-24
- [x] **Accessibility: DealDetail modal** — ✅ Fixed 2026-07-10: role="dialog", aria-modal, aria-labelledby, focus trap, escape key close, aria-label on close button (PR #1)
- [ ] **Geolocation city matching** — `.replace(' sc', '').replace(' wa', '')` is fragile/hardcoded, works for current cities but won't scale to multi-city

### 2026-03-24
- **Full session: All P0 tasks completed**
  - Geolocation + city selector with Columbia SC default
  - 46 Columbia SC deals seeded (real restaurants)
  - Data accuracy audit — found/fixed 5 closed Wing Dome deals, wrong addresses, impossible Monday deal
  - Added `last_verified_at` and `is_active` columns for data quality tracking
  - TGTG integration: research doc, Python sync/setup scripts, frontend display, Supabase schema updates
  - App completeness: bottom nav, deal detail view, favorites (localStorage), About page
  - QA review: clean build, good types, only minor a11y issues logged above
  - All pushed to GitHub, auto-deploying via GitHub Actions

### 2026-03-14
- Project initialized
- MVP-first approach (skip full planning, build working app in session 1)
- **MVP BUILD SESSION:**
  - Supabase: Created `food_deals` + `food_tgtg_deals` tables with RLS
  - Seeded 30 real deals across all 7 days (Wing Dome, Matador, Red Robin, Japonessa, etc.)
  - React app built: day-of-week tabs, deal cards, TGTG placeholder, mobile-first
  - Deployed to Azure SWA via GitHub Actions (ARM64 Pi couldn't run SWA CLI directly)
  - Live at: https://salmon-forest-04b26e91e.1.azurestaticapps.net
