# Project Brief

## What this is

A minimal, non-interactive, **preview-only** Astro shell for **Texas
Movement Social**, one vertical in the Texas Movement ecosystem. This is
not a public launch and not the full site — it is a placeholder that
replaces the prior static HTML with an honest "this is being built" state,
while preserving the prior content unedited in `legacy/`.

## Owner

Texas Movement International. All brand-sensitive decisions (public copy
beyond the approved blurb, contact destinations, social links, launch/index
state, legal/policy text) require explicit owner approval — see `CLAUDE.md`
for the specific list and `docs/LAUNCH_BLOCKERS.md` for the full Launch
Gate.

## Objective

Give `social.texasmovement.com` a structurally sound, design-consistent,
honest placeholder — not a fabricated "it's live" page — while making zero
claims beyond the one approved blurb sentence: no fabricated events
program, no unverified contact channel, no invented social presence, and no
organizational/legal data beyond the property's own bare name.

## What's in scope for this build

- A single homepage: property name, the one approved blurb sentence
  (verbatim), a "Building" lifecycle statement, and a plain mention of where
  this property sits in the Texas Movement ecosystem (with a link to the
  hub, `texasmovement.com`).
- A 404 page.
- `robots.txt` and `sitemap.xml`, both `PUBLIC_PREVIEW`-aware.
- Honest stub pages: `/accessibility`, `/privacy`, `/terms`.
- Preview/noindex convention (`PUBLIC_PREVIEW`), defaulted on.
- No structured data (see `CLAUDE.md` rule 6 for why).
- Cloudflare-Pages-ready static build (`wrangler.toml`, no adapter, no
  connection made).
- Baseline accessibility (skip link, focus-visible states, semantic
  headings, responsive layout) and a postbuild public-output guard.
- Full preservation of the prior `main` content, moved into `legacy/` and
  documented in `docs/MIGRATION_INVENTORY.md`.

## What's explicitly out of scope for this build

- Any events, RSVP, gathering, or "Gather" product content — the legacy
  site's entire framing for this property. See `CLAUDE.md` rule 4.
- A working contact form, mailto link, or verified inbox route.
- Any social media links or icons.
- Additional pages beyond the routes listed above.
- Any Organization/Person structured data.
- Deployment, DNS, Cloudflare project creation, or making the site publicly
  indexable.

## Why the "Gather"/events framing was dropped, not migrated

The legacy `index.html` positioned Texas Movement Social entirely around
public events, gatherings, and a named "Gather" ceremony/experience product
— hero copy, a dedicated events section, and CTAs inviting people to attend
or host. The addendum for this specific rebuild explicitly instructed that
none of that event/RSVP/participation-shaped language carry forward into
this shell, regardless of the property's eventual real-world role. The
legacy content is fully preserved and readable in `legacy/index.html`; it
was a deliberate exclusion from the new shell's copy, not an oversight. Any
future decision to reintroduce an events framing is an owner call, not a
scaffolding one — flagged in `docs/LAUNCH_BLOCKERS.md`.
