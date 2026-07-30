import Image from "next/image";

/**
 * Live music, happy hour and themed dinners exist — they're all over the
 * restaurant's own Instagram highlights — and appear nowhere on the current
 * website. This is the single largest piece of the business that was invisible
 * online, and it's what brings locals back out of season.
 *
 * The copy deliberately doesn't promise a schedule the house doesn't publish.
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
          src="/images/bistro2024-4.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover brightness-[0.5]"
          data-parallax="10"
        />
        <div className="absolute inset-0 bg-ink/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink" />
      </div>

      <div className="container-x relative py-20 md:py-28">
        <p data-reveal className="kicker">
          After dark
        </p>

        <h2
          data-reveal
          className="mt-8 max-w-3xl text-3xl text-balance md:text-5xl lg:text-6xl"
        >
          Some evenings there is a guitar. We never announce it far in advance.
        </h2>

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
