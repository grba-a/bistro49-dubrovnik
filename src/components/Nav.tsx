"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BookButton } from "./booking/BookButton";

const LINKS = [
  { href: "/#day", label: "The Day" },
  { href: "/#signatures", label: "Signatures" },
  { href: "/menu", label: "Menu" },
  { href: "/#find", label: "Find Us" },
];

export function Nav() {
  const [lifted, setLifted] = useState(false);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      // data-* hooks are read by tools/singlefile-runtime.js, which reproduces
      // this behaviour in the portable one-file export.
      data-nav
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ease-out ${
        lifted
          ? "border-b border-white/8 bg-ink/85 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between gap-4 md:h-20">
        <Link
          href="/"
          className="pressable flex items-center gap-3"
          aria-label="Bistro 49, home"
        >
          <Image
            src="/images/logo-b49.webp"
            alt=""
            width={40}
            height={40}
            className="size-9 md:size-10"
            priority
          />
          <span className="font-mono text-[0.6875rem] tracking-[0.22em] text-bone uppercase">
            Bistro 49
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="pressable font-mono text-[0.6875rem] tracking-[0.18em] text-muted uppercase hover:text-bone"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/menu"
            className="pressable rounded-full border border-white/15 px-4 py-2 font-mono text-[0.625rem] tracking-[0.18em] text-bone uppercase hover:border-mint hover:text-mint md:hidden"
          >
            Menu
          </Link>
          {/* Opens the booking dialog. The href is the no-JavaScript
              fallback: the reserve section, which carries the phone number. */}
          <BookButton
            href="/#reserve"
            className="pressable hidden rounded-full bg-mint px-5 py-2.5 font-mono text-[0.625rem] tracking-[0.18em] text-ink uppercase hover:bg-mint-bright md:inline-flex"
          >
            Book a table
          </BookButton>
        </div>
      </div>
    </header>
  );
}
