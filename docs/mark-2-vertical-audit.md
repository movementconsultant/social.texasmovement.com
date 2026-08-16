# Mark 2 vertical audit — social.texasmovement.com

Release-readiness audit performed against actual repository state (build run
fresh, output inspected directly — nothing carried forward from the prior
build's own claims). This repo was audited in isolation as one vertical in
the wider TMI ecosystem release sprint; classification and structure follow
the same governance rules established for `texasmovement.com` and
`alexandermathai.com`.

## Repository and current branch

`movementconsultant/social.texasmovement.com`, branch
`claude/private-shell-scaffold`, PR #1 (open, draft) against `main`. Audited
at commit `9443380` (`HEAD` at audit start: `9443380`, unchanged — this audit
made no code fixes, see §"Launch recommendation" below). Worktree was clean
before and after.

## Existing public hostname/domain if evidenced

None. `astro.config.mjs` declares `site: "https://social.texasmovement.com"`
as the eventual canonical URL and `wrangler.toml` declares a Cloudflare Pages
project shape (`social-texasmovement-com`), but no Cloudflare project has
been created, no DNS has been touched, and nothing has ever been deployed
from this repo or branch. `legacy/CNAME` (preserved, unused) is the only
artifact suggesting a prior hosting configuration, and it lives outside the
build's `public/`-equivalent output path by design.

## Current build/deploy stack

Astro 7.2.2, TypeScript (strict, via `@astrojs/check`), static output
(`output: "static"`, no adapter, `trailingSlash: "never"`). Deploy target is
Cloudflare Pages (`wrangler.toml`, `pages_build_output_dir = "dist"`) —
declared only, not connected. `PUBLIC_PREVIEW` build-time flag controls a
preview/production split identical in shape to the pattern used on
`texasmovement.com` and `alexandermathai.com`.

## CI/build/test result (real command + real output)

All commands run fresh in this audit, from a clean `npm install`:

| Check | Command | Result |
|---|---|---|
| Install | `npm install` | 297 packages, 0 vulnerabilities (`npm audit`: 0 vulnerabilities) |
| Typecheck | `npx astro check` | 0 errors, 0 warnings, 0 hints (18 files) |
| Build (preview, default) | `npm run build` | 5 pages + `robots.txt` + `sitemap.xml` built; `postbuild` guard: `check-public-output: OK — 7 file(s) scanned, 0 violations. (preview=true)` |
| Build (production flag) | `PUBLIC_PREVIEW=false npm run build` | Same 7 outputs built; guard: `check-public-output: OK — 7 file(s) scanned, 0 violations. (preview=false)` |
| Unit tests | `npm test` | `# tests 16 / # pass 16 / # fail 0` |
| Accessibility scan | `npm run test:a11y` | **Could not complete in this audit sandbox** — see note below |

Both `PUBLIC_PREVIEW` modes were independently inspected in the built output,
not just trusted from the guard's pass/fail: preview mode ships
`<meta name="robots" content="noindex, nofollow">`, no canonical link, no
`og:url`, `robots.txt` disallowing all crawling, and an empty
`sitemap.xml`; the production-flag build correctly flips all five —
`index, follow`, a canonical link, `og:url`, an `Allow: /` robots.txt with a
sitemap reference, and one real URL in `sitemap.xml`. The preview banner
(`Preview build — not the live site`) is present only in preview-mode output
and correctly absent from the production-flag build.

A manual, independent grep sweep of both built `dist/` trees for `mailto:`,
`<form`, `<iframe`, `formaction`, `TBD`, `__TBD__`, and all social-platform
domains found in the guard script returned zero hits in every case.

**Accessibility scan note:** `npm run test:a11y` spawns `astro preview` and
drives it with Playwright Chromium + axe-core. In this audit sandbox, page
loads that wait for `networkidle` hang indefinitely because Chromium isn't
configured to use the sandbox's outbound HTTPS proxy (the page's Google
Fonts `<link>` never resolves, so the network never goes idle) — an
environment constraint of this audit container, not a repo defect. Working
around it with an explicit Playwright `proxy` option got two of five routes
scanned (`/` and `/404`, both 0 violations) before the browser process itself
became unstable and crashed mid-run in this sandbox — again consistent with
resource constraints of this specific container, not a code issue. This is
the same class of environment fragility the repo's own
`docs/IMPLEMENTATION_STATUS.md` documented from its original build session
(port collisions there; proxy/stability here). Recommend re-running
`npm run test:a11y` unmodified in a normal CI/dev environment with open
network egress, where it is expected to pass based on the partial results
obtained and the simplicity of the markup involved (semantic HTML, one `h1`
per page, a working skip link, consistent focus styles — all visible by
inspection).

## Real content/pages available

Five routes: `/` (property name, the one approved blurb sentence, a
"Building" lifecycle badge/statement, one link to `texasmovement.com`),
`/404`, `/privacy`, `/terms`, `/accessibility` — the latter three are
explicit "policy pending" placeholder stubs, not real legal text. Plus two
generated endpoints, `robots.txt` and `sitemap.xml`. No events content, no
community/publishing features, no navigation beyond the single page. This
matches the repo's own stated scope exactly.

## Public claims and unsupported-content risks

