# Site Architecture

## Stack

- **Astro** (`output: "static"`) + TypeScript. No UI framework — the whole
  site is static markup with zero client-side JavaScript.
- **Cloudflare Pages** as the eventual deploy target (`wrangler.toml`), no
  adapter required for a static build. No Cloudflare project has been
  created or connected by this build.

## Routes

| Route | Source | Notes |
|---|---|---|
| `/` | `src/pages/index.astro` | Homepage — name, blurb, lifecycle, ecosystem mention |
| `/404` | `src/pages/404.astro` | Not-found page |
| `/robots.txt` | `src/pages/robots.txt.ts` | Reflects `PUBLIC_PREVIEW` |
| `/sitemap.xml` | `src/pages/sitemap.xml.ts` | Empty in preview mode |
| `/accessibility` | `src/pages/accessibility.astro` | Honest stub — statement pending |
| `/privacy` | `src/pages/privacy.astro` | Honest stub — policy pending |
| `/terms` | `src/pages/terms.astro` | Honest stub — terms pending |

## Directory layout

```
src/
  components/       Header, Footer, SkipLink — small, presentational
  config/site.ts     Self-contained site config (see below)
  layouts/BaseLayout.astro   <head> metadata, preview banner
  pages/             Routes (see table above)
  styles/global.css  The visual system, plain CSS custom properties
scripts/
  check-public-output.mjs  Postbuild content guard, wired as npm `postbuild`
  a11y-scan.mjs             axe-core scan over the built preview
tests/               node:test unit tests for the guard and site config
docs/                This document and its siblings
legacy/              Prior `main` content, preserved verbatim — see docs/MIGRATION_INVENTORY.md
```

## Configuration model

`src/config/site.ts` is the single source of truth for:

- `SITE` — name, title, description.
- `BLURB` — the one approved blurb sentence, verbatim.
- `LIFECYCLE` — the badge label and statement for the "Building" state.
- `TMI` — the one approved Texas Movement International mention (plain name
  + url only).
- `IS_PREVIEW` — derived from `PUBLIC_PREVIEW`, defaults to `true`.
- `canonicalUrl(path)` — absolute URL helper rooted at `SITE_URL`.

This file deliberately replaces what would otherwise be a vendored copy of
the shared `@tmi/constants` package. This shell has no nav, no footer link
registry, no inbox list, and no social handles to look up — the full
multi-property org registry isn't needed for a page this small, and pulling
it in would bring far more surface area (and far more that could
accidentally leak into public output) than this build needs. See
`CLAUDE.md`.

## Metadata & structured data

`BaseLayout.astro` owns all `<head>` output:

- Title/description, OG tags, Twitter `summary` card.
- `noindex, nofollow` robots meta when `IS_PREVIEW` is true; otherwise
  `index, follow` plus a canonical link.
- **No JSON-LD of any kind.** The hard boundary for this build permits
  structured data no richer than the property's own bare name; every
  realistic Organization/WebSite schema shape needs at least a `url`
  alongside `name`, and the legacy JSON-LD in `legacy/index.html` shows how
  quickly that scope creeps (`parentOrganization`, `founder`, `sameAs`,
  `contactPoint`). Omitting JSON-LD entirely is the unambiguous safe
  reading of that boundary.

## Preview convention

`PUBLIC_PREVIEW` (a `PUBLIC_`-prefixed Astro/Vite env var, read via
`import.meta.env`) controls: robots meta, `robots.txt` body, `sitemap.xml`
contents, canonical link emission, and the visible preview banner. It
defaults to preview mode when unset. See `docs/LAUNCH_BLOCKERS.md`.

## Build-time enforcement

`scripts/check-public-output.mjs` runs automatically after `astro build` via
the `postbuild` npm script and scans every text file in `dist/` for the
forbidden content listed in `CLAUDE.md`. It exits non-zero (failing CI) on
any violation: literal `TBD`/`__TBD__`, `mailto:` links, `<form>` elements,
`formaction` attributes, `<iframe>` elements, known social domains, or a
missing noindex marker on a preview build.
