# Brand System

This shell reuses the shared Texas Movement design-token system, extracted
from the live production `texasmovement.com` HTML — see the foundation
`DESIGN_SYSTEM.md` this build was given. It does **not** vendor the
`@tmi/constants` package (see `CLAUDE.md` / `docs/SITE_ARCHITECTURE.md` for
why); the tokens below are applied directly as plain CSS custom properties
in `src/styles/global.css`, scoped to what this minimal shell actually uses.

## Palette

| Token | Value | Use |
|---|---|---|
| `--paper` | `#e7e8e2` | Page background |
| `--panel` | `#ddded7` | Raised surfaces (lifecycle badge) |
| `--ink` | `#15181e` | Primary text |
| `--ink-soft` | `#454a54` | Secondary text |
| `--line` | `#c4c6bd` | Hairlines |
| `--line-strong` | `#a6a99f` | Card/badge borders |
| `--white` | `#f4f5f0` | Text on dark accent surfaces (skip link, preview banner) |
| `--compression` | `#274a78` | Link / focus-visible accent |
| `--tension` | `#bd3b22` | Eyebrow ticks, lifecycle badge dot, preview banner |

Not every token from the full ecosystem system is used here (no
`--graphite` dark section, no `--hero` warm gradient) — this is a
single-density shell, not a multi-section marketing page.

## Type

- **Space Grotesk** for headings (`h1`–`h3`) — matches the ecosystem-wide
  heading treatment.
- **IBM Plex Sans** for body copy and UI chrome.
- **IBM Plex Mono** for the eyebrow label, lifecycle badge, and preview
  banner — uppercase, letter-spaced, matching the ecosystem's label
  convention.
- Loaded via the same Google Fonts stylesheet reference used elsewhere in
  the ecosystem, with system-font fallback stacks so the page still renders
  correctly if the font request fails.

## Layout

- Single content column (`--wrap: 40rem`) — this is a one-section shell, so
  no wide multi-column grid is needed.
- One `.section` with generous vertical rhythm (`--space-5`/`--space-6`),
  matching the ecosystem's spacing scale.

## Components

- **Skip link** (`.skip-link`) — visually hidden until focused, jumps to
  `#main-content`.
- **Preview banner** — a small, accent-colored strip shown only when
  `PUBLIC_PREVIEW` is true, so nobody mistakes this preview build for a
  live site.
- **Eyebrow** (`.eyebrow`) — uppercase mono label with the ecosystem's
  rust-colored tick, matching `DESIGN_SYSTEM.md`'s `.eyebrow` pattern.
- **Lifecycle badge** (`.lifecycle`) — a bordered pill with a colored dot,
  reading "Building". This is a status indicator, not a CTA: no `href`, no
  click behavior, `role="status"` only.
- Focus state: `a:focus-visible { outline: 2px solid var(--compression); }`
  — the one visible focus treatment in the current brand, preserved per
  `DESIGN_SYSTEM.md`'s explicit call-out not to lose it.

## What's intentionally absent

- No nav beyond a home-linking brand mark and the footer's internal legal
  links — this is a one-page shell with no other in-site destinations to
  navigate to yet.
- No CTA of any kind (see `CLAUDE.md` rule 7).
- No imagery — the legacy OG images live in `legacy/`, unedited, but
  nothing was wired into this build (no verified need for them yet, and the
  homepage carries no hero image).
- No JSON-LD / structured data (see `CLAUDE.md` rule 6).
- No mobile-nav-disappears bug to fix, because there's no nav to hide — the
  known accessibility gap called out in `DESIGN_SYSTEM.md` doesn't apply to
  a shell this small.