None found. The homepage's only substantive claim is the single approved
blurb — *"Community, social publishing, and public conversation systems."*
— followed by an explicit, honest "This is being built. It is not yet
open." lifecycle statement. No metrics, testimonials, clients, partnerships,
team members, dates, or business-status claims appear anywhere in rendered
output. The legacy site's prior "Gather" events/ceremony framing was
deliberately excluded (documented in `docs/LAUNCH_BLOCKERS.md` and
`docs/MIGRATION_INVENTORY.md`) rather than carried forward or silently
dropped.

## Social/external links and verification state

Zero social links exist anywhere in this build — not disabled, not
unverified-but-rendered, simply absent (`CLAUDE.md` rule 3, verified by
source and by the postbuild guard's social-domain sweep). The only external
link on the site is `https://texasmovement.com`, the one explicitly approved
ecosystem-hub mention, which is itself a live, real hostname.

## Contact/commerce status

None. No email address, `mailto:` link, form, form action, iframe, or any
other submission/contact surface exists anywhere in source or built output
(`CLAUDE.md` rules 1–2, enforced by the postbuild guard and independently
re-verified in this audit via direct grep of both built `dist/` trees). No
commerce surface of any kind.

## SEO/indexing behavior

Correct and default-safe. `PUBLIC_PREVIEW` defaults to preview mode when
unset (`.env.example`, `src/config/site.ts`), which ships `noindex,nofollow`
on every HTML page, an empty sitemap, and a fully disallowing `robots.txt`.
Flipping to `PUBLIC_PREVIEW=false` correctly switches every one of those
signals at once — independently confirmed in this audit's own build, not
just trusted from the repo's prior documentation. No JSON-LD structured data
is emitted in either mode (a deliberate, documented scope decision — see
`CLAUDE.md` rule 6).

## Accessibility status

Skip link, `focus-visible` states, one `<h1>` per page, semantic landmark
elements (`header`/`main`/`footer`/`nav`), and a responsive layout are all
present by source inspection. Automated axe-core coverage is incomplete for
this audit run — see the CI note above — with a partial 2/5-route result of
0 violations and no reason from source inspection to expect a different
result on the remaining three (structurally near-identical placeholder
pages). Full `npm run test:a11y` re-run in an unconstrained environment
before treating accessibility as fully confirmed.

## Ecosystem classification (Live/Route/Building/Reserve/Archive)

**Building.** A real repository and real, working code exist; nothing is
deployed publicly; the homepage carries an honest "Building" badge and the
single approved sentence of description; there is no external link
suggesting availability and no CTA of any kind. This matches the
expected/default classification stated in this audit's brief, and matches
this property's classification in the wider ecosystem's own
`docs/mark-2-release-audit.md` (`alexandermathai.com`, §4: Social listed as
"Building", minimal shell, not deployed).

## Launch recommendation

Do not launch yet. No code changes are required to keep this repo
release-safe in its current "Building" state — every hard governance rule
(no email/mailto, no forms/iframes, no unverified social links, no TBD
markers, no JSON-LD beyond the allowed scope, no CTA, verbatim blurb only,
correct noindex-by-default) was independently re-verified against real build
output in this audit and found already satisfied. No narrow, high-confidence
release-safety defects were found, so no fixes were made — inventing work
here would itself violate this audit's scope. The one open item is
re-running the a11y scan in an environment with working network egress to
convert the partial 2/5-route pass into a full confirmed result.

## Required owner verification

- Confirm this property's real-world identity/ownership before any scope
  expansion.
- Decide whether/how to reintroduce the legacy "Gather" events/ceremony
  framing — deliberately dropped, not resolved (see
  `docs/LAUNCH_BLOCKERS.md` item 1).
- Supply and approve a confirmed, forwarding contact inbox before any
  contact route (mailto or form) is added.
- Supply and approve a confirmed handle per platform before any social
  icon/link is added.
- Approve real privacy/terms/accessibility policy text (current pages are
  explicit placeholders).
- Explicit decision to flip `PUBLIC_PREVIEW=false` for a real indexable
  launch — a launch decision, not a technical one.
- Approve Cloudflare Pages connection and DNS change when ready to deploy.

## Exact blockers

1. No hosting/DNS connected — nothing is deployed.
2. No confirmed contact inbox — no contact route can be added without one.
3. No confirmed social handles — no social link can be added without one.
4. No real legal/privacy/terms/accessibility policy text — current pages are
   honest placeholders only.
5. The legacy "Gather" events/ceremony framing question is unresolved (not a
   blocker to staying in "Building" state, but blocks any copy expansion
   toward that framing without an explicit decision and, per
   `docs/LAUNCH_BLOCKERS.md`, likely event-specific legal review).
6. Full a11y confirmation (5/5 routes) pending a re-run outside this audit's
   network-constrained sandbox.

## Safe next action

Leave this repo exactly as-is: a small, honest "Building" shell with strong
self-verification tooling (typecheck, unit tests, a postbuild content guard,
an a11y scan script) already in place and passing. The safe next action is
non-code: the owner supplies (a) a decision on the "Gather" framing, (b) a
confirmed contact inbox, and (c) confirmed social handles, if/when this
property is meant to grow beyond a placeholder — none of which this audit
can supply or verify on its own.
