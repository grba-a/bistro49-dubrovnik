"use client";

import { useEffect, useState } from "react";
import { BookButton } from "./booking/BookButton";

/**
 * One floating button on a phone.
 *
 * This used to be a bar of three — book, call, directions — and three controls
 * of equal weight is not a call to action, it is a menu. There is one now, it
 * is the booking, and it opens the dialog. Call and directions both survive
 * intact a thumb's reach away in the Find Us section and the footer, so nothing
 * is lost except the choice.
 *
 * It is inset rather than bolted to the screen edge, so the page keeps showing
 * around it and it reads as an object floating over the harbour night rather
 * than as a browser chrome bar. It appears only past the hero, so it never
 * competes with the opening frame.
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
      data-sticky-bar
      className={`fixed inset-x-4 bottom-4 z-50 transition-[transform,opacity] duration-300 ease-out md:hidden motion-reduce:transition-none ${
        show
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-6 opacity-0"
      }`}
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
      aria-hidden={!show}
    >
      <BookButton
        href="#reserve"
        tabIndex={show ? 0 : -1}
        className="pressable flex min-h-14 items-center justify-between gap-4 rounded-full bg-mint px-7 font-mono text-[0.6875rem] tracking-[0.18em] text-ink uppercase shadow-[0_14px_36px_-10px_rgb(0_0_0/0.85)]"
      >
        Book a table
        <span aria-hidden>→</span>
      </BookButton>
    </div>
  );
}
