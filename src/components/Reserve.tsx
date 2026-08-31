import { OpenBadge } from "./OpenBadge";
import { SITE } from "@/data/site";
import { BookButton } from "./booking/BookButton";

/**
 * One primary action per screen. Booking is the primary; calling is secondary,
 * because for a bistro opposite a bus station a phone call is often the real
 * conversion — someone is standing outside with luggage.
 */
export function Reserve() {
  return (
    <section
      id="reserve"
      className="relative border-t border-white/8 py-24 md:py-36"
      style={{ scrollMarginTop: "5rem" }}
    >
      <div className="container-x">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <p data-reveal className="kicker">
              A table at 49
            </p>
            <h2
              data-reveal
              className="mt-8 text-4xl text-balance md:text-6xl lg:text-7xl"
            >
              Come for the coffee. Stay until they turn the music off.
            </h2>
            <div data-reveal className="mt-8">
              <OpenBadge />
            </div>
          </div>

          <div className="flex flex-col gap-4 md:col-span-4 md:col-start-9 md:justify-end">
            {/* This used to point at opentable.com — the generic homepage,
                where Bistro 49 has no listing, so the primary conversion on the
                page led nowhere. It opens the booking dialog now. With
                JavaScript off it falls back to the phone, which is the thing
                the button was standing in for all along. */}
            <div data-reveal>
              <BookButton
                href={SITE.phone.href}
                className="pressable flex items-center justify-between gap-4 rounded-full bg-mint px-7 py-4 font-mono text-[0.6875rem] tracking-[0.18em] text-ink uppercase hover:bg-mint-bright"
              >
                Book a table
                <span aria-hidden>→</span>
              </BookButton>
            </div>

            <a
              href={SITE.phone.href}
              data-reveal
              className="pressable flex items-center justify-between gap-4 rounded-full border border-white/20 px-7 py-4 font-mono text-[0.6875rem] tracking-[0.18em] text-bone uppercase hover:border-mint hover:text-mint"
            >
              {SITE.phone.display}
              <span aria-hidden>↗</span>
            </a>

            <p data-reveal className="mt-2 text-sm leading-relaxed text-muted">
              Large groups, celebrations and catering: call us and we will build
              the menu with you.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
