"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { REVIEWS, SITE } from "@/data/site";

gsap.registerPlugin(useGSAP);

/**
 * Real social proof. The restaurant has 1,753 Google reviews at 4.5 stars and
 * the old site showed three testimonials, repeated three times in one slider.
 *
 * The quotes run as a marquee: constant motion, so `linear` is the only correct
 * easing here. It pauses on hover so a quote that catches the eye can be read,
 * and it doesn't run at all under reduced motion.
 */
export function Proof() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(`(prefers-reduced-motion: no-preference)`, () => {
        const lane = root.current?.querySelector<HTMLElement>("[data-lane]");
        if (!lane) return;

        // The track holds two identical copies, so -50% lands exactly where it
        // started and the loop is seamless.
        const tween = gsap.to(lane, {
          xPercent: -50,
          ease: "none",
          duration: 46,
          repeat: -1,
        });

        const stop = () => tween.pause();
        const go = () => tween.resume();
        lane.addEventListener("pointerenter", stop);
        lane.addEventListener("pointerleave", go);
        lane.addEventListener("focusin", stop);
        lane.addEventListener("focusout", go);

        return () => {
          lane.removeEventListener("pointerenter", stop);
          lane.removeEventListener("pointerleave", go);
          lane.removeEventListener("focusin", stop);
          lane.removeEventListener("focusout", go);
          tween.kill();
        };
      });

      // No breakpoint gate here on purpose: the marquee is fine on phones —
      // only the motion preference should switch it off.
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden py-20 md:py-28">
      <div className="container-x">
        <p data-reveal className="kicker">
          What guests say
        </p>

        <div
          data-reveal-group
          className="mt-8 flex flex-wrap items-end gap-x-12 gap-y-6"
        >
          {SITE.ratings.map((r) => (
            <div key={r.source} data-reveal className="flex items-end gap-3">
              <span className="numeric text-5xl leading-none text-mint md:text-6xl">
                {r.score}
              </span>
              <span className="pb-1">
                <span className="block font-mono text-xs tracking-[0.18em] text-bone uppercase">
                  {r.source}
                </span>
                <span className="block text-sm text-muted">{r.count}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee */}
      <div className="relative mt-14 md:mt-20">
        <div className="overflow-hidden">
          <div data-lane className="flex w-max gap-4">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex gap-4" aria-hidden={copy === 1}>
                {REVIEWS.map((review, i) => (
                  <figure
                    key={`${copy}-${i}`}
                    className="w-[80vw] max-w-md shrink-0 rounded-sm border border-white/8 bg-surface/60 p-6 md:w-96"
                  >
                    <blockquote className="font-display text-lg leading-snug text-bone">
                      “{review.quote}”
                    </blockquote>
                    <figcaption className="mt-4 font-mono text-[0.6875rem] tracking-[0.16em] text-muted uppercase">
                      {review.author}
                    </figcaption>
                  </figure>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Fade the lane into the page edges so it reads as continuous. */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink to-transparent md:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink to-transparent md:w-32" />
      </div>
    </section>
  );
}
