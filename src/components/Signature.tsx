import Image from "next/image";
import Link from "next/link";
import { SIGNATURES } from "@/data/dishes";
import { Section } from "./Section";

/**
 * The plates guests actually name in reviews, set as oversized type with the
 * photograph crossing it — the one device worth borrowing from the reference
 * sites, applied to food instead of 3D renders.
 *
 * Rows alternate so the eye zig-zags down the page rather than scanning a
 * column of identical cards.
 */
export function Signature() {
  return (
    <Section id="signatures" kicker="Served with pride">
      <div className="container-x">
        <h2 data-reveal className="max-w-3xl text-3xl text-balance md:text-5xl">
          Five plates people come back for.
        </h2>
      </div>

      <div className="mt-16 flex flex-col md:mt-24">
        {SIGNATURES.map((dish, i) => {
          const flip = i % 2 === 1;

          return (
            <article
              key={dish.name}
              className="group relative border-t border-white/8 py-10 md:py-16"
            >
              <div className="container-x">
                <div
                  className={`relative flex flex-col gap-6 md:flex-row md:items-center md:gap-10 ${
                    flip ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* The name, oversized. `min-w-0` lets it shrink instead of
                      forcing the row wider than the viewport. */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-4">
                      <span className="kicker text-muted">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="numeric text-sm text-mint">
                        € {dish.price}
                      </span>
                    </div>

                    <h3
                      data-reveal
                      className="mt-3 leading-[0.92] text-bone"
                      style={{ fontSize: "clamp(2rem, 5.2vw, 4.5rem)" }}
                    >
                      {dish.name}
                    </h3>

                    <p
                      data-reveal
                      className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-muted"
                    >
                      {dish.note}
                    </p>
                  </div>

                  {/* The plate. Negative margin on desktop pulls it over the
                      type; hover lifts it a hair so the row feels alive without
                      moving the layout. */}
                  <div
                    data-clip
                    className={`relative w-full shrink-0 overflow-hidden rounded-sm md:w-[38%] lg:w-[34%] ${
                      dish.orientation === "portrait"
                        ? "aspect-3/4"
                        : "aspect-4/3"
                    } ${flip ? "md:-mr-[4%]" : "md:-ml-[4%]"}`}
                  >
                    <Image
                      src={dish.image}
                      alt={dish.alt}
                      fill
                      sizes="(min-width: 768px) 38vw, 100vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="container-x mt-14 border-t border-white/8 pt-10 md:mt-20">
        <div
          data-reveal
          className="flex flex-wrap items-center justify-between gap-6"
        >
          <p className="max-w-md font-display text-xl text-balance md:text-2xl">
            Twelve pizzas, six burgers, seven woks and the Classics after six.
          </p>
          <Link
            href="/menu"
            className="pressable rounded-full bg-mint px-6 py-3 font-mono text-[0.6875rem] tracking-[0.18em] text-ink uppercase hover:bg-mint-bright"
          >
            The full menu
          </Link>
        </div>
      </div>
    </Section>
  );
}
