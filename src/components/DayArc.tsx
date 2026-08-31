"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CHAPTERS } from "@/data/dishes";
import { BREAKPOINT } from "@/lib/motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Warm at breakfast, cool by service. The light shifts as the day does. */
const TINT: Record<string, string> = {
  amber: "rgba(224, 163, 86, 0.16)",
  warm: "rgba(224, 163, 86, 0.09)",
  neutral: "rgba(8, 9, 10, 0.04)",
  mint: "rgba(106, 192, 179, 0.13)",
};

/**
 * The spine of the page: four chapters of one day, scrubbed on scroll.
 *
 * The panel is held with CSS `position: sticky` rather than a GSAP pin. Pinning
 * rewrites the DOM with a pin-spacer, which is exactly the kind of thing that
 * fights a smooth-scroll library and collapses on resize. Sticky is native, and
 * GSAP is left to do only what CSS can't: crossfade the chapters.
 *
 * On mobile the whole mechanism is dropped for a plain stack — a scrubbed pin on
 * a phone means the guest scrolls and nothing appears to happen.
 */
export function DayArc() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        { desktop: BREAKPOINT.desktop, reduced: BREAKPOINT.reduced },
        (ctx) => {
          const { desktop, reduced } = ctx.conditions as {
            desktop: boolean;
            reduced: boolean;
          };
          if (!desktop) return;

          const track = root.current?.querySelector<HTMLElement>("[data-track]");
          const panels = gsap.utils.toArray<HTMLElement>("[data-panel]");
          if (!track || panels.length < 2) return;

          gsap.set(panels.slice(1), { opacity: 0 });
          gsap.set(panels[0], { opacity: 1 });

          if (reduced) {
            // No scrub: show each chapter as it reaches the viewport instead.
            panels.forEach((p, i) => {
              if (i === 0) return;
              ScrollTrigger.create({
                trigger: track,
                start: () => `top+=${(i / panels.length) * 100}% top`,
                onEnter: () => gsap.set(panels, { opacity: (j) => (j === i ? 1 : 0) }),
                onEnterBack: () =>
                  gsap.set(panels, { opacity: (j) => (j === i ? 1 : 0) }),
              });
            });
            return;
          }

          const rail = gsap.utils.toArray<HTMLElement>("[data-rail]");
          const setRail = (active: number) =>
            rail.forEach((el, i) => {
              el.style.color = i === active ? "var(--color-mint)" : "";
            });
          setRail(0);

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: track,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.6,
              // The rail is derived from scroll progress rather than tweened, so
              // it can't drift out of step with the crossfades.
              onUpdate: (self) =>
                setRail(
                  Math.min(
                    panels.length - 1,
                    Math.floor(self.progress * panels.length),
                  ),
                ),
            },
          });

          // One crossfade per boundary, placed at the midpoint between chapters
          // so each one holds still long enough to be read.
          //
          // Images cross-dissolve over the full boundary, but the *text* leaves
          // fast and arrives late. Two overlapping paragraphs of display type
          // are unreadable mush; two overlapping photographs are just a
          // dissolve.
          panels.forEach((panel, i) => {
            if (i === 0) return;
            const at = i - 0.5;
            const prevText = panels[i - 1].querySelector("[data-panel-text]");
            const nextText = panel.querySelector("[data-panel-text]");

            tl.to(panels[i - 1], { opacity: 0, duration: 0.5 }, at)
              .to(panel, { opacity: 1, duration: 0.5 }, at)
              .to(prevText, { opacity: 0, duration: 0.14 }, at)
              .fromTo(
                nextText,
                { opacity: 0 },
                { opacity: 1, duration: 0.16 },
                at + 0.34,
              );
          });
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="day" className="relative" style={{ scrollMarginTop: "5rem" }}>
      {/* ---------------- Desktop: sticky scrub ---------------- */}
      <div ref={root} className="hidden md:block">
        <div
          data-track
          className="relative"
          style={{ height: `${CHAPTERS.length * 100}vh` }}
        >
          <div className="sticky top-0 h-screen overflow-hidden">
            {CHAPTERS.map((c) => (
              <div key={c.index} data-panel className="absolute inset-0">
                <Image
                  src={c.image}
                  alt={c.alt}
                  fill
                  /* Each variant declares the width it actually occupies at
                     each breakpoint. The desktop panel is full-bleed from
                     768px up and `display: none` below it, so claiming a bare
                     "100vw" makes Next compare 100vw against a measured zero
                     and warn. Saying so explicitly keeps the desktop request
                     full-size and silences a warning that was describing the
                     hidden state, not a real over-fetch. */
                  sizes="(min-width: 768px) 100vw, 1px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-ink/72" />
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: TINT[c.tint] }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/60" />

                <div className="container-x relative flex h-full flex-col justify-center">
                  <div data-panel-text className="max-w-2xl">
                    <p className="kicker">
                      {c.index} / {String(CHAPTERS.length).padStart(2, "0")} ·{" "}
                      {c.window}
                    </p>
                    <p className="numeric mt-6 text-6xl leading-none text-mint lg:text-8xl">
                      {c.time}
                    </p>
                    <h3 className="mt-6 text-4xl text-balance lg:text-6xl">
                      {c.headline}
                    </h3>
                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                      {c.body}
                    </p>
                    <p className="mt-8 font-mono text-xs tracking-[0.18em] text-bone uppercase">
                      {c.name}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Progress rail — borrowed from the reference sites' chapter
                counters, so the guest knows how long this section runs and
                where they are in it. */}
            <div className="pointer-events-none absolute inset-y-0 right-8 flex flex-col items-center justify-center gap-3">
              {CHAPTERS.map((c, i) => (
                <span
                  key={c.index}
                  data-rail={i}
                  className="font-mono text-[0.625rem] tracking-widest text-muted transition-colors duration-200 ease-out"
                >
                  {c.index}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Mobile: a clean stack ---------------- */}
      <div className="md:hidden">
        <div className="container-x pt-20 pb-4">
          <p data-reveal className="kicker">
            One day at 49
          </p>
        </div>
        <div data-reveal-group className="flex flex-col">
          {CHAPTERS.map((c) => (
            <article key={c.index} data-reveal className="container-x py-8">
              <div
                data-clip
                className="relative aspect-4/3 w-full overflow-hidden rounded-sm"
              >
                <Image
                  src={c.image}
                  alt={c.alt}
                  fill
                  /* The mobile card sits inside the gutters, so it is never a
                     full viewport wide — claiming 100vw makes Next serve a
                     needlessly large file. */
                  sizes="(max-width: 767px) 92vw, 1px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-ink/25" />
              </div>
              <p className="kicker mt-5">
                {c.index} / {String(CHAPTERS.length).padStart(2, "0")} ·{" "}
                {c.window}
              </p>
              <h3 className="mt-3 text-2xl text-balance">{c.headline}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
                {c.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
