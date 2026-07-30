/**
 * Builds one portable, self-contained HTML file from the static export.
 *
 *   SINGLEFILE=1 next build && node tools/build-singlefile.mjs
 *
 * The result opens straight off disk — no server, no network, no build step —
 * and can be emailed as a single attachment. Both routes are included: `/` and
 * `/menu` become two views toggled in-page, so every internal link still works.
 *
 * The point of this file is that the output stays *editable*. It carries the
 * real semantic markup plus a readable vanilla runtime, not a minified React
 * bundle, so copy can be changed by hand in any text editor.
 */
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);
const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const exportDir = join(root, ".next-singlefile");
const outFile = join(root, "dist", "bistro49-dubrovnik.html");

/** Images are re-encoded smaller: base64 inflates by ~33%, and this has to be
 *  emailable. 1600px is still comfortably retina for the sizes they render at. */
const IMAGE_MAX_WIDTH = 1600;
const IMAGE_QUALITY = 68;

const read = (p) => readFile(p, "utf8");

/* ------------------------------------------------------------------ helpers */

function extractBody(html) {
  const open = html.indexOf("<body");
  const start = html.indexOf(">", open) + 1;
  const end = html.lastIndexOf("</body>");
  let body = html.slice(start, end);
  // Drop Next's hydration payload and script tags — nothing here needs React.
  body = body.replace(/<script[\s\S]*?<\/script>/g, "");
  body = body.replace(/<template[\s\S]*?<\/template>/g, "");
  body = body.replace(/<next-route-announcer[\s\S]*?<\/next-route-announcer>/g, "");
  return body.trim();
}

/**
 * next/font declares each `--font-*` custom property inside a generated class
 * that Next puts on `<html>`. Rebuilding the document without carrying that
 * class over silently drops all three typefaces and the page renders in the
 * system sans — which looks like a CSS bug but is a missing attribute.
 */
function extractHtmlClass(html) {
  return html.match(/<html[^>]*\sclass="([^"]*)"/)?.[1] ?? "";
}

function extractTitle(html) {
  const m = html.match(/<title>([\s\S]*?)<\/title>/);
  return m ? m[1] : "Bistro 49 — Dubrovnik";
}

function extractJsonLd(html) {
  const m = html.match(
    /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/,
  );
  return m ? m[1] : null;
}

/**
 * Inlines every woff2 a stylesheet references.
 *
 * Two things bite here. next/font emits its `@font-face` rules into a *separate*
 * CSS chunk from Tailwind's, so both stylesheets have to be collected — take
 * only the first and the whole page silently falls back to Georgia. And the
 * urls inside are relative (`url(../media/x.woff2)`), so each one resolves
 * against its own stylesheet's directory, not the export root.
 */
