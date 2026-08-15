# Launch Blockers — Texas Movement Social

Things that must happen — and who needs to approve them — before this site
can move past "preview shell" toward a real launch.

## Launch Gate

- [ ] Owner and identity confirmation for this vertical.
- [ ] Repository/domain/hosting approval (Cloudflare connection, DNS).
- [ ] Public copy approval — everything beyond the one approved blurb
      sentence needs a real review pass before it ships.
- [ ] Legal/privacy review appropriate to this vertical. **Flagged
      explicitly:** this property's legacy positioning centered on public
      **events and gatherings** (the "Gather" ceremony/experience product).
      If that framing is reintroduced in a future build, it likely needs
      event-specific review beyond a generic policy stub — ticketing,
      liability, participant data, age/consent handling, and venue/safety
      claims are all plausible surface area for an events product that a
      boilerplate privacy/terms stub does not cover. This shell does not
      resolve that question; it only flags it for whoever scopes the real
      build.
- [ ] Verified public destination, if a CTA will ever exist.
- [ ] Verified inbox/form/payment route, if applicable.
- [ ] Verified social URLs, if any will be used.
- [ ] Analytics/consent approval, if any data will be collected.
- [ ] Explicit owner approval for production deployment.

## Additional items specific to this property

### 1. The "Gather" events framing was dropped, not resolved

The legacy site framed this entire property around events, gatherings, and
a named "Gather" ceremony/experience product — hero copy, a dedicated
section, and CTAs inviting people to attend or host. Per this rebuild's
explicit instructions, none of that language was carried into the new
shell, regardless of the property's real-world role. **This is a scope
exclusion, not a design opinion** — someone with the full context on
whether "Gather" is a real, current product needs to decide whether/how to
reintroduce it. See `docs/MIGRATION_INVENTORY.md` for exactly what was
excluded and why.

### 2. Contact route

`legacy/index.html` used `mailto:Social@TexasMovement.com`. No inbox
verification was in scope for this build, and this shell carries no
contact route of any kind — not even an inert placeholder. Blocker: a
confirmed, forwarding inbox, supplied and approved by the owner, before any
contact route (mailto or form) is added back.

### 3. No social links

No confirmed handle exists for this property's own identity on any
platform in this build's scope. Blocker: a confirmed handle per platform,
supplied and approved by the owner, before any icon/link is added.

### 4. Site is not indexable

`PUBLIC_PREVIEW` defaults to `true`. The site currently ships
`noindex, nofollow`, an empty sitemap, a `robots.txt` that disallows all
crawling, and no canonical link to the production domain. Blocker: an
explicit decision from the owner to set `PUBLIC_PREVIEW=false` for a real
production build — this is a launch decision, not a technical one.

### 5. No deploy has happened

This repo has never been deployed from this branch. `wrangler.toml`
declares the Cloudflare Pages project shape only. Blocker: the owner (or
someone they designate) connects the Cloudflare Pages project and triggers
a deploy — out of scope for this build per the stated hard boundaries.

### 6. No structured data

This build emits no JSON-LD at all (see `CLAUDE.md` rule 6 and
`docs/SITE_ARCHITECTURE.md`). If/when structured data is wanted, it needs
an explicit decision on scope (bare `Organization` name only? `url`
included? `sameAs`/`parentOrganization`/`founder` at all?) rather than
restoring the legacy JSON-LD wholesale.

### 7. This is a placeholder, not the full site

Only a homepage, a 404, legal stubs, and generated `robots.txt`/
`sitemap.xml` exist. No events content, no community/publishing features,
no navigation beyond the one page. Blocker: scope, copy, and structure for
the full site, to be defined in a future pass once the owner has more to
share — including a decision on the "Gather" question above.
