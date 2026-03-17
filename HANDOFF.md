# Food Deals — Handoff

## Status: MVP COMPLETE ✅

**Live URL:** https://salmon-forest-04b26e91e.1.azurestaticapps.net
**GitHub:** https://github.com/clawdbotjohn-crypto/food-deals

## What Was Built (2026-03-14)

### Supabase Backend
- `food_deals` table with 30 real Eastside Seattle deals (all 7 days covered)
- `food_tgtg_deals` table (placeholder for TGTG integration)
- RLS enabled with public read access
- Schema saved in `supabase/schema.sql`
- Supabase project: `uyqhmcjoddmocgybbyib`

### React Frontend
- React + Vite + TypeScript + Tailwind CSS
- Day-of-week tabs (today selected by default)
- Deal cards with restaurant, description, prices, savings %, cuisine tags, addresses
- Loading skeletons, empty states
- TGTG "Coming Soon" section
- Mobile-first responsive design

### Deployment
- Azure Static Web Apps (Free tier, West US 2)
- GitHub Actions CI/CD: push to `master` branch auto-deploys
- Resource group: `joinme` (shared with other projects)

## Last Session: 2026-03-16 (QA Sweep)
- All 3 testable core flows pass (load today's deals, switch days, view deal details)
- TGTG and deal submission flows are P1 — not yet built, placeholders present
- No bugs found, no code changes needed

## Next Steps (P1)
- Too Good To Go API integration
- User deal submission form
- More deals research + ongoing curation
- Search/filter by cuisine, price range
- User location input

## Deployment Notes
- SWA CLI doesn't work on ARM64 (Pi) — use GitHub Actions
- Future deploys: `cd app && npm run build` then push `dist/` to GitHub
