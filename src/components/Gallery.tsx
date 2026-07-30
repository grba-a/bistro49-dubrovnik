import Image from "next/image";
import { GALLERY } from "@/data/dishes";
import { Section } from "./Section";

/**
 * Uniform row height, column spans only.
 *
 * The obvious version — per-tile aspect ratios plus a two-column-wide tile —
 * looks fine on paper and leaves holes in practice: a 16/10 tile spanning two
 * columns is far taller than a 4/3 tile spanning one, the grid row grows to the
 * tallest item, and the short tiles sit above a band of dead background. Fixing
 * the row height instead means every tile is the same height whatever it spans,
 * and `object-cover` absorbs the difference in source aspect (the client's
 * photos are a mix of portrait and landscape).
 */
export function Gallery() {
  return (
    <Section id="room" kicker="The room">
      <div className="container-x">
        <h2 data-reveal className="max-w-2xl text-3xl text-balance md:text-5xl">
          Terrace, bar, open kitchen. Take whichever suits the hour.
        </h2>
      </div>

      <div className="container-x mt-12 md:mt-16">
        <div
          data-reveal-group
          className="grid auto-rows-[9rem] grid-cols-2 gap-3 sm:auto-rows-[11rem] md:auto-rows-[13rem] md:grid-cols-4 lg:auto-rows-[15rem]"
        >
          {GALLERY.map((tile) => (
            <figure
              key={tile.src}
              data-reveal
              className={`group relative h-full overflow-hidden rounded-sm ${
                tile.span === "wide" ? "col-span-2" : ""
              }`}
            >
              <Image
                src={tile.src}
                alt={tile.alt}
                fill
                sizes="(min-width: 768px) 30vw, 50vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            </figure>
          ))}
        </div>

        <p data-reveal className="mt-6 font-mono text-xs text-muted">
          Indoors, on the terrace, or delivered to your apartment, suite or the
          beach.
        </p>
      </div>
    </Section>
  );
}