async function inlineFontsInCss(css, cssHref) {
  const cssDir = dirname(join(exportDir, cssHref));
  const refs = [...css.matchAll(/url\((["']?)([^)"']+\.woff2)\1\)/g)];
  const seen = new Map();

  for (const [, , url] of refs) {
    if (seen.has(url)) continue;
    const abs = url.startsWith("/") ? join(exportDir, url) : join(cssDir, url);
    const buf = await readFile(abs);
    seen.set(url, `data:font/woff2;base64,${buf.toString("base64")}`);
  }

  let out = css;
  for (const [url, dataUri] of seen) {
    out = out.split(url).join(dataUri);
  }
  return { css: out, count: seen.size };
}

/** Re-encode with sharp if present, otherwise ship the original bytes. */
async function encodeImage(absPath) {
  try {
    const { default: sharp } = await import("sharp");
    return await sharp(absPath)
      .resize({ width: IMAGE_MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: IMAGE_QUALITY })
      .toBuffer();
  } catch {
    return readFile(absPath);
  }
}

async function inlineImages(html) {
  const paths = [...new Set([...html.matchAll(/\/images\/[a-z0-9._-]+\.webp/g)].map((m) => m[0]))];
  const map = new Map();
  let originalBytes = 0;
  let encodedBytes = 0;

  for (const p of paths) {
    const abs = join(root, "public", p);
    originalBytes += (await stat(abs)).size;
    const buf = await encodeImage(abs);
    encodedBytes += buf.length;
    map.set(p, `data:image/webp;base64,${buf.toString("base64")}`);
  }

  let out = html;
  for (const [p, dataUri] of map) {
    // Longest-first ordering isn't needed: every path ends in .webp and none is
    // a prefix of another, because the extension terminates each match.
    out = out.split(`"${p}"`).join(`"${dataUri}"`);
  }
  return { html: out, count: map.size, originalBytes, encodedBytes };
}

/**
 * The export leaves the map as a live OpenStreetMap iframe, which offline would
 * either hang or show a broken frame. It gets a static card instead.
 *
 * The whole wrapper goes, not just the iframe: on the site that wrapper carries
 * `filter: invert(...) hue-rotate(180deg)` to darken the map tiles. Replace only
 * the iframe and the filter survives, inverting the dark replacement card into a
 * light grey block with dark text — the opposite of the design.
 *
 * Styles here are inline rather than utility classes, because a class that the
 * React source never used isn't in the compiled CSS at all.
 */
function replaceMapIframe(html) {
  const card = `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background-color:#191d1e">
      <p style="padding:0 1.5rem;text-align:center;font-family:var(--font-jetbrains),ui-monospace,monospace;font-size:0.6875rem;letter-spacing:0.18em;text-transform:uppercase;color:#9ba3a2;line-height:1.9">
        Obala Ivana Pavla II 49 · Gruž<br />Map opens in Google Maps
      </p>
    </div>`;

  // The filter wrapper immediately preceding the iframe, plus the iframe itself.
  const withWrapper =
    /<div[^>]*style="[^"]*filter:[^"]*invert[^"]*"[^>]*>\s*<iframe[^>]*openstreetmap[^>]*>\s*<\/iframe>\s*<\/div>/gi;

  let out = html.replace(withWrapper, card);
  // Fallback in case the wrapper markup changes: never ship a live iframe.
  out = out.replace(/<iframe[^>]*openstreetmap[^>]*>\s*<\/iframe>/gi, card);
  return out;
}

/* --------------------------------------------------------------------- main */

const [homeRaw, menuRaw] = await Promise.all([
  read(join(exportDir, "index.html")),
  read(join(exportDir, "menu.html")),
]);

// Collect every stylesheet both routes link to, in document order.
const cssHrefs = [
  ...new Set(
    [homeRaw, menuRaw].flatMap((html) =>
      [...html.matchAll(/href="(\/_next\/static\/[^"]+\.css)"/g)].map((m) => m[1]),
    ),
  ),
];
if (!cssHrefs.length) throw new Error("Could not find the exported stylesheets");

let css = "";
let fontCount = 0;
for (const href of cssHrefs) {
  const inlined = await inlineFontsInCss(await read(join(exportDir, href)), href);
  css += inlined.css + "\n";
  fontCount += inlined.count;
}

const [gsapJs, scrollTriggerJs, splitTextJs, lenisJs, runtimeJs] = await Promise.all([
  read(join(root, "node_modules/gsap/dist/gsap.min.js")),
  read(join(root, "node_modules/gsap/dist/ScrollTrigger.min.js")),
  read(join(root, "node_modules/gsap/dist/SplitText.min.js")),
  read(join(root, "node_modules/lenis/dist/lenis.min.js")),
  read(join(here, "singlefile-runtime.js")),
]);

const jsonLd = extractJsonLd(homeRaw);

let document_ = `<!doctype html>
<html lang="en" class="${extractHtmlClass(homeRaw)}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${extractTitle(homeRaw)}</title>
<meta name="description" content="A family bistro on the Gru&#382; harbour, open 08:00 to midnight all year round. Breakfast, brunch, wood-fired pizza, burgers and Bistronomy 49 after dark." />
<meta name="theme-color" content="#08090a" />
<!--
  Bistro 49 — self-contained preview.

  Everything is inside this one file: styles, fonts, photographs and scripts.
  It needs no internet connection and no web server; double-click to open.

  Editing copy: the markup below is ordinary HTML. Search for the sentence you
  want to change and edit it in place. Two views are stacked in the body —
  <div data-view="home"> and <div data-view="menu"> — and the script at the
  bottom switches between them.
-->
<style>
${css}
/* Views: only one route is on screen at a time. */
[data-view][hidden] { display: none !important; }
</style>
</head>
<body>
<div data-view="home">
${extractBody(homeRaw)}
</div>
<div data-view="menu" hidden>
${extractBody(menuRaw)}
</div>
${jsonLd ? `<script type="application/ld+json">${jsonLd}</script>` : ""}
<script>${gsapJs}</script>
<script>${scrollTriggerJs}</script>
<script>${splitTextJs}</script>
<script>${lenisJs}</script>
<script>${runtimeJs}</script>
</body>
</html>
`;

document_ = replaceMapIframe(document_);
const img = await inlineImages(document_);
document_ = img.html;

await mkdir(dirname(outFile), { recursive: true });
await writeFile(outFile, document_, "utf8");

const mb = (n) => (n / 1024 / 1024).toFixed(2) + " MB";
console.log(`\n  → ${outFile}`);
console.log(`    ${mb(Buffer.byteLength(document_))} single file`);
console.log(`    ${img.count} images inlined (${mb(img.originalBytes)} source → ${mb(img.encodedBytes)} re-encoded)`);
console.log(`    ${fontCount} fonts inlined, ${(css.length / 1024).toFixed(0)} KB css`);
console.log(`    no external requests\n`);
