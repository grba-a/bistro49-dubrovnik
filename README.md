# Bistro 49 — Dubrovnik

Redesign of [bistro49-dubrovnik.com](https://bistro49-dubrovnik.com/) for Bistro 49,
a family bistro on the Gruž harbour (Obala Ivana Pavla II 49).

```bash
npm run dev      # http://localhost:3000
npm run build
```

Stack: Next.js 16 (App Router) · Tailwind CSS 4 · GSAP 3.15 (+ SplitText,
ScrollTrigger) · Lenis 1.3.

---

## The idea

The page is structured as **one day at number 49**. That isn't a theme applied from
outside — it's the restaurant's real operating structure (four time-based menus:
Breakfast 08–11, Brunch 11–14, Bistro 49 11–23, Bistronomy 49 18–23) and its only
genuine differentiator in Dubrovnik: open 08:00–24:00, Monday to Saturday, **all
year round**, opposite the bus station.

It also resolves the tension the old site couldn't: pizza and burgers *and*
bistronomy. Time of day separates the two registers so neither has to apologise
for the other. Light temperature shifts warm → cool as you scroll.

## What this fixes from the old site

| Old | Now |
|---|---|
| No hero — text over a watermark compass | Full-bleed guest photography, wordmark with the plate passing through it |
| **Menu was a 990 KB PDF, prices still in kuna** | Real HTML menu at `/menu`, prices in €, dietary flags, sticky category nav, indexable |
| Three testimonials, repeated three times in one slider | Actual figures: 4.5★ / 1,753 Google reviews, 4.3★ Tripadvisor, quoted reviews |
| Instagram embed frozen on posts from 10/2021 | Removed — no stale third-party embed |
| Live music, happy hour, catering: nowhere | `Nights` section — the part of the business that brings locals back off-season |
| No mention of arrival | `Find Us`: 3 min from the bus station, 5 from the cruise terminal, 6 from the ferry pier |
| Large dead vertical gaps | One `Section` shell owns vertical rhythm |

## Architecture

```
src/
  app/            page.tsx (landing) · menu/page.tsx · layout.tsx · globals.css
  components/     Hero · Manifesto · DayArc · Signature · Nights · Gallery ·
                  Proof · FindUs · Reserve · Nav · Footer · StickyBar ·
                  OpenBadge · MenuNav · ScrollReveal · Section
  lib/
    smooth-scroll.tsx   Lenis ↔ GSAP ticker wiring
    motion.ts           easing / duration / stagger tokens
    hours.ts            live open-closed state, evaluated in Europe/Zagreb
  data/
    site.ts       address, phone, owners, verified ratings, arrival times
    menu.ts       the full menu
    dishes.ts     day chapters, signature plates, gallery
```

**Design tokens** live in `globals.css` under `@theme`. The mint `#6AC0B3` and the
dark surface `#191D1E` were sampled from the client's existing site — the badge
logo and the interior neon are already that colour. Type is Fraunces (display),
Instrument Sans (body), JetBrains Mono (times, prices, counters).

## Motion

Lenis does not run its own RAF loop; GSAP's ticker drives it so ScrollTrigger and
Lenis advance on the same frame (`lib/smooth-scroll.tsx`). All animation goes
through `useGSAP` with a scope ref.

- `ScrollReveal` is the single reveal engine — sections opt in with
  `data-reveal`, `data-reveal-group`, `data-clip`, `data-parallax`.
- `DayArc` holds its panel with CSS `position: sticky`, not a GSAP pin. Pinning
  rewrites the DOM with a spacer, which fights a smooth-scroll library and
  collapses on resize.
- Custom easings only (`cubic-bezier(0.23, 1, 0.32, 1)`); never `ease-in` on UI;
  never `scale(0)`; only `transform` and `opacity` are animated.

**`gsap.matchMedia()` gates everything:**

| | |
|---|---|
| ≥ 768px | Full set — sticky scrub, parallax, layering |
| < 768px | No scrub, no parallax. The Day Arc becomes a plain vertical stack |
| `prefers-reduced-motion` | Opacity only, no travel, **Lenis is not initialised at all** — hijacking the scroll wheel is itself motion |

Without JS everything stays visible: the pre-animation states live behind a
`.js-ready` class that only the client adds.

## Verified

Playwright, at 375 / 768 / 1440, both routes:

- No horizontal scroll anywhere (`scrollWidth === innerWidth`, `scrollX` stays 0)
- 0 console errors
- Reduced motion: 0 of 61 revealed elements stuck invisible, native scroll works
- All four Day Arc chapters settle to a single readable text block
- `next build` clean, both routes statically prerendered; ESLint and `tsc` clean

## If the lockfile breaks CI

`package-lock.json` is generated with all platforms resolved:

```bash
npm install --package-lock-only --os=linux --cpu=x64
```

Without that, npm on macOS writes a placeholder for one of sharp's optional
Linux binaries — `node_modules/sharp/node_modules/@img/sharp-linux-arm64` with
`{"optional": true}` and no `version`. Locally nothing notices, because that
binary is never installed on a Mac. On a Linux CI runner npm reads the entry,
finds no version, and dies with `npm error Invalid Version:` before the build
starts. If a plain `npm install` ever reintroduces it, regenerate with the
command above and check for entries without a version.

## Before launch

1. **Confirm the prices.** `src/data/menu.ts` is transcribed from the house's own
   printed menu, which dates from the kuna→euro transition (it printed
   `96 kn / 12,74 EUR`). The euro figures are the restaurant's own published
   numbers but are almost certainly stale. Flagged in a comment at the top of the
   file.
2. **Booking link.** `Reserve` points at `opentable.com` generically — swap in the
   restaurant's real OpenTable (or other) booking URL.
3. **Breakfast & brunch cards.** Only the à la carte menu was available as a
   document; the page says those two are served from their own cards in the room.
   Add them to `menu.ts` if the client supplies them.
4. **Photography.** All images in `public/images/` are the client's own, taken from
   their existing site and converted to WebP. Three (`bistro2024-31`, `-120`,
   `-129`) needed re-downloading — their server truncates large files.
5. **Missing shots:** no exterior/terrace photograph and no live-music photograph
   exist in their current set. `Find Us` uses a styled map instead of faking one,
   and `Nights` uses the interior neon. Worth a short shoot.
6. Add `opengraph-image` and a favicon from the B49 badge.
