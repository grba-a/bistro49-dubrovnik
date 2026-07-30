"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BREAKPOINT, DURATION, EASE_OUT, STAGGER } from "@/lib/motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * One reveal engine for the whole page. Sections opt in with attributes
 * (`data-reveal`, `data-clip`, `data-parallax`) instead of each shipping its own
 * GSAP setup — one place to tune the rhythm, one place for the reduced-motion
 * and mobile fallbacks.
 *
 * Every reveal is `once: true`. Re-animating on scroll-back is motion the user
 * didn't ask for and has already seen.
 */
export function ScrollReveal() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    /* ---------- Reduced motion: opacity only, no travel ---------- */
    mm.add(BREAKPOINT.reduced, () => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          duration: 0.3,
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });
    });

    /* ---------- Everything else ---------- */
    mm.add(`(prefers-reduced-motion: no-preference)`, () => {
      // Grouped reveals: children of a [data-reveal-group] stagger together
      // rather than each firing its own trigger as it crosses the line.
      gsap.utils
        .toArray<HTMLElement>("[data-reveal-group]")
        .forEach((group) => {
          const items = group.querySelectorAll<HTMLElement>("[data-reveal]");
          if (!items.length) return;

          gsap.fromTo(
            items,
            { opacity: 0, y: 18 },
            {
              opacity: 1,
              y: 0,
              duration: DURATION.reveal,
              ease: EASE_OUT,
              stagger: STAGGER.cards,
              scrollTrigger: { trigger: group, start: "top 82%", once: true },
            },
          );
        });

      // Standalone reveals — anything not inside a group.
      gsap.utils
        .toArray<HTMLElement>("[data-reveal]")
        .filter((el) => !el.closest("[data-reveal-group]"))
        .forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: DURATION.reveal,
              ease: EASE_OUT,
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
            },
          );
        });

      // Image reveals: clip up from the bottom edge. Cheaper and more elegant
      // than a fade — the frame stays put while the picture arrives.
      gsap.utils.toArray<HTMLElement>("[data-clip]").forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(0 0 100% 0)" },
          {
            clipPath: "inset(0 0 0% 0)",
            duration: 1.1,
            ease: EASE_OUT,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          },
        );
      });
    });

    /* ---------- Parallax: desktop only ---------- */
    mm.add(
      { desktop: BREAKPOINT.desktop, reduced: BREAKPOINT.reduced },
      (ctx) => {
        const { desktop, reduced } = ctx.conditions as {
          desktop: boolean;
          reduced: boolean;
        };
        if (!desktop || reduced) return;

        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const amount = Number(el.dataset.parallax) || 12;
          gsap.fromTo(
            el,
            { yPercent: -amount / 2 },
            {
              yPercent: amount / 2,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });
      },
    );

    return () => mm.revert();
  }, []);

  return null;
}
