# social.texasmovement.com

A minimal, non-interactive, preview-only Astro shell for **Texas Movement
Social**. See `CLAUDE.md` for the full scope and safety rules, and
`docs/PROJECT_BRIEF.md` for why this exists.

## Local setup

```bash
npm install
cp .env.example .env   # optional — PUBLIC_PREVIEW=true is the default anyway
npm run dev
```

## Structure

```
src/
  components/       Header, Footer, SkipLink — small, presentational
  config/site.ts     Self-contained site config (name, blurb, lifecycle, TMI mention)
  layouts/BaseLayout.astro   <head> metadata, preview banner
  pages/             Routes (see docs/SITE_ARCHITECTURE.md)
  styles/global.css  The visual system — shared Texas Movement design tokens
scripts/
  check-public-output.mjs  Postbuild guard, wired as npm `postbuild`
  a11y-scan.mjs             axe-core scan over the built preview
tests/               node:test unit tests
docs/                Project docs — read docs/LAUNCH_BLOCKERS.md before any launch decision
legacy/              Everything that was on `main` before this rebuild, preserved verbatim
```

No `public/` directory exists yet — there are no static passthrough assets to
ship. `CNAME` was moved to `legacy/` along with the rest of the prior `main`
content rather than copied into a would-be `public/CNAME`; see
`docs/MIGRATION_INVENTORY.md` for why re-adding it is a hosting-connection
decision, not a scaffolding one.

## Build & test

```bash
npm run build      # astro build; postbuild guard (scripts/check-public-output.mjs) runs automatically
npm run check       # astro check (typecheck)
npm test            # unit tests
npm run test:a11y   # axe-core accessibility scan against every built route
```

## Deploy assumptions

Static Astro build (`output: "static"`), Cloudflare Pages target
(`wrangler.toml`, `pages_build_output_dir = "dist"`, no adapter needed). No
deploy, DNS change, or Cloudflare project has been created by this build —
see `docs/LAUNCH_BLOCKERS.md`.

## Rollback

`main` is untouched by this branch. To roll back: do nothing — nothing has
been merged. If this branch's PR is ever merged and needs to be undone,
`git revert` the merge commit; `legacy/` still holds the exact prior `main`
content, so nothing is lost either way.
