# CLAUDE.md — social.texasmovement.com

Scope, safety rules, and working commands for this repository. Read this
before making changes.

## What this repo is

A minimal, non-interactive, **preview-only** shell for **Texas Movement
Social** — one of the verticals in the Texas Movement ecosystem. This is
**not a public launch**. It exists to hold the domain's structure and design
language honestly, with no claims beyond one approved sentence, until a real
build is scoped and approved.

Lifecycle badge: **Building**. The homepage says exactly that — "This is
being built. It is not yet open." — and nothing more optimistic.

## Hard safety rules — never violate these

1. **No email addresses or `mailto:` links, anywhere, in any form** —
   visible text included. The legacy site (`legacy/index.html`) shipped
   `mailto:Social@TexasMovement.com`; that address is preserved only inside
   `legacy/` for historical record, never rendered as a live link in the new
   shell.

2. **No forms, form actions, external submission embeds, or `<iframe>`s of
   any kind.** No signup, RSVP, booking, or contact flow — verified or not.

3. **No unverified social URLs.** This shell carries zero social links.
   Don't invent, guess, or reuse handles from anywhere else in the
   ecosystem.

4. **No event, RSVP, or participation-shaped language.** The legacy site
   framed this property around "events," "gatherings," and a "Gather"
   ceremony/experience product, with CTAs inviting people to attend or host.
   None of that carries forward here. The only approved copy for this
   property is the one blurb sentence below — do not add descriptive copy
   that re-introduces an events/participation framing, even informally.

5. **No `TBD` or `__TBD__` in public output.** If something is genuinely
   unknown, state the real status in plain language (e.g. "This is being
   built") — never a placeholder marker in shipped copy.

6. **No structured data beyond the property's own bare name.** This build
   emits **no JSON-LD at all** — see the comment in
   `src/layouts/BaseLayout.astro` for why omitting entirely was the safer
   call than trying to trim the legacy Organization schema down to a single
   field. Do not add JSON-LD back without checking this rule first.

7. **No CTA.** The homepage has zero interactive elements beyond the skip
   link, the brand-mark link to `/`, the footer's internal legal links, and
   one link to `https://texasmovement.com` (the one explicitly approved
   ecosystem-hub mention). Nothing links to another Texas Movement vertical,
   and nothing is styled or behaves like a call to action.

8. **The approved blurb is verbatim, not a starting point.** `BLURB` in
   `src/config/site.ts` — *"Community, social publishing, and public
   conversation systems."* — must render exactly as given wherever it
   appears. Don't paraphrase, expand, or add supporting copy around it.

9. **Legacy content is preserved, not deleted.** Everything that was on
   `main` before this branch (`index.html`, `meta-tags.html`, `og-image.png`,
   `og-square.png`, `README.md`, `CNAME`) was moved into `legacy/` verbatim
   via `git mv` — history preserved, content unedited. See
   `docs/MIGRATION_INVENTORY.md`.

## What needs owner approval before any of this can go public

- Turning `PUBLIC_PREVIEW` off (production/indexable launch decision).
- Connecting Cloudflare Pages, DNS, or any hosting/domain change.
- Any public copy beyond the one approved blurb sentence.
- Any CTA, contact route, form, or destination — verified or not.
- Any social link/icon (requires a confirmed handle per platform).
- Any legal/privacy review and real policy text for `/privacy`, `/terms`,
  `/accessibility`.
- Deciding whether/how to revisit the legacy "Gather" events product
  framing — this build deliberately did not carry it forward; see
  `docs/LAUNCH_BLOCKERS.md`.

See `docs/LAUNCH_BLOCKERS.md` for the full Launch Gate checklist.

## Build & test commands

```bash
npm install
npm run dev          # local dev server
npm run build         # astro build; postbuild guard runs automatically
npm run check         # astro check (typecheck)
npm test              # unit tests (node:test)
npm run test:a11y     # axe-core scan against every built route
```

`npm run build` runs `scripts/check-public-output.mjs` automatically via the
`postbuild` npm lifecycle hook. It fails the build if `dist/` contains a
literal `TBD`/`__TBD__`, any `mailto:` link, any `<form>` element or
`formaction` attribute, any `<iframe>`, any known social domain, or an HTML
page missing the noindex meta tag while `PUBLIC_PREVIEW` is not explicitly
`"false"`.

## Preview / noindex convention

`PUBLIC_PREVIEW` defaults to preview mode (anything other than the literal
string `"false"` is treated as preview). In preview mode the site ships
`<meta name="robots" content="noindex, nofollow">` on every page, an empty
`sitemap.xml`, a `robots.txt` that disallows all crawling, and omits the
canonical link (so nothing points at the live domain while unresolved).

## Deploy target

Cloudflare Pages, static build (`output: "static"`, no adapter). See
`wrangler.toml`. This repo does not deploy itself, connect a domain, or
create a Cloudflare project — deployment is a separate, explicitly-approved
action.
