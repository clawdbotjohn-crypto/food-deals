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
- [ ] **Geolocation + default city:** Use browser geolocation API to detect user's location. If denied/unavailable, default to Columbia SC (app is primarily for John's cousin). Currently hardcoded to Eastside Seattle — needs to be dynamic.
- [ ] **Data accuracy audit:** Audit how deal data is sourced/seeded. Are the current 30 deals accurate and still active? Document the data pipeline. If deals are just manually seeded, note that. Assess how useful the current data actually is for a real user.
- [ ] **Too Good To Go integration:** Research TGTG API/scraping options. Is there a public API? Unofficial libraries? What's the best approach to pull nearby surplus deals and display them? This likely needs investigation before implementation — do the research, document findings, then implement if feasible.
- [ ] **App completeness / missing screens:** The app currently just has day tabs. Evaluate what's missing — homescreen? About page? Settings? Deal detail view? Navigation? Make the app feel complete, not like a single-page prototype.

### P1 — After MVP
- [ ] TGTG schedule pattern detection (which stores post when, price trends)
- [ ] Deal submission form (users can submit deals they know about)
- [ ] Price alerts / daily digest notification
- [ ] Search and filter by cuisine type, price range

### P2 — Future
- [ ] Admin panel for deal management
- [ ] Deal verification/voting (confirm still active)
- [ ] Map view of deals
- [ ] Multi-city expansion

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

### 2026-03-14
- Project initialized
- MVP-first approach (skip full planning, build working app in session 1)
- **MVP BUILD SESSION:**
  - Supabase: Created `food_deals` + `food_tgtg_deals` tables with RLS
  - Seeded 30 real deals across all 7 days (Wing Dome, Matador, Red Robin, Japonessa, etc.)
  - React app built: day-of-week tabs, deal cards, TGTG placeholder, mobile-first
  - Deployed to Azure SWA via GitHub Actions (ARM64 Pi couldn't run SWA CLI directly)
  - Live at: https://salmon-forest-04b26e91e.1.azurestaticapps.net
