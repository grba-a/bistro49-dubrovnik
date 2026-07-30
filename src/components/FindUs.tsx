import { SITE } from "@/data/site";
import { HOURS } from "@/lib/hours";
import { Section } from "./Section";

/**
 * Arrival is the strongest conversion lever this address has, and the old site
 * never mentioned it: the restaurant sits opposite the bus station, minutes from
 * the cruise terminal and the ferry pier. That's the whole reason a stranger
 * ends up here.
 *
 * The map is an iframe with `loading="lazy"` so it costs nothing until it's
 * near the viewport.
 */
export function FindUs() {
  return (
    <Section id="find" kicker="Finding us">
      <div className="container-x grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-5">
          <h2 data-reveal className="text-3xl text-balance md:text-5xl">
            Opposite the bus station, on the harbour road.
          </h2>

          <dl data-reveal-group className="mt-10 flex flex-col">
            {SITE.arrival.map((row) => (
              <div
                key={row.label}
                data-reveal
                className="flex items-baseline justify-between gap-6 border-b border-white/8 py-4"
              >
                <dt className="text-[0.9375rem] text-muted">{row.label}</dt>
                <dd className="numeric shrink-0 text-sm text-mint">
                  {row.time}
                </dd>
              </div>
            ))}
          </dl>

          <div data-reveal className="mt-10 flex flex-col gap-6">
            <div>
              <p className="kicker text-muted">Address</p>
              <p className="mt-2 font-display text-xl text-bone">
                {SITE.address.street}
              </p>
              <p className="text-muted">
                {SITE.address.postcode} {SITE.address.city},{" "}
                {SITE.address.country}
              </p>
            </div>

            <div>
              <p className="kicker text-muted">Hours</p>
              <p className="mt-2 text-bone">{HOURS.label}</p>
              <p className="text-muted">{HOURS.closedLabel}</p>
            </div>

            <div>
              <p className="kicker text-muted">Delivery &amp; takeaway</p>
              <p className="mt-2 text-muted">
                To your apartment, suite or the beach. Call{" "}
                <a
                  href={SITE.phone.href}
                  className="text-bone underline decoration-mint/50 decoration-1 underline-offset-4 hover:decoration-mint"
                >
                  {SITE.phone.display}
                </a>{" "}
                or{" "}
                <a
                  href={SITE.mobile.href}
                  className="text-bone underline decoration-mint/50 decoration-1 underline-offset-4 hover:decoration-mint"
                >
                  {SITE.mobile.display}
                </a>
                .
              </p>
            </div>

            <p className="font-mono text-xs text-muted">
              Street parking in Gruž is tight in season — the bus and ferry
              terminals are both a short walk.
            </p>
          </div>
        </div>

        <div className="md:col-span-7">
          <div
            data-clip
            className="relative aspect-4/3 w-full overflow-hidden rounded-sm border border-white/8 md:aspect-16/12"
          >
            {/* The filter goes on a wrapper, not the iframe: Tailwind's filter
                utilities compose through a CSS variable that a cross-origin
                iframe doesn't inherit, so applied directly they silently do
                nothing and you get a bright map in a dark page. */}
            <div
              className="absolute inset-0"
              style={{
                filter:
                  "invert(0.91) hue-rotate(180deg) saturate(0.55) brightness(0.95) contrast(0.92)",
              }}
            >
              <iframe
                title="Map showing Bistro 49 at Obala Ivana Pavla II 49, Dubrovnik"
                src="https://www.openstreetmap.org/export/embed.html?bbox=18.0790%2C42.6555%2C18.0930%2C42.6625&amp;layer=mapnik&amp;marker=42.6590%2C18.0860"
                loading="lazy"
                className="h-full w-full border-0"
              />
            </div>
          </div>

          <a
            href={SITE.maps}
            target="_blank"
            rel="noreferrer"
            data-reveal
            className="pressable mt-4 inline-flex rounded-full border border-white/20 px-5 py-2.5 font-mono text-[0.625rem] tracking-[0.18em] text-bone uppercase hover:border-mint hover:text-mint"
          >
            Open in Google Maps
          </a>
        </div>
      </div>
    </Section>
  );
}
