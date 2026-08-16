import { test } from "node:test";
import assert from "node:assert/strict";
import { canonicalUrl, SITE_URL, TMI, BLURB, SITE, LIFECYCLE } from "../src/config/site.ts";

test("canonicalUrl builds an absolute URL rooted at SITE_URL", () => {
  assert.equal(canonicalUrl("/"), `${SITE_URL}/`);
  assert.equal(canonicalUrl("/privacy"), `${SITE_URL}/privacy`);
});

test("canonicalUrl normalizes a path missing its leading slash", () => {
  assert.equal(canonicalUrl("privacy"), `${SITE_URL}/privacy`);
});

test("TMI mention is a plain name + url pair only", () => {
  assert.deepEqual(Object.keys(TMI).sort(), ["name", "url"]);
  assert.equal(TMI.name, "Texas Movement International");
  assert.equal(TMI.url, "https://texasmovement.com");
});

test("blurb is the exact approved sentence, verbatim", () => {
  assert.equal(BLURB, "Community, social publishing, and public conversation systems.");
});

test("site name matches the approved property name", () => {
  assert.equal(SITE.name, "Texas Movement Social");
});

test("lifecycle badge and statement match the Building convention", () => {
  assert.equal(LIFECYCLE.badge, "Building");
  assert.equal(LIFECYCLE.statement, "This is being built. It is not yet open.");
});
