# Kerb2Kerb

Source repo for [kerb2kerb.co.uk](https://kerb2kerb.co.uk).

- GitHub: [Hickmxtic/kerb2kerb](https://github.com/Hickmxtic/kerb2kerb)
- Hosting: **GitHub Pages** (free, no credits) — see *Deploying* below. Netlify was scrapped on 3 Sept 2026.
- DNS: managed at Namecheap — A records → GitHub Pages, MX → Namecheap Private Email. Never delete the MX/TXT records.
- Business email: `james@kerb2kerb.co.uk`.
- **Kerb2Kerb carries luggage and goods only — never passengers.** No copy anywhere may imply a person rides in the van.
- WhatsApp contact: [wa.me/447926438553](https://wa.me/447926438553)

## Structure

- `site-v2/` — the live public site (nine pages: `/`, `/quote/`, `/cruise-luggage/`, `/student-move-in/`, `/airport-luggage/`, `/removals/`, `/courier/`, `/faq/`, `/terms/`), served at `/`. Plain HTML/CSS/vanilla JS, no framework. `js/quote.js` is the instant-quote engine (rules in `plans/pricing.md`); `js/postcodes.js` is the postcode-district centroid table. Spec: `plans/site-v2-brief.md`.
  - **Two values to paste in once they exist**: the Meta Pixel ID at `site-v2/js/site.js` (`PIXEL_ID`), and the Google Apps Script web-app URL at `site-v2/js/quote.js` (`APPS_SCRIPT_URL`) — setup in `plans/enquiry-form/SETUP.md`. Until then the form falls back to opening WhatsApp with the enquiry pre-typed.
- `site/` — the old one-page site, no longer built or served; kept for reference until it's archived.
- `dashboard/` — internal ops dashboard (bookings, debt/emergency fund tracker, income & expenses, portfolio, idea generator), served at `/dashboard/`. Not linked from the public site nav. Data lives in browser `localStorage` — see [dashboard/README.md](dashboard/README.md) for the one feature (live bookings) that doesn't carry over from the original Claude artifact.
- `build.sh` — assembles `site/` and `dashboard/` into `dist/`, the folder a host serves. Plain bash, no Node/build tooling required.
- `dist/` — build output, gitignored.

## Local development

Edit `site/index.html` or `dashboard/index.html` directly (no build step needed to preview each on its own), or build and serve the combined output the way Netlify will:

```bash
bash build.sh
python3 -m http.server 8000 --directory dist
```

Then visit `http://localhost:8000/` for the site and `http://localhost:8000/dashboard/` for the dashboard.

## Deploying — GitHub Pages

`.github/workflows/pages.yml` runs `build.sh` on every push to `main` and publishes `dist/` to GitHub Pages. Free, no credits, no build limits.

**One-time setup (James):**

1. Repo → **Settings → Pages** → *Build and deployment* → Source: **GitHub Actions**. (The first push after this triggers the deploy; check the *Actions* tab.)
2. Same page → *Custom domain*: `kerb2kerb.co.uk` → Save. Tick **Enforce HTTPS** once the DNS check passes (can take up to an hour).
3. Namecheap → Domain List → kerb2kerb.co.uk → **Advanced DNS**. Delete the old Netlify records, add:
   - `A` record, host `@`, value `185.199.108.153`
   - `A` record, host `@`, value `185.199.109.153`
   - `A` record, host `@`, value `185.199.110.153`
   - `A` record, host `@`, value `185.199.111.153`
   - `CNAME` record, host `www`, value `hickmxtic.github.io`
4. Wait 10–60 minutes, then `https://kerb2kerb.co.uk` serves the site.

**Email on the domain**: `james@kerb2kerb.co.uk` — a Namecheap Private Email mailbox (valid to Sep 2027), webmail at [privateemail.com](https://privateemail.com). Its `MX` records (`mx1`/`mx2.privateemail.com`) and SPF `TXT` record live in Advanced DNS alongside the GitHub Pages records above — **never delete them** when editing DNS. This is the address for the enquiry form, the Meta business account, and anything customer-facing.

After that, deploying = push to `main`.
