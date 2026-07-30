"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { OpenBadge } from "./OpenBadge";
import { DURATION, EASE_OUT, STAGGER } from "@/lib/motion";

gsap.registerPlugin(useGSAP, SplitText);

/**
 * The hero owns its own intro counter rather than delegating to a separate
 * preloader. One timeline means the count-up, the curtain lift and the type
 * reveal can never drift out of sync.
 *
 * Layering: "Bistro" sits in front (z-30), the plate between (z-20), "49"
 * behind (z-10) — so the photograph passes *through* the wordmark. The overlap
 * comes from a negative margin rather than absolute offsets, so it holds at any
 * viewport width instead of depending on the font's glyph advances.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const seen = sessionStorage.getItem("b49-intro") === "1";
      const curtain = root.current?.querySelector<HTMLElement>("[data-curtain]");
      const tagline = root.current?.querySelector<HTMLElement>("[data-tagline]");

      /* Reduced motion: no curtain, no travel — just place everything. */
      if (reduced) {
        if (curtain) curtain.style.display = "none";
        gsap.set("[data-hero-fade], [data-tagline]", { opacity: 1 });
        gsap.set("[data-hero-bg]", { opacity: 1 });
        gsap.set("[data-hero-clip]", { clipPath: "inset(0 0 0% 0)" });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });

      /* ---- Intro curtain: once per session ---- */
      if (!seen && curtain) {
        const counter = { value: 0 };
        const readout = curtain.querySelector<HTMLElement>("[data-counter]");

        tl.to(counter, {
          value: 49,
          duration: 1,
          ease: "power2.inOut",
          onUpdate: () => {
            if (readout)
              readout.textContent = String(Math.round(counter.value)).padStart(
                2,
                "0",
              );
          },
        })
          .to(curtain.querySelector("[data-curtain-inner]"), {
            opacity: 0,
            duration: 0.28,
          })
          .to(curtain, {
            // Lifts off the bottom edge so the eye follows it away.
            clipPath: "inset(0 0 100% 0)",
            duration: 0.85,
            ease: "power3.inOut",
            onComplete: () => {
              curtain.style.display = "none";
              sessionStorage.setItem("b49-intro", "1");
            },
          });
      } else if (curtain) {
        curtain.style.display = "none";
      }

      /* ---- Hero choreography ---- */
      tl.fromTo(
        "[data-hero-bg]",
        { scale: 1.08, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.8 },
        seen ? 0 : "-=0.5",
      )
        .fromTo(
          "[data-hero-word]",
          { yPercent: 115 },
          { yPercent: 0, duration: DURATION.hero, stagger: 0.1 },
          "-=1.55",
        )
        .fromTo(
          "[data-hero-clip]",
          { clipPath: "inset(0 0 100% 0)", scale: 1.05 },
          { clipPath: "inset(0 0 0% 0)", scale: 1, duration: 1.15 },
          "-=0.95",
        )
        .fromTo(
          "[data-hero-fade]",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.7, stagger: STAGGER.tight },
          "-=0.55",
        );

      /* The tagline runs on its own tween rather than inside the master
         timeline. SplitText has to measure real, laid-out text, so it waits for
         the font; `autoSplit` re-splits and replays if the line count changes on
         resize — otherwise a split taken at one width stays baked in at every
         other width. */
      let split: SplitText | undefined;
      if (tagline) {
        document.fonts.ready.then(() => {
          gsap.set(tagline, { opacity: 1 });
          split = SplitText.create(tagline, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit: (self) =>
              gsap.fromTo(
                self.lines,
                { yPercent: 108 },
                {
                  yPercent: 0,
                  duration: 0.9,
                  ease: EASE_OUT,
                  stagger: STAGGER.lines,
                  delay: seen ? 0.75 : 2.15,
                  overwrite: true,
                },
              ),
          });
        });
      }

      return () => {
        tl.kill();
        split?.revert();
      };
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative isolate flex min-h-dvh flex-col overflow-hidden pt-20 pb-10 md:pt-24 md:pb-14"
    >
      {/* Intro curtain */}
      <div
        data-curtain
        className="fixed inset-0 z-60 flex items-center justify-center bg-ink"
        style={{ clipPath: "inset(0 0 0% 0)" }}
      >
        <div
          data-curtain-inner
          className="flex flex-col items-center gap-3 text-center"
        >
          <span className="kicker text-muted">Obala Ivana Pavla II</span>
          <span
            data-counter
            className="numeric text-6xl leading-none text-mint md:text-8xl"
          >
            00
          </span>
        </div>
      </div>

      {/* The room. A guest photograph, not a stock plate — but pushed far
          enough back that it reads as atmosphere rather than content. */}
      <div className="absolute inset-0 -z-10">
        <div data-hero-bg className="absolute inset-0 opacity-0">
          <Image
            src="/images/bistro2024-122.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center brightness-[0.62] saturate-[0.85]"
          />
        </div>
        <div className="absolute inset-0 bg-ink/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/55 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink via-ink/70 to-transparent" />
        {/* Keeps the nav legible when a bright face lands directly behind it. */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink/85 to-transparent" />
      </div>

      <div className="container-x flex flex-1 flex-col">
        {/* Top meta — the open/closed state only. The address belongs to Find Us
            and the footer; repeating it here just crowded the opening frame. */}
        <div className="flex flex-wrap items-center justify-end gap-x-6 gap-y-2">
          <div data-hero-fade className="opacity-0">
            <OpenBadge />
          </div>
        </div>

        {/* The wordmark mass */}
        <h1 className="mt-auto">
          <span className="sr-only">
            Bistro 49 — a family bistro on the Gruž harbour in Dubrovnik
          </span>

          <span
            aria-hidden
            className="relative z-30 block overflow-hidden leading-[0.84] text-bone"
            style={{ fontSize: "clamp(3rem, 10.5vw, 9rem)" }}
          >
            <span data-hero-word className="block">
              Bistro
            </span>
          </span>

          {/* z-10 makes this its own stacking context, so everything inside it —
              including the plate — renders behind "Bistro" (z-30) no matter what
              z-index the children carry. That's what lets the photograph pass
              *behind* the upper word while still covering the numerals. */}
          <span
            aria-hidden
            className="relative z-10 inline-block leading-[0.76] text-mint"
            style={{
              fontSize: "clamp(5rem, 21vw, 17rem)",
              letterSpacing: "-0.04em",
              marginTop: "-0.04em",
            }}
          >
            <span className="block overflow-hidden">
              <span data-hero-word className="block">
                49
              </span>
            </span>

            {/* Absolutely positioned so it never stretches the line box.
                Percentages resolve against the numerals' own box, so the overlap
                holds at every width. Hidden on mobile, where it would collide
                rather than layer. */}
            <span
              data-hero-clip
              className="absolute bottom-[-3%] left-[84%] z-20 hidden aspect-2/3 w-[19vw] max-w-60 overflow-hidden rounded-sm ring-1 ring-white/10 shadow-2xl shadow-black/70 md:block"
            >
              <Image
                src="/images/bistro2024-41.webp"
                alt=""
                fill
                priority
                sizes="22vw"
                className="object-cover"
              />
            </span>
          </span>
        </h1>

        {/* Bottom row */}
        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-7 md:mt-12 md:grid-cols-12 md:items-end">
          <p
            data-tagline
            className="font-display text-xl leading-tight text-bone/90 opacity-0 md:col-span-6 md:text-[1.7rem]"
          >
            First coffee at eight. Last song after midnight. One address on the
            harbour, open all year.
          </p>

          <div className="flex flex-wrap items-center gap-3 md:col-span-5 md:col-start-8 md:justify-end">
            <Link
              href="#reserve"
              data-hero-fade
              className="pressable rounded-full bg-mint px-6 py-3 font-mono text-[0.6875rem] tracking-[0.18em] text-ink uppercase opacity-0 hover:bg-mint-bright"
            >
              Book a table
            </Link>
            <Link
              href="/menu"
              data-hero-fade
              className="pressable rounded-full border border-white/20 px-6 py-3 font-mono text-[0.6875rem] tracking-[0.18em] text-bone uppercase opacity-0 hover:border-mint hover:text-mint"
            >
              See the menu
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
