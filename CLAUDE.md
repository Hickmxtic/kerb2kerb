# Kerb2Kerb — working notes for Claude

Static site (`site/`) + internal ops dashboard (`dashboard/`), each a single
self-contained HTML file (inline CSS/JS, no framework, no build tooling
beyond `build.sh`). See [README.md](README.md) for structure, deploy, and
local dev.

## Build pipeline for new features

For any non-trivial change to `site/index.html` or `dashboard/index.html` —
a new feature, a new panel, a behavior change with real edge cases, not a
one-line copy/style tweak — run the full pipeline automatically, without
waiting to be asked each time:

1. **architect** subagent — turns the request into a concrete plan (or asks
   a clarifying question first, if something is genuinely ambiguous enough
   to change scope).
2. **coder** subagent — implements the plan.
3. **tester** subagent — tries to break what was just built; reports real
   bugs, or a clean pass.
4. **manager** subagent — independently re-checks the Coder's change and the
   Tester's findings, gives a SHIP / DON'T SHIP call.

Only commit and push once the Manager says SHIP. If DON'T SHIP, send the
Coder back with the Manager's specific fix list, then re-run tester and
manager on the fix before shipping. Summarize each stage briefly as it
happens rather than going silent until the end — this is meant to be
visible work, not a black box.

Skip the pipeline only for trivial one-liners (a copy fix, a color tweak) —
just make those directly.

## Business ops team

Separate from the dev pipeline above, there's a business-ops roster for
running Kerb2Kerb day-to-day — James works full-time elsewhere, so this has
to produce concrete, ready-to-act-on output with minimal supervision:

- **dispatcher** — bookings/schedule review, drafts WhatsApp replies (never sends).
- **bookkeeper** — turns pasted-in numbers into dashboard entries. Cannot read
  the dashboard's real data itself (`localStorage`, browser-only, no backend)
  — only useful when given real figures in the conversation.
- **growth-lead** — researches real local leads and seasonal opportunities.
- **content-strategist** — turns the idea bank into a dated weekly posting plan.
- **editor** — writes scripts/hooks/shot-lists/captions and short-form ad copy.
  Cannot cut or export actual video — no video-editing tool is connected;
  the physical edit stays a manual step this makes fast, not automatic.
- **ops-lead** — rolls the above into one short brief. This is the one the
  scheduled daily/weekly routine runs.

The scheduled routine runs in an isolated cloud sandbox with a fresh clone of
this repo — it has no access to James's browser, so it can't read the
dashboard's real financial data or send messages on his behalf. Its brief is
research/planning/content output only. Treat that as a hard limit, not a bug.

## Conventions

- No new dependencies, no bundler, no framework migration without asking first.
- Dashboard data lives in `localStorage` only (keys prefixed `k2k_`) — no backend.
- Match the existing inline-style, vanilla-JS, single-file pattern in both
  `site/index.html` and `dashboard/index.html`.
- Netlify site `extraordinary-fairy-463006` (ID `f3b860a5-02eb-4d57-9c21-55fcba749a71`)
  auto-deploys from `main` — never touch DNS/Namecheap.
