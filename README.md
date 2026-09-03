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

**Email on the domain** (separate from the records above — don't delete any `MX`/`TXT` records while editing DNS): Namecheap → Domain List → *Manage* → **Domain** tab → *Redirect Email* → add a forwarder `hello@kerb2kerb.co.uk` → `jhickman077@outlook.com`. Free, receive-only, two minutes. If sending *from* the address is ever needed (outreach, ad accounts), add a paid mailbox (Namecheap Private Email or Google Workspace) later.

After that, deploying = push to `main`.
