#!/usr/bin/env node
/**
 * Postbuild public-output guard for social.texasmovement.com.
 *
 * Fails the build (non-zero exit) if the built dist/ output contains any of:
 *  - the literal string "TBD" or "__TBD__"
 *  - a `mailto:` link anywhere
 *  - an HTML <form> element or form `action` (this build ships no working
 *    form of any kind)
 *  - an `<iframe` element (no external submission embeds)
 *  - a link to a known social platform domain (none are confirmed for this
 *    site — no social URL should ever be emitted)
 *  - a missing noindex robots meta tag on an HTML page, while the build ran
 *    in preview mode (PUBLIC_PREVIEW !== "false")
 *
 * Run automatically as the `postbuild` npm script.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const DIST_DIR = join(process.cwd(), "dist");
const TEXT_EXTENSIONS = new Set([".html", ".htm", ".xml", ".txt", ".json", ".css", ".js", ".svg"]);

const SOCIAL_DOMAINS = [
  "twitter.com",
  "x.com",
  "facebook.com",
  "instagram.com",
  "linkedin.com",
  "youtube.com",
  "youtu.be",
  "tiktok.com",
  "threads.net",
  "pinterest.com",
  "snapchat.com",
  "reddit.com",
  "bsky.app",
  "mastodon.social",
];

const isPreview = process.env.PUBLIC_PREVIEW !== "false";

/**
 * Scan a single file's text content for violations. Pure function, exported
 * for unit testing — see tests/check-public-output.test.mjs.
 *
 * @param {string} content
 * @param {{ ext: string; isPreview: boolean; label?: string }} opts
 * @returns {string[]} human-readable violation messages
 */
export function scanContent(content, { ext, isPreview: preview, label = "<file>" }) {
  /** @type {string[]} */
  const violations = [];

  if (content.includes("__TBD__")) {
    violations.push(`${label}: contains literal "__TBD__"`);
  } else if (content.includes("TBD")) {
    violations.push(`${label}: contains literal "TBD"`);
  }

  if (content.includes("mailto:")) {
    violations.push(`${label}: contains a "mailto:" link`);
  }

  if (/<form[\s>]/i.test(content)) {
    violations.push(`${label}: contains a <form> element (no working form should exist)`);
  }

  if (/\bformaction\s*=/i.test(content)) {
    violations.push(`${label}: contains a "formaction" attribute (no working form should exist)`);
  }

  if (/<iframe[\s>]/i.test(content)) {
    violations.push(`${label}: contains an <iframe> element (no external submission embeds)`);
  }

  for (const domain of SOCIAL_DOMAINS) {
    if (content.includes(domain)) {
      violations.push(`${label}: references social domain "${domain}"`);
    }
  }

  if (preview && (ext === ".html" || ext === ".htm")) {
    const hasNoindex = /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex[^"']*["']/i.test(content);
    if (!hasNoindex) {
      violations.push(`${label}: missing <meta name="robots" content="noindex, ..."> in preview mode`);
    }
  }

  return violations;
}

/** @param {string} dir */
function walk(dir) {
  /** @type {string[]} */
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stats = statSync(full);
    if (stats.isDirectory()) {
      out.push(...walk(full));
    } else {
      out.push(full);
    }
  }
  return out;
}

function main() {
  let files;
  try {
    files = walk(DIST_DIR);
  } catch (err) {
    console.error(`check-public-output: could not read ${DIST_DIR} — did the build run?`);
    console.error(err);
    process.exit(1);
    return;
  }

  /** @type {string[]} */
  const violations = [];

  for (const file of files) {
    const ext = file.slice(file.lastIndexOf("."));
    if (!TEXT_EXTENSIONS.has(ext)) continue;

    const content = readFileSync(file, "utf-8");
    const rel = relative(process.cwd(), file);

    violations.push(...scanContent(content, { ext, isPreview, label: rel }));
  }

  if (violations.length > 0) {
    console.error("check-public-output: build FAILED — forbidden content found in dist/:\n");
    for (const v of violations) console.error(`  - ${v}`);
    console.error(`\n${violations.length} violation(s).`);
    process.exit(1);
  }

  console.log(`check-public-output: OK — ${files.length} file(s) scanned, 0 violations. (preview=${isPreview})`);
}

// Only run when executed directly (`node scripts/check-public-output.mjs`),
// not when imported for `scanContent` (e.g. from unit tests).
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
