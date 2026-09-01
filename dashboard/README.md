# Dashboard

Internal ops dashboard: bookings, debt/emergency fund tracker, income & expenses, portfolio tracker, content idea generator. Single self-contained `index.html`, no build step.

## Data storage

Everything except the Bookings panel is stored in the browser's `localStorage` (keys prefixed `k2k_`) — nothing server-side, nothing shared between devices/browsers.

## Known limitation: live Bookings

The Bookings panel was written to run inside a Claude.ai artifact, where `window.claude.use('mcp')` gives it a live connection to your Google Calendar. That API only exists inside claude.ai's artifact runtime — it does **not** exist on a plain static site like this one on Netlify.

The code already degrades gracefully: on a normal static host, `window.claude` is `undefined`, so it falls into its own fallback path and shows "Live bookings aren't available in this view" instead of erroring. Nothing else on the page is affected.

If you want live bookings back on the standalone version, that needs a real backend integration with the Google Calendar API (OAuth + a server-side call, e.g. a Netlify Function) — a different, larger piece of work from the rest of this migration.
