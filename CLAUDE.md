# Kerb2Kerb — working notes for Claude

Static site (`site/`) + internal ops dashboard (`dashboard/`), each a single
self-contained HTML file (inline CSS/JS, no framework, no build tooling
beyond `build.sh`). See [README.md](README.md) for structure, deploy, and
local dev.

## What Kerb2Kerb is — and isn't

**Goods and luggage only. No passenger ever rides in the van.** Customers
travel separately; their bags meet them at the cruise terminal, airport, or
halls. This is a hard business rule from James, not a preference:

- Never write copy, scripts, WhatsApp replies, or pricing that put a person
  in the vehicle — no "door to terminal with you", no "ride along", no "I'll
  drop you off". The customer's *things* travel; the customer doesn't.
- It's also why the insurance is hire & reward + goods-in-transit and there is
  no private-hire licence — carrying people for money would need one.
- Pricing follows from it: local runs (≤ 15 mi) are quoted **per bag**,
  distance runs **per journey**. Current numbers live in `plans/pricing.md`.

Job types: cruise-terminal luggage runs, airport luggage runs, student
move-in / luggage & parcel runs, small home & office removals, same-day
business courier.

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
- **ops-lead** — rolls the above into one short brief. Its instructions live
  in `.claude/agents/ops-lead.md`, but it's meant to be **read and followed
  directly by the top-level session** (the scheduled routine's own prompt
  points at it) — never invoked via `subagent_type: "ops-lead"`. See the
  platform limit below for why.

**Platform limit — no nested subagents.** A session invoked through the
Agent tool cannot itself call the Agent tool — it errors outright. So the
only safe shape is: top-level session delegates to specialist subagents
(one level deep), then the *top-level session itself* compiles the result
and writes any files. Never design a subagent whose job is to spawn further
subagents — that's what `ops-lead` originally was, and it silently failed
until the top-level session improvised a workaround. The dev pipeline above
doesn't have this problem since architect/coder/tester/manager are always
called directly from the top level, never from within each other.

The scheduled routine runs in an isolated cloud sandbox with a fresh clone of
this repo — it has no access to James's browser, so it can't read the
dashboard's real financial data or send messages on his behalf. Its brief is
research/planning/content output only. Treat that as a hard limit, not a bug.

The routine also writes `dashboard/ops-status.json` (see `ops-lead.md` for
the exact shape) and commits + pushes just that one file — this is the sole
exception to "read-only," and it's what drives the dashboard's live "Ops
Team" panel. Nothing else should ever be committed from that automated run.
**Note:** as of 2026-09-03 the push fails with a 403 whose message names the
actual fix: the Claude GitHub App isn't installed on `Hickmxtic/kerb2kerb`.
James needs to install it at
https://github.com/apps/claude/installations/select_target (pick his
account, select this repo) or re-link GitHub from
https://claude.ai/customize/connectors. Until he has, a failed push is
expected — report it in one line and carry on; don't retry, and don't treat
it as a task failure. The panel then shows whatever was last written by
hand.

## Working style

**One session, one clean job.** Don't run research, drafting, and polishing
in a single unbroken thread — context blurs together and quality drops
("context rot"). Prefer the pattern already used by both pipelines above:
each stage is a separate, focused unit of work that hands off a concrete
result (a plan, a diff, a brief, a status file) to the next stage, rather
than one long session trying to do everything at once.

## Conventions

- No new dependencies, no bundler, no framework migration without asking first.
- Dashboard data lives in `localStorage` only (keys prefixed `k2k_`) — no backend.
- Match the existing inline-style, vanilla-JS, single-file pattern in both
  `site/index.html` and `dashboard/index.html`.
- Hosting: Netlify was scrapped on 2026-09-03 (its credit-based Free plan
  pauses sites at zero credits). No host is connected until James picks the
  replacement — don't assume pushes deploy anything. Never touch DNS/Namecheap.
