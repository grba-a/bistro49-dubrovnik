"use client";

import { useBooking } from "./BookingProvider";

/**
 * Any "Book a table" on the site.
 *
 * It renders a real anchor rather than a button, and the href is a genuine
 * destination — the reserve section, or the phone. With JavaScript running the
 * click is cancelled and the dialog opens; without it the link still goes
 * somewhere useful instead of being a dead control. `aria-haspopup="dialog"`
 * is what tells a screen reader that this link opens a dialog rather than
 * moving the page.
 *
 * Everything else is passed straight through, so the hero can still hang its
 * `data-hero-fade` hook on the element GSAP is looking for.
 *
 * A modifier-click is deliberately left alone, so cmd-clicking the header
 * button still behaves like a link.
 */
export function BookButton({
  href,
  children,
  onClick,
  ...rest
}: React.ComponentPropsWithoutRef<"a"> & { href: string }) {
  const { open } = useBooking();

  return (
    <a
      {...rest}
      href={href}
      aria-haspopup="dialog"
      onClick={(event) => {
        onClick?.(event);
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return;
        }
        event.preventDefault();
        open();
      }}
    >
      {children}
    </a>
  );
}
