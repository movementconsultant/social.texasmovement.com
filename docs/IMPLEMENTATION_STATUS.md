# Implementation Status

Status as of the initial private/preview shell build (branch
`claude/private-shell-scaffold`).

## Done

- `main` untouched; all work on `claude/private-shell-scaffold`, branched
  fresh from `main`.
- Prior `main` content (`index.html`, `meta-tags.html`, `og-image.png`,
  `og-square.png`, `README.md`, `CNAME`) moved verbatim into `legacy/` via
  `git mv` — history preserved, nothing deleted. See
  `docs/MIGRATION_INVENTORY.md`.
- Astro + TypeScript scaffold, `output: "static"`, `wrangler.toml` for
  Cloudflare Pages (no adapter, no project created).
- Self-contained `src/config/site.ts` — no vendoring of `@tmi/constants`.
- Homepage (`/`) with exactly: property name, the one approved blurb
  sentence (verbatim), a "Building" lifecycle statement, and one plain
  ecosystem mention linking to `texasmovement.com`. No CTA.
- 404 page, `/accessibility`, `/privacy`, `/terms` (honest stubs, no legal
  claims).
- `PUBLIC_PREVIEW` convention wired through robots meta, `robots.txt`,
  `sitemap.xml`, canonical-link emission, and a visible preview banner.
  Defaults to preview mode.
- OG/Twitter metadata, canonical URL helper. **No JSON-LD** — see
  `CLAUDE.md` rule 6 and `docs/SITE_ARCHITECTURE.md` for why omitting
  structured data entirely was the safe reading of the "bare name only"
  boundary.
- Skip link, focus-visible states, semantic headings, responsive layout.
- Postbuild public-output guard (`scripts/check-public-output.mjs`), wired
  as `postbuild`.
- Unit tests for the guard's detection logic and `site.ts`'s helpers
  (`tests/*.test.mjs`, run via `node --test`).
- axe-core a11y scan script (`scripts/a11y-scan.mjs`) against every built
  route, using the pre-installed Chromium (no `playwright install` run).

## Checks run and results

| Check | Command | Result |
|---|---|---|
| Typecheck | `npx astro check` | 0 errors, 0 warnings, 0 hints (18 files) |
| Build | `npm run build` (includes `postbuild` guard) | Success — 5 pages + robots.txt + sitemap.xml built, guard: 0 violations across 7 files |
| Unit tests | `npm test` | 16/16 passed |
| Accessibility | `npm run test:a11y` | `/`, `/404`, `/accessibility`, `/privacy`, `/terms`: 0 axe-core violations each |
| Forbidden-string sweep | Case-insensitive grep of `dist/` for `mailto:`, `@texasmovement.com`, `@alexandermathai.com`, `TBD`, `__TBD__`, `lexmathai`, `docs.google.com/forms`, `<iframe`, `linkedin.com`, `instagram.com`, `tiktok.com` | 0 hits on all 10 terms |

## An environment-specific issue found and fixed during validation

This build environment runs several sibling repos' `astro preview` servers
concurrently, in what turned out to be a **shared network namespace across
sessions** — `ps aux` showed multiple other sessions' `astro preview --port
4321` processes running at the same time as this repo's. Astro/Vite falls
back silently to the next free port when the requested one is taken, so a
script that fetches the port it *asked for* (rather than the port actually
bound) can end up scanning or screenshotting a **different site entirely**.
This was caught mid-build: an early ad hoc screenshot came back rendering
"Texas Movement Distribution" content while pointed at `localhost:4322`,
and re-checking `ps aux`/`astro preview status` confirmed this repo's own
preview server had actually bound to a different port than requested.

Fixed by rewriting `scripts/a11y-scan.mjs` (and the throwaway screenshot
script used for visual verification, not committed) to: (1) parse the
port Astro actually bound from its own stdout instead of assuming the
requested one, and (2) sanity-check the fetched homepage body contains
`SITE.name` ("Texas Movement Social") before trusting any scan or
screenshot result against it. All results in the table above are from the
hardened script, confirmed bound at a collision-free port
(`http://127.0.0.1:38261`, sanity check passed) — not the earlier,
unreliable run. The postbuild guard and unit tests never touch the
network, so they were unaffected by this issue throughout.

## Not done (by design — see docs/LAUNCH_BLOCKERS.md)

- No CTA of any kind — omitted per the safe-default option in the brief.
- No social links (none confirmed).
- No structured data (no JSON-LD emitted at all).
- Not set to indexable (`PUBLIC_PREVIEW` stays default-on).
- No deploy has been triggered; no Cloudflare project created; no DNS
  touched.
- No pages beyond the routes listed above — this is a shell, not the full
  site.
- The legacy "Gather" events/ceremony product framing was not carried
  forward or resolved — flagged for the owner in
  `docs/LAUNCH_BLOCKERS.md` and `docs/MIGRATION_INVENTORY.md`.

## Open questions / genuine ambiguity

None blocking this draft PR. Two judgment calls worth surfacing explicitly:

1. **CTA:** the brief allowed either an inert CTA badge or no CTA at all.
   Chose no CTA — the property's real-world role (per the wider ecosystem
   manifest) involves events/gatherings, and even an inert "coming soon"
   badge risked reading as participation-shaped in a way a bare lifecycle
   statement doesn't. This is a judgment call, not a hard rule; see
   `docs/PROJECT_BRIEF.md`.
2. **JSON-LD:** the brief permits structured data no richer than "the
   property's own bare name." Chose to omit JSON-LD entirely rather than
   ship a single-field `Organization` block, since even `name`-only
   Organization schema without a `url` is unusual and every richer variant
   the legacy site used was exactly the kind of scope creep the boundary
   was written to prevent. Reversible later with an explicit scope
   decision — see `docs/LAUNCH_BLOCKERS.md` item 6.

Nothing legal/medical/financial/reparations-claims-adjacent came up for
this property.
