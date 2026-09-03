# Kerb2Kerb

Source repo for [kerb2kerb.co.uk](https://kerb2kerb.co.uk).

- GitHub: [Hickmxtic/kerb2kerb](https://github.com/Hickmxtic/kerb2kerb)
- Hosting: **none right now** — the Netlify site was scrapped on 3 Sept 2026 (credit-based free plan pauses sites at zero credits). New host TBD; `build.sh` produces a plain static `dist/` that any host can serve.
- DNS: managed at Namecheap (out of scope for this repo). Until a new host is live and DNS is repointed, the domain resolves to nothing.
- WhatsApp contact: [wa.me/447926438553](https://wa.me/447926438553)

## Structure

- `site/` — the public 5-page marketing site (Home, Services, How it works, About, FAQ), served at `/`. Single self-contained `index.html` with client-side hash routing.
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

## Deploying

No host is connected at the moment. `bash build.sh` produces `dist/` (site at `/`, dashboard at `/dashboard/`); point whichever host is chosen next at that folder.
