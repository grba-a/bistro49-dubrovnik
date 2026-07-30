"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/data/site";

/**
 * Mobile action bar. The guest is frequently standing outside with a bag,
 * deciding in ten seconds — so the three things they might actually want are
 * pinned to the thumb: book, call, walk here.
 *
 * Appears after the hero so it never competes with the opening frame, and sits
 * above the safe-area inset so it clears the iOS home indicator.
 */
export function StickyBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-ink/92 backdrop-blur-xl transition-transform duration-300 ease-out md:hidden motion-reduce:transition-none ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-hidden={!show}
    >
      <div className="grid grid-cols-3 gap-px">
        <a
          href="#reserve"
          tabIndex={show ? 0 : -1}
          className="pressable flex min-h-14 items-center justify-center bg-mint font-mono text-[0.625rem] tracking-[0.16em] text-ink uppercase"
        >
          Book
        </a>
        <a
          href={SITE.phone.href}
          tabIndex={show ? 0 : -1}
          className="pressable flex min-h-14 items-center justify-center font-mono text-[0.625rem] tracking-[0.16em] text-bone uppercase"
        >
          Call
        </a>
        <a
          href={SITE.maps}
          target="_blank"
          rel="noreferrer"
          tabIndex={show ? 0 : -1}
          className="pressable flex min-h-14 items-center justify-center font-mono text-[0.625rem] tracking-[0.16em] text-bone uppercase"
        >
          Directions
        </a>
      </div>
    </div>
  );
}
