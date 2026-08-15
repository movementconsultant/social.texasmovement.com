#!/usr/bin/env node
/**
 * Axe-core accessibility scan against every route of the built preview,
 * served locally with `astro preview`. Requires `npm run build` to have run
 * first. Uses the pre-installed Chromium at PLAYWRIGHT_BROWSERS_PATH.
 *
 * This build environment can run several sibling projects' `astro preview`
 * servers concurrently on a network namespace shared across sessions. A
 * fixed, hardcoded port is not safe here: if it's already taken, Astro
 * silently falls back to the next free port, and a script that blindly
 * fetches the port it *asked for* can end up scanning a completely
 * different site. This script instead (1) requests a high, less-likely-to-
 * collide port, (2) parses the port Astro actually bound from its own
 * stdout rather than assuming the requested one, and (3) sanity-checks the
 * fetched homepage body for this site's own name before trusting anything
 * it scans.
 *
 * Usage: npm run test:a11y
 */

import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { SITE } from "../src/config/site.ts";

// The installed Playwright package version's expected browser revision can
// drift from what's pre-installed at PLAYWRIGHT_BROWSERS_PATH. Prefer the
// pre-installed full Chromium binary (not the headless-shell build) via its
// stable "chromium" symlink so this script doesn't require a network
// download (`playwright install` is intentionally not run in this repo).
const browsersPath = process.env.PLAYWRIGHT_BROWSERS_PATH;
const preinstalledChromium = browsersPath ? join(browsersPath, "chromium") : undefined;
const executablePath =
  preinstalledChromium && existsSync(preinstalledChromium) ? preinstalledChromium : undefined;

// A high, randomized starting port — just a request. The port actually
// bound is parsed from Astro's own stdout below, never assumed.
const REQUESTED_PORT = 20000 + Math.floor(Math.random() * 20000);
const ROUTES = ["/", "/404", "/accessibility", "/privacy", "/terms"];
const BOUND_URL_RE = /(?:running|listening)[^\n]*?(https?:\/\/[\w.-]+:\d+)/i;

function waitForBoundUrl(getOutput, attempts = 60) {
  return new Promise((resolve, reject) => {
    const tryOnce = (n) => {
      const match = getOutput().match(BOUND_URL_RE);
      if (match) return resolve(match[1]);
      if (n <= 0) return reject(new Error("could not parse bound URL from astro preview output"));
      delay(250).then(() => tryOnce(n - 1));
    };
    tryOnce(attempts);
  });
}

function waitForHttpOk(url, attempts = 40) {
  return new Promise((resolve, reject) => {
    const tryOnce = async (n) => {
      try {
        const res = await fetch(url);
        if (res.ok || res.status === 404) return resolve();
      } catch {
        // not up yet
      }
      if (n <= 0) return reject(new Error("preview server did not respond in time"));
      await delay(250);
      tryOnce(n - 1);
    };
    tryOnce(attempts);
  });
}

async function main() {
  const server = spawn(
    "npx",
    ["astro", "preview", "--port", String(REQUESTED_PORT), "--host", "127.0.0.1"],
    { stdio: "pipe" },
  );

  let serverOutput = "";
  server.stdout.on("data", (d) => (serverOutput += d.toString()));
  server.stderr.on("data", (d) => (serverOutput += d.toString()));

  try {
    const boundUrl = await waitForBoundUrl(() => serverOutput);
    console.log(`a11y: astro preview bound at ${boundUrl} (requested ${REQUESTED_PORT})`);
    await waitForHttpOk(boundUrl + "/");

    // Sanity check: confirm this is actually OUR site before trusting any
    // scan result against it — see the module comment above for why this
    // matters in this environment.
    const homepageBody = await (await fetch(boundUrl + "/")).text();
    if (!homepageBody.includes(SITE.name)) {
      throw new Error(
        `bound server at ${boundUrl} does not look like ${SITE.name} — homepage body did not ` +
          `contain "${SITE.name}". Refusing to scan (likely a port collision with another ` +
          `session's preview server in this shared environment).`,
      );
    }

    const browser = await chromium.launch(executablePath ? { executablePath } : {});
    const context = await browser.newContext();
    const page = await context.newPage();

    /** @type {{ route: string; violations: unknown[] }[]} */
    const results = [];

    for (const route of ROUTES) {
      await page.goto(boundUrl + route, { waitUntil: "networkidle" });
      const scan = await new AxeBuilder({ page }).analyze();
      results.push({ route, violations: scan.violations });
    }

    await browser.close();

    let failed = false;
    for (const { route, violations } of results) {
      if (violations.length === 0) {
        console.log(`a11y: OK — ${route} (0 violations)`);
      } else {
        failed = true;
        console.error(`a11y: FAIL — ${route} (${violations.length} violation(s))`);
        for (const v of violations) {
          console.error(`  - [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s))`);
        }
      }
    }

    if (failed) process.exit(1);
    console.log(`a11y: all ${ROUTES.length} route(s) passed with 0 violations.`);
  } catch (err) {
    console.error("a11y-scan: error", err);
    console.error("--- preview server output ---");
    console.error(serverOutput);
    process.exit(1);
  } finally {
    server.kill();
    // Astro's preview server also tracks itself via a project-local lockfile
    // (`astro preview stop`), independent of the process handle above.
    spawn("npx", ["astro", "preview", "stop"], { stdio: "ignore" });
  }
}

main();
