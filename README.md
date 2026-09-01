# Kerb2Kerb

Source repo for [kerb2kerb.co.uk](https://kerb2kerb.co.uk), deployed via Netlify.

- Netlify site: `extraordinary-fairy-463006` (site ID `f3b860a5-02eb-4d57-9c21-55fcba749a71`)
- GitHub: [Hickmxtic/kerb2kerb](https://github.com/Hickmxtic/kerb2kerb) — linked to the Netlify site for auto-deploy on push to `main`
- DNS: managed at Namecheap (out of scope for this repo)
- WhatsApp contact: [wa.me/447926438553](https://wa.me/447926438553)

## Structure

- `site/` — the public 5-page marketing site (Home, Services, How it works, About, FAQ), served at `/`. Single self-contained `index.html` with client-side hash routing.
- `dashboard/` — internal ops dashboard (bookings, debt/emergency fund tracker, income & expenses, portfolio, idea generator), served at `/dashboard/`. Not linked from the public site nav. Data lives in browser `localStorage` — see [dashboard/README.md](dashboard/README.md) for the one feature (live bookings) that doesn't carry over from the original Claude artifact.
- `build.sh` — assembles `site/` and `dashboard/` into `dist/`, which is what actually gets deployed. Plain bash, no Node/build tooling required.
- `dist/` — build output, gitignored, regenerated on every deploy.

## Local development

Edit `site/index.html` or `dashboard/index.html` directly (no build step needed to preview each on its own), or build and serve the combined output the way Netlify will:

```bash
bash build.sh
python3 -m http.server 8000 --directory dist
```

Then visit `http://localhost:8000/` for the site and `http://localhost:8000/dashboard/` for the dashboard.

## Deploying

Push to `main` and Netlify auto-deploys `extraordinary-fairy-463006` (site ID `f3b860a5-02eb-4d57-9c21-55fcba749a71`) via `build.sh` → `dist/`. No manual deploy step needed.
