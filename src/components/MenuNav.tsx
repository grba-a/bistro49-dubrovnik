"use client";

import { useEffect, useState } from "react";
import { MENU } from "@/data/menu";

/**
 * Sticky category rail. The old site's entire menu was a 990 KB PDF, which on a
 * phone means pinch-zooming a page of 8pt type — so the single most important
 * thing here is that a guest can get to "Burgers" in one tap.
 *
 * The active section is tracked with IntersectionObserver rather than scroll
 * maths, so it stays correct with smooth scrolling in play.
 */
export function MenuNav() {
  const [active, setActive] = useState(MENU[0]?.id ?? "");

  useEffect(() => {
    const sections = MENU.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      // Top band only: the heading nearest the header is the one you're reading.
      { rootMargin: "-88px 0px -70% 0px", threshold: 0 },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Menu categories"
      className="sticky top-16 z-30 -mx-5 border-b border-white/8 bg-ink/90 backdrop-blur-xl md:top-20 md:mx-0 md:border-none md:bg-transparent md:backdrop-blur-none"
    >
      {/* Horizontal on mobile, vertical rail on desktop. */}
      <ul className="flex gap-1 overflow-x-auto px-5 py-3 md:flex-col md:gap-0 md:overflow-visible md:px-0 md:py-0">
        {MENU.map((section) => {
          const on = active === section.id;
          return (
            <li key={section.id} className="shrink-0 md:shrink">
              <a
                href={`#${section.id}`}
                aria-current={on ? "true" : undefined}
                className={`pressable block rounded-full px-3 py-1.5 font-mono text-[0.625rem] tracking-[0.16em] whitespace-nowrap uppercase md:rounded-none md:border-l md:px-4 md:py-2.5 ${
                  on
                    ? "bg-mint text-ink md:border-mint md:bg-transparent md:text-mint"
                    : "text-muted md:border-white/10 hover:text-bone"
                }`}
              >
                {section.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
