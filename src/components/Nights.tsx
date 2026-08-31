import Image from "next/image";

/**
 * Live music, happy hour and themed dinners exist — they're all over the
 * restaurant's own Instagram highlights — and appeared nowhere on the old
 * website. This is the single largest piece of the business that was invisible
 * online, and it's what brings locals back out of season.
 *
 * It sits directly after the Day Arc, so the page keeps running in real time:
 * the arc ends at dinner and the night carries on from there, which is also the
 * second half of the promise the hero makes ("last song after midnight").
 *
 * Both photographs are the restaurant's own, pulled from their media library:
 * the pendant lights carry the evening, and the guitar says "live music"
 * without a stock shot of a band on a stage. The guitar's worn petrol blue
 * happens to be the same blue as the banquettes.
 *
 * The copy deliberately never promises a schedule the house doesn't publish.
 */
export function Nights() {
  return (
    <section
      id="nights"
      className="relative overflow-hidden"
      style={{ scrollMarginTop: "5rem" }}
    >
      <div className="absolute inset-0">
        <Image
          src="/images/b49-lights.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover brightness-[0.4]"
          data-parallax="10"
        />
        <div className="absolute inset-0 bg-ink/78" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink" />
      </div>

      <div className="container-x relative py-20 md:py-28">
        <p data-reveal className="kicker">
          After dark
        </p>

        <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-12 md:items-end md:gap-12">
          <h2
            data-reveal
            className="text-3xl text-balance md:col-span-7 md:text-5xl lg:text-6xl"
          >
            Some evenings there is a guitar. We never announce it far in
            advance.
          </h2>

          <div className="md:col-span-5">
            <div
              data-clip
              className="relative aspect-4/3 w-full overflow-hidden rounded-sm ring-1 ring-white/10"
            >
              <Image
                src="/images/b49-guitar.webp"
                alt="A worn electric guitar in the room at Bistro 49"
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div
          data-reveal-group
          className="mt-14 grid grid-cols-1 gap-10 md:mt-20 md:grid-cols-3 md:gap-8"
        >
          {[
            {
              title: "Live music",
              body: "Through the season and into the winter, someone plays. Ask the bar who is on this week, or watch the stories.",
            },
            {
              title: "Happy hour",
              body: "The stretch of late afternoon when the terrace fills up and the harbour turns gold. Craft beer, local wine, a full bar.",
            },
            {
              title: "Themed dinners & events",
              body: "We cook for groups, celebrations and off-site events, and we build the menu around what you actually want.",
            },
          ].map((card) => (
            <div
              key={card.title}
              data-reveal
              className="border-t border-white/12 pt-6"
            >
              <h3 className="font-display text-2xl text-bone">{card.title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
                {card.body}
              </p>
            </div>
          ))}
        </div>

        <p
          data-reveal
          className="mt-14 font-mono text-xs tracking-[0.16em] text-muted uppercase md:mt-20"
        >
          Kitchen and bar until midnight · Monday to Saturday
        </p>
      </div>
    </section>
  );
}
