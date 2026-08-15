/**
 * Self-contained site configuration for social.texasmovement.com.
 *
 * This is intentionally NOT a vendored copy of the shared `@tmi/constants`
 * package used by the full texasmovement.com-family rebuilds. This repo is
 * a minimal, non-interactive, preview-only shell — a single approved blurb
 * sentence, a lifecycle statement, and a bare mention of where this
 * property sits in the Texas Movement ecosystem. Pulling in the full
 * multi-property org registry (nav trees, inbox lists, social handles,
 * SEO helpers) would bring in far more surface area than a shell like this
 * needs or should carry. Same pattern used on the `alexandermathai.com`
 * shell for the same reason.
 *
 * Keep this file small. Anything that isn't plain, already-approved fact
 * does not belong here.
 */

/** Canonical production URL. Never changes based on preview state. */
export const SITE_URL = "https://social.texasmovement.com";

/**
 * The one approved, verbatim blurb for this property. Do not paraphrase or
 * expand it — render it exactly as given, everywhere it appears.
 */
export const BLURB =
  "Community, social publishing, and public conversation systems.";

export const SITE = {
  name: "Texas Movement Social",
  title: "Texas Movement Social",
  description: `${BLURB} This is being built. It is not yet open.`,
  locale: "en-US",
} as const;

/**
 * Lifecycle badge for this property. "Building" reads as an intentional
 * in-development state — confident, not apologetic. Do not change this
 * without an explicit decision from the owner (see docs/LAUNCH_BLOCKERS.md).
 */
export const LIFECYCLE = {
  badge: "Building",
  statement: "This is being built. It is not yet open.",
} as const;

/**
 * The one approved, contextual mention of Texas Movement International —
 * this property's parent ecosystem. Plain proper noun and a live URL to
 * the hub itself only. No entity/legal details, no address, no other
 * structured claim. Do not extend this object, and do not link to any
 * OTHER Texas Movement vertical from this shell.
 */
export const TMI = {
  name: "Texas Movement International",
  url: "https://texasmovement.com",
} as const;

/**
 * Preview / noindex convention.
 *
 * Any value other than the literal string "false" for PUBLIC_PREVIEW is
 * treated as preview mode. This defaults to preview mode when the env var
 * is unset, per the launch checklist in docs/LAUNCH_BLOCKERS.md.
 */
export const IS_PREVIEW: boolean = import.meta.env?.PUBLIC_PREVIEW !== "false";

/** Build an absolute canonical URL for a given site-relative path. */
export function canonicalUrl(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, SITE_URL).toString();
}
