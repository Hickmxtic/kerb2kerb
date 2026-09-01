# Kerb2Kerb

Source repo for [kerb2kerb.co.uk](https://kerb2kerb.co.uk), deployed via Netlify.

- Netlify site: `extraordinary-fairy-463006` (site ID `f3b860a5-02eb-4d57-9c21-55fcba749a71`)
- DNS: managed at Namecheap (out of scope for this repo)
- WhatsApp contact: [wa.me/447926438553](https://wa.me/447926438553)

## Structure

- `site/` — the public 5-page marketing site (Home, Services, How it works, About, FAQ). Single self-contained `index.html` with client-side hash routing, no build step.
- `dashboard/` — internal ops dashboard (bookings, debt/emergency fund tracker, income & expenses, idea generator). Data lives in browser `localStorage`, no backend.

## Local development

Just open `site/index.html` in a browser, or serve it:

```bash
npx serve site
```

## Deploying

This repo deploys to the **existing** Netlify site (`extraordinary-fairy-463006`), not a new one.

```bash
netlify deploy --prod --dir=site
```

Confirm you're linked to the right site first with `netlify status` — it must show site ID `f3b860a5-02eb-4d57-9c21-55fcba749a71`.
