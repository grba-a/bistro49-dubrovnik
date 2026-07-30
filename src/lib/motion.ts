/**
 * Shared motion vocabulary. Every animation on the site pulls its easing and
 * timing from here so the whole page moves with one rhythm.
 *
 * The custom curves exist because the built-in CSS/GSAP easings are too weak to
 * read as intentional. `ease-in` is deliberately absent: it delays the first
 * frame — exactly the moment the eye is on the element — so it always feels
 * slower than the same duration eased out.
 */

/** Strong ease-out — anything entering or leaving. */
export const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";

/** Strong ease-in-out — things travelling across the screen. */
export const EASE_IN_OUT = "cubic-bezier(0.77, 0, 0.175, 1)";

export const DURATION = {
  /** Press feedback. */
  press: 0.16,
  /** Small UI: labels, badges, nav. */
  ui: 0.24,
  /** Section reveals — marketing context, allowed to breathe. */
  reveal: 0.9,
  /** Hero choreography. */
  hero: 1.1,
} as const;

/** 30–80ms between siblings. Longer reads as sluggish. */
export const STAGGER = {
  tight: 0.045,
  lines: 0.07,
  cards: 0.08,
} as const;

export const BREAKPOINT = {
  desktop: "(min-width: 768px)",
  mobile: "(max-width: 767px)",
  reduced: "(prefers-reduced-motion: reduce)",
} as const;
