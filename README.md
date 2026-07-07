# Cavallino Logbook

A private service & provenance ledger PWA for exotic car owners.

## Files
- `index.html` — the app itself. Single-file PWA, works offline, data stored in the browser via localStorage.
- `manifest.json` — PWA manifest (name, icons, theme color).
- `sw.js` — service worker, caches the app shell for offline use and "Add to Home Screen" installability.
- `icon-192.png` / `icon-512.png` — app icons.
- `landing.html` — standalone marketing/landing page with pricing and feature breakdown.
- `server/create-checkout-session.js` — Stripe Checkout backend (Netlify Function format).
- `netlify.toml` — Netlify deployment config.
- `MARKETING.md` — launch copy, posting plan, and positioning notes.

## Deploy (GitHub Pages — fastest, no Stripe yet)
1. Push this folder to a GitHub repo (e.g. reuse your `ccgg-cell.github.io` pattern, or a new repo).
2. Enable GitHub Pages on the `main` branch, root folder.
3. Visit `https://<yourname>.github.io/<repo>/index.html` — app works immediately, Pro unlock falls back to a local-test toggle until Stripe is wired.

## Deploy with Stripe (Netlify — recommended for the paid tier)
1. Create a Stripe account if you don't have one, and in the Dashboard create a recurring Price ($7/month) — copy its `price_...` ID.
2. Move `server/create-checkout-session.js` to `netlify/functions/create-checkout-session.js`.
3. Add a `package.json` at the repo root with `stripe` as a dependency (`npm init -y && npm install stripe`).
4. Push the repo to GitHub and connect it in Netlify (or run `netlify deploy --prod` from the CLI).
5. In Netlify → Site settings → Environment variables, set:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PRICE_ID`
   - `SITE_URL` (your deployed URL, no trailing slash)
6. In `index.html`, replace `STRIPE_PUBLIC_KEY` with your real publishable key (`pk_live_...` or `pk_test_...`).
7. Test the full flow in Stripe test mode before flipping to live keys.

## Known limitations / next steps
- Data is local to each browser/device — there's no account system or sync yet. For a true multi-device product, you'd add a backend (e.g. Supabase or Firebase) to sync garage data per user.
- Photo attachments for service entries are described in the original feature list but not yet wired into the UI — straightforward to add as a file input that stores a base64 thumbnail per entry.
- Market value tracking (pulling comps from auction sites) was scoped but not built — would need a backend job calling a search API on a schedule, not something safe to run client-side.
- Icons are placeholder geometric crests generated programmatically — swap in a polished version if you want a sharper App-Store-style icon.
