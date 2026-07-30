import Image from "next/image";
import { SITE } from "@/data/site";
import { Section } from "./Section";

/**
 * The origin story, in their own logic: they cooked inside the city walls for
 * years, then deliberately left for the working harbour. That decision is the
 * most interesting thing about the restaurant and the old site buried it in a
 * grey paragraph.
 */
export function Manifesto() {
  return (
    <Section id="about" kicker="The house">
      <div className="container-x grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-7">
          <h2
            data-reveal
            className="text-3xl text-balance md:text-5xl lg:text-6xl"
          >
            For years we cooked inside the walls. Then we chose the harbour.
          </h2>

          <div
            data-reveal-group
            className="mt-8 grid grid-cols-1 gap-6 text-base leading-relaxed text-muted md:mt-12 md:grid-cols-2 md:gap-10"
          >
            <p data-reveal>
              Gruž is not the postcard. It is where the buses pull in, where the
              ships tie up, where the fish arrives before anyone has taken a
              photograph of it. We wanted the working part of the city, and we
              took number 49.
            </p>
            <p data-reveal>
              One family runs this room — the same family behind Konoba Pupo
              inside the old town. Everything on the plate comes from local
              producers and suppliers we have used for years.{" "}
              <span className="text-bone">
                Urban Mediterranean, with a global touch.
              </span>
            </p>
          </div>

          <dl
            data-reveal-group
            className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/8 pt-8 md:mt-16 md:grid-cols-4"
          >
            {[
              { k: "Kitchen", v: SITE.chef },
              { k: "Since", v: "A family in hospitality" },
              { k: "Open", v: "All year round" },
              { k: "Closed", v: "Sundays only" },
            ].map((row) => (
              <div key={row.k} data-reveal>
                <dt className="kicker text-muted">{row.k}</dt>
                <dd className="mt-2 font-display text-lg text-bone">{row.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="md:col-span-5">
          <div
            data-clip
            className="relative aspect-4/5 w-full overflow-hidden rounded-sm"
          >
            <Image
              src="/images/bistro49-iii-95.webp"
              alt="A bottle of wine being lifted from the shelf at Bistro 49"
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
              data-parallax="8"
            />
          </div>
          <p data-reveal className="mt-4 font-mono text-xs text-muted">
            Local wines, craft beer, and a bar that stays open as late as the
            kitchen.
          </p>
        </div>
      </div>
    </Section>
  );
}
