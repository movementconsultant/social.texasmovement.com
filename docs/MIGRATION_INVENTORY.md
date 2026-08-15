# Migration Inventory

Survey taken at the start of this build, before any scaffolding was
touched.

## Branches at time of survey

| Branch | Head SHA | Notes |
|---|---|---|
| `main` | `f12f42e72106cc7c74b6257b22ce8e86284e520a` | Live production content. Static HTML + CNAME, no build tooling. Commit message: "Update contact email in index.html". |
| `claude/private-shell-scaffold` | (this branch, created fresh from `main`) | This build. |

No other branches existed at survey time. `origin/HEAD` points at `main`.

## Every file in the repo at start of work (on `main`)

| Path | Purpose | Referenced by |
|---|---|---|
| `CNAME` | GitHub Pages custom-domain file, content: `social.texasmovement.com` | GitHub Pages hosting config (not linked from HTML) |
| `README.md` | "OG kit" install notes for `og-image.png`/`og-square.png`/`meta-tags.html` | Not linked from any page; internal maintainer doc |
| `index.html` | The live homepage. Full page: hero, "who it's for", a dedicated "Gather" events/ceremony section, ecosystem connections, FAQ, and a contact section with a `mailto:Social@TexasMovement.com` link. Also carries three `application/ld+json` blocks (Organization, WebSite, BreadcrumbList). | Served at `/` |
| `meta-tags.html` | A head-tag snippet reference fragment (OG/Twitter meta only) meant to be pasted into `<head>`, per `README.md`. | Referenced only by `README.md`'s install instructions |
| `og-image.png` | 1200×630 PNG, 8-bit RGB. Open Graph / Twitter card image. | Referenced by `meta-tags.html`'s own OG tags (`index.html`'s actual `og:image`/`twitter:image` instead point at `https://texasmovement.com/05_banner_header.png`, an image on the parent TMI domain, not this file) |
| `og-square.png` | 1200×1200 PNG, 8-bit RGB. Square variant for feed/profile use. | Not referenced by any HTML in this repo; distributed via the "OG kit" for manual social-profile use per `README.md` |

None of the above files were orphaned in the sense of "unused code" — every
file is either served directly or is real install documentation for a real
(if partially unwired) asset kit.

## CNAME content

```
social.texasmovement.com
```

Exact, verbatim, single line, no trailing content beyond a newline.

## What this build did with the above

**Nothing was deleted.** `git mv` was used for every file so history is
preserved:

- `index.html` → `legacy/index.html`
- `meta-tags.html` → `legacy/meta-tags.html`
- `og-image.png` → `legacy/og-image.png`
- `og-square.png` → `legacy/og-square.png`
- `README.md` → `legacy/README.md`
- `CNAME` → `legacy/CNAME`

**None of the legacy copy was migrated into the new shell as-is.** The new
homepage (`src/pages/index.astro`) uses only the property name, the one
approved blurb sentence, a "Building" lifecycle statement, and a plain
ecosystem mention linking to `texasmovement.com` — content the addendum for
this specific rebuild supplied directly, not content sourced from
`legacy/index.html`. Specifically **not** carried forward, and why:

- **The entire "Gather" events/ceremony product section** (hero framing,
  dedicated `#gather` section, "See Gather event systems" and "Inquire
  about hosting or partnering on Gather events" CTAs) — explicitly excluded
  per this rebuild's instructions: no event-listing, RSVP, or
  signup-shaped language may carry into this shell, regardless of the
  property's real-world role. See `docs/PROJECT_BRIEF.md`.
- **The `mailto:Social@TexasMovement.com` contact link** (both the visible
  "Email Social@TexasMovement.com..." link and the JSON-LD `contactPoint`
  email) — no email address or `mailto:` link is permitted anywhere in this
  build's public output, verified or not.
- **All three JSON-LD blocks** (Organization with `parentOrganization` +
  `founder` + `contactPoint` + `sameAs`; WebSite; BreadcrumbList) — this
  build emits no structured data at all. See `CLAUDE.md` rule 6 and
  `docs/SITE_ARCHITECTURE.md`.
- **The "who it's for" and FAQ sections** — these expand on the events
  framing above (e.g. "people who follow Texas Movement, attend events, or
  host gatherings") and were excluded for the same reason.
- **`meta-tags.html`** — superseded by `src/layouts/BaseLayout.astro`'s own
  OG/Twitter metadata, built from `src/config/site.ts`. Not migrated as
  page content because it was documented as a reference snippet, not a
  route.
- **`og-image.png` / `og-square.png`** — preserved as-is in `legacy/`, not
  wired into the new build's metadata. `BaseLayout.astro` currently emits
  no `og:image`/`twitter:image` tag at all (no image has been supplied or
  approved specifically for this shell; the legacy image carries the old
  "events, gatherings" framing in its baked-in text per `legacy/README.md`,
  so reusing it without review would risk shipping stale positioning).
- **`CNAME`** — preserved verbatim in `legacy/`, not copied into a
  `public/CNAME`. Re-adding it is a hosting-connection decision (this build
  makes no DNS/domain/Cloudflare changes), not a scaffolding one.

## Rollback plan

To roll back: `git checkout main` — `main` is untouched by this branch.
Delete the feature branch (`claude/private-shell-scaffold`) if desired. The
live GitHub Pages deploy was never repointed at this branch or at its PR.
Nothing in this migration touches `main` or the Pages deploy source, so
rollback is a no-op unless and until someone merges the PR.

## Known follow-up

- The legacy "Gather" events/ceremony product concept is fully preserved
  and readable in `legacy/index.html`. Whether/how it should inform a real
  future build of this property is an owner decision, not resolved here —
  flagged in `docs/LAUNCH_BLOCKERS.md`.
- The contact-address discrepancy is worth noting for any future work:
  `legacy/index.html` uses `Social@TexasMovement.com` consistently across
  its visible link and JSON-LD `contactPoint`. No verification of that
  inbox was available to this build, and none is needed for this shell
  (which carries no contact route at all).
