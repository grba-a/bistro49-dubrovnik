"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Lenis ↔ GSAP wiring.
 *
 * Lenis must NOT run its own requestAnimationFrame loop (`autoRaf: false`);
 * GSAP's ticker drives it instead so ScrollTrigger and Lenis advance on the
 * same frame. Without this the two loops interleave and pinned sections jitter.
 *
 * `lagSmoothing(0)` stops GSAP from "catching up" after a long frame, which
 * would otherwise teleport scrubbed animations past where the user actually is.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Signals that JS is in control, so CSS may hide pre-animation states.
    // Without JS everything stays visible — the page degrades to readable.
    document.documentElement.classList.add("js-ready");

    gsap.registerPlugin(ScrollTrigger);

    if (reduced) {
      // No smooth scroll at all: hijacking the scroll wheel is itself motion.
      return () => {
        document.documentElement.classList.remove("js-ready");
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    }

    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.15,
      // Exponential ease-out: responds immediately, settles softly.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
    });

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    // Dev-only handle. Native `window.scrollTo` fights Lenis, so automated
    // visual checks need a way to drive the real scroller.
    if (process.env.NODE_ENV !== "production") {
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    }

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      document.documentElement.classList.remove("js-ready");
    };
  }, []);

  return <>{children}</>;
}
