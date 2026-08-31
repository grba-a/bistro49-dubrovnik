"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * The motion runtime: GSAP, ScrollTrigger, and the flag that lets CSS hide
 * pre-animation states.
 *
 * There is no smooth-scroll library here any more. Lenis used to drive the
 * page off GSAP's ticker, and it was removed on request: hijacking the wheel
 * puts a library between a hungry visitor and the menu, costs a dependency on
 * every page load, and fights every native affordance — find-in-page, the
 * scrollbar, momentum on iOS, and any modal that needs the page to hold still.
 * Scrolling is the browser's again. ScrollTrigger reads the native scroller
 * directly, which is what it does best.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Signals that JS is in control, so CSS may hide pre-animation states.
    // Without JS everything stays visible — the page degrades to readable.
    document.documentElement.classList.add("js-ready");

    gsap.registerPlugin(ScrollTrigger);

    return () => {
      document.documentElement.classList.remove("js-ready");
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <>{children}</>;
}

/**
 * Holding the page still behind a modal.
 *
 * With native scrolling back, this is CSS alone: `overflow: hidden` on the root
 * while a dialog is open. The attribute is set here rather than inline so the
 * rule lives with the rest of the dialog's styles.
 */
export const scrollLock = {
  lock() {
    document.documentElement.dataset.dialogOpen = "";
  },
  unlock() {
    delete document.documentElement.dataset.dialogOpen;
  },
};
