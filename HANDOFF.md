# Food Deals — Handoff

## Last Session: 2026-03-24

### Done This Session
- ✅ **Geolocation + city selector** — Browser geolocation → Nominatim → nearest city match, defaults to Columbia SC, city dropdown in header
- ✅ **Columbia SC data** — 46 real deals seeded (Publico, D's Wings, Village Idiot, SakiTumi, etc.)
- ✅ **Data accuracy audit** — docs/DATA-AUDIT.md, ~65-70% accuracy, found/fixed closed restaurants, wrong addresses
- ✅ **Data quality fixes** — Removed Wing Dome Kirkland (closed), fixed Japonessa/Village Idiot/Publico addresses, removed impossible Spark Pizza Monday deal, added `last_verified_at` and `is_active` columns
- ✅ **TGTG integration** — Research doc (docs/TGTG-RESEARCH.md), Python sync/setup scripts (scripts/), Supabase schema updates, frontend TGTGSection reads real data
- ✅ **App completeness** — Bottom nav (Deals/Favorites/About), deal detail modal, favorites via localStorage, About page
- ✅ **Search + filter** — Search bar + cuisine filter chips
- ✅ **Map view** — Leaflet/OpenStreetMap with markers, list/map toggle

### Blockers
- **TGTG auth:** John needs to run `python3 projects/food-deals/scripts/tgtg_setup.py` to authenticate with a TGTG account before surplus food data flows

### Next Session Priorities
1. Fix the a11y issues found in QA review (DealDetail modal needs role="dialog", aria-modal, focus trap)
2. TGTG schedule pattern detection (P1)
3. Deal submission form (P1) 
4. Price alerts / daily digest notification (P1)
5. Admin panel for deal management (P2)
6. Deal verification/voting system (P2)

### Build Status
- ✅ `npm run build` passes (chunk size warning from Leaflet, non-blocking)
- All pushed to GitHub, auto-deploying via GitHub Actions
- Live at: https://salmon-forest-04b26e91e.1.azurestaticapps.net
