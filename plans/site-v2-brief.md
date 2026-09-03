# Kerb2Kerb site v2 — build brief

Decided with James on 2026-09-03. This is the spec the coder builds from and
the tester/manager check against. Anything marked **[ask]** is still waiting
on an answer and ships with a safe default until then.

## What the site is for

One job: **turn ad traffic into enquiries the business can act on.** Every
page ends at the same two buttons — *Get an instant price* and *WhatsApp
James*. No blog, no "about us" essay, no features that don't move a visitor
toward a booking.

## Non-negotiables

- **Luggage and goods only, never passengers.** Say it plainly, early, and
  in the FAQ. No word on the site may imply a person rides in the van.
- **Never promise a slot.** One driver who also works Flex shifts. The site
  takes a *request* with a preferred time; James confirms by WhatsApp. Copy
  uses "request", "I'll confirm", "book ahead" — never "guaranteed",
  "instant booking", "same-day guaranteed".
- Same name, same colours (orange `#E05B2B` accent, ink `#10202E`, off-white
  `#F3F6F7`, Big Shoulders Display + IBM Plex Sans/Mono). New structure,
  new strategy — not a re-skin.
- Static HTML/CSS/JS, no framework, no build tooling beyond `build.sh`.
  Hosted on **GitHub Pages** (free, no credits). Multi-page is fine now —
  separate HTML files, shared CSS.

## Pages (each is a landing page ads can point at)

| Path | Purpose | Hero line (draft) |
|---|---|---|
| `/` | Cruise-led homepage + all services | *Your luggage travels. You travel light.* Sub: door-to-terminal luggage runs for Southampton cruises, from £12 a case. |
| `/cruise-luggage/` | Cruise deep page: how it works, timing around sailings, per-bag price, terminals covered, FAQ | *Cases collected from your door, waiting at the terminal.* |
| `/student-move-in/` | Seasonal page, live **before 10 Sept**; parents are the audience | *Halls move-in: £35 flat, door to their room.* |
| `/airport-luggage/` | Southampton Airport local runs + London airports at fixed prices | *Heathrow £245, Gatwick £265, up to 6 bags — fixed.* |
| `/removals/` | Small home/office moves + Marketplace collections | *Small moves, one van, £35 an hour.* |
| `/courier/` | Same-day business courier | *£35 minimum, £1.50 a mile, one driver the whole way.* |
| `/quote/` | The instant quote tool (also embedded on the homepage) | — |
| `/faq/`, `/terms/` | Trust + the fine print | — |

Shared header: logo, nav (Cruise · Student · Airport · Removals · Courier ·
Prices), sticky **WhatsApp** button. Shared footer: "Kerb2Kerb — luggage
and goods, kerb to kerb. Southampton and 20 miles. Sole trader, insured for
goods in transit." + WhatsApp number + form link.

## The instant quote tool (the conversion engine)

Inputs: **job type** (cruise luggage / airport luggage / student move-in /
luggage-parcel / removals / courier), **pickup postcode**, **drop-off**
(for cruise/airport: a dropdown of terminals/airports instead of a
postcode), **number of bags** (or "van-load" for moves), **preferred date +
time window**.

Logic — straight from `pricing.md`:
- Distance from the postcode-district table (reuse the calculator artifact's
  offline dataset — the coder should extract it from the saved artifact
  HTML at `tool-results/artifact-ccc560e4-*.html`, not rebuild it).
- Under 15 miles + luggage job → **per bag**: £12/bag, £30 minimum.
- Otherwise → callout + per-mile from the table; London airports →
  fixed £245/£265 (+£5/bag over 6).
- Student move-in → £35 flat inside Southampton, +£1.20/mile outside.
- Removals → "£35/hour, 2-hour minimum — send a photo of the load for a
  fixed price" (no calculated number; hand-quoted).
- Courier → £35 + £1.50/mile.
- Output: **one number**, plus what's included (door to door, X bags, no
  VAT) and the two buttons: **Request this** (opens the form pre-filled) and
  **WhatsApp James** (opens wa.me with the quote pre-typed in the message).

Never show £0.00: if inputs are incomplete, the button reads "Fill in the
details for a price" (the old calculator's known bug).

## Enquiry form → Google Sheet

Fields: name, WhatsApp number, job type, pickup, drop-off, bags/load,
preferred date & time window, the quoted price (hidden, prefilled), notes.

Backend: a Google Apps Script web app in James's Google account that
appends a row to a Sheet (`Kerb2Kerb enquiries`) and emails him. Free, no
third party, and — the point — the **dispatcher agent can read that Sheet**
through the connected Google Drive, so enquiries become visible to the
ops team without James pasting them in. Setup steps for James go in the
README. Until the script exists, the form falls back to opening WhatsApp
with the details pre-typed, so nothing is ever lost.

## Trust block (every page)

- **Insurance (confirmed, publish this):** *Goods in transit insured up to
  £25,000 · Public liability £5,000,000 · Hire & reward courier cover ·
  Fully comprehensive vehicle insurance.* Insurers: Somerset Bridge
  Insurance and Novus Insurance — name them in the FAQ answer to "Is my
  luggage insured?", not in the hero. Never say "per load" or "per item"
  unless the policy wording is checked; "up to £25,000" is safe.
- "One van, one driver — that's me, James." Photo **[ask: van/James photos;
  default: none, typographic design]**
- What fits: **2019 Citroën Dispatch** — "fits 15+ large suitcases, or a studio/one-bed's boxes in one load". Use the model name; it reads as real, not stock.
- Reviews: none yet — omit the section rather than fake it; add the block
  when the first three exist.

## Policies (proposed defaults — James confirms)

- Free cancellation up to 24 hours before; inside 24h, £15 callout.
- Bags photographed at collection and delivery; damage claims go through
  the goods-in-transit insurance.
- Waiting time: first 15 min free, then £10 per 15 min (from pricing.md).
- No VAT (sole trader under threshold) — say so, it's a selling point.

## Measurement

- Meta Pixel on every page, with a **Lead** event on form submit and on
  the WhatsApp button click (so the cruise and student ad sets optimise for
  enquiries, not clicks).
- A minimal cookie notice (UK PECR) that only loads the Pixel after
  consent. No other analytics.
- Every enquiry carries `?src=` from the ad URL into the form's hidden
  channel field → the Sheet shows which ad set produced which enquiry.

## Hosting & DNS (James's two DNS records)

- GitHub Pages via the staged `.github/workflows/pages.yml` (builds
  `dist/`), `site/CNAME` = `kerb2kerb.co.uk`.
- Namecheap: `A` records for `@` → `185.199.108.153`, `185.199.109.153`,
  `185.199.110.153`, `185.199.111.153`; `CNAME` for `www` →
  `hickmxtic.github.io`. Then in the repo: Settings → Pages → custom
  domain `kerb2kerb.co.uk`, enforce HTTPS.

## Build order (dev pipeline, one job per stage)

1. **architect** (this brief) → 2. **coder** builds `/`, `/quote/`,
`/student-move-in/`, `/cruise-luggage/` first (the pages ads will point at
this week), then the rest → 3. **tester** (quote logic against pricing.md,
no £0.00, no passenger language anywhere — grep for "you'll be", "pick you
up", "ride", "passenger", "transfer with", mobile widths) → 4. **manager**
ship/don't-ship → push → Pages live → James repoints DNS.
