import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { MenuNav } from "@/components/MenuNav";
import { Nav } from "@/components/Nav";
import { OpenBadge } from "@/components/OpenBadge";
import { ScrollReveal } from "@/components/ScrollReveal";
import { StickyBar } from "@/components/StickyBar";
import { MENU, SERVICES, type DietTag } from "@/data/menu";
import { PRICES, SITE } from "@/data/site";
import { BookButton } from "@/components/booking/BookButton";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "The full Bistro 49 menu: wood-fired pizza, burgers, wok, Adriatic plates and the Bistronomy 49 Classics. Breakfast from 08:00, kitchen until midnight, in Gruž, Dubrovnik.",
  alternates: { canonical: "/menu" },
};

const TAG_LABEL: Record<DietTag, string> = {
  veg: "Vegetarian",
  spicy: "Spicy",
};

const TAG_SHORT: Record<DietTag, string> = {
  veg: "V",
  spicy: "S",
};

export default function MenuPage() {
  return (
    <>
      <Nav />
      <ScrollReveal />

      <main id="main" className="pt-28 md:pt-36">
        {/* ---------- Header ---------- */}
        <header className="container-x">
          <p className="kicker">The menu</p>
          <h1
            className="mt-6 max-w-3xl text-balance"
            style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)", lineHeight: 0.92 }}
          >
            Something for everyone. We mean it literally.
          </h1>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
            <OpenBadge />
            <p className="font-mono text-[0.6875rem] tracking-[0.16em] text-muted uppercase">
              {SITE.address.street} · {SITE.address.district}
            </p>
          </div>
        </header>

        {/* ---------- The four service windows ---------- */}
        <section className="container-x mt-16 md:mt-24">
          <div
            data-reveal-group
            className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4"
          >
            {SERVICES.map((s) => (
              <div key={s.name} data-reveal className="bg-ink p-6">
                <p className="numeric text-sm text-mint">{s.window}</p>
                <h2 className="mt-3 font-display text-xl text-bone">{s.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {s.note}
                </p>
              </div>
            ))}
          </div>
          <p data-reveal className="mt-4 font-mono text-xs text-muted">
            Breakfast and brunch are served from their own cards in the room —
            the à la carte menu below runs from 11:00.
          </p>
        </section>

        {/* ---------- The menu ---------- */}
        <div className="container-x mt-16 md:mt-24">
          {/* `grid-cols-1` is load-bearing, not decoration. Without it the
              single mobile track is sized `auto`, which resolves to the
              max-content width of the category rail — so the rail stops
              scrolling inside itself and drags the whole page sideways instead.
              `minmax(0, 1fr)` caps the track and hands the overflow back to the
              rail. */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-14">
            <div className="min-w-0 md:col-span-3">
              <div className="md:sticky md:top-28">
                <MenuNav />
              </div>
            </div>

            <div className="md:col-span-9">
              {MENU.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="mb-16 md:mb-24"
                  style={{ scrollMarginTop: "7rem" }}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-white/12 pb-4">
                    <h2 className="text-2xl md:text-4xl">{section.title}</h2>
                    {section.note && (
                      <p className="max-w-sm font-mono text-xs text-muted">
                        {section.note}
                      </p>
                    )}
                  </div>

                  <ul data-reveal-group className="mt-2">
                    {section.items.map((item) => (
                      <li
                        key={item.name}
                        data-reveal
                        className="flex items-baseline gap-4 border-b border-white/6 py-4 md:gap-6"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                            <h3 className="font-display text-lg leading-snug text-bone md:text-xl">
                              {item.name}
                            </h3>
                            {item.tags?.map((tag) => (
                              <span
                                key={tag}
                                title={TAG_LABEL[tag]}
                                className="rounded-full border border-mint/40 px-1.5 py-px font-mono text-[0.5625rem] tracking-widest text-mint"
                              >
                                <span aria-hidden>{TAG_SHORT[tag]}</span>
                                <span className="sr-only">
                                  {TAG_LABEL[tag]}
                                </span>
                              </span>
                            ))}
                          </div>
                          {item.description && (
                            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted">
                              {item.description}
                            </p>
                          )}
                        </div>

                        {/* Tabular figures keep the price column dead
                            straight — and the column stays even when the
                            numbers are switched off, holding a mark instead.
                            A menu whose right-hand edge simply vanishes reads
                            as a page that failed to load. */}
                        <p className="numeric shrink-0 text-sm text-bone md:text-base">
                          {PRICES.shown && item.price !== "—" ? (
                            <>€ {item.price}</>
                          ) : (
                            <span className="text-muted">
                              {PRICES.placeholder}
                            </span>
                          )}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}

              {/* Honest footnotes rather than silent assumptions. */}
              <div className="rounded-sm border border-white/10 bg-surface/50 p-6">
                <p className="kicker text-muted">Good to know</p>
                <ul className="mt-4 flex flex-col gap-2 text-sm leading-relaxed text-muted">
                  <li>
                    <span className="text-mint">V</span> vegetarian ·{" "}
                    <span className="text-mint">S</span> spicy. Tell your server
                    about any allergy or intolerance and the kitchen will talk
                    you through the dish.
                  </li>
                  <li>
                    Gluten-free options are available — please ask, rather than
                    relying on this page.
                  </li>
                  <li>
                    Burgers are cooked medium rare unless you ask for well done.
                  </li>
                  <li>
                    {PRICES.shown
                      ? "Prices are for guidance and may change with the season."
                      : PRICES.note}
                  </li>
                </ul>
              </div>

              <div className="mt-12 flex flex-wrap items-center gap-4">
                <BookButton
                  href="/#reserve"
                  className="pressable rounded-full bg-mint px-6 py-3 font-mono text-[0.6875rem] tracking-[0.18em] text-ink uppercase hover:bg-mint-bright"
                >
                  Book a table
                </BookButton>
                <a
                  href={SITE.phone.href}
                  className="pressable rounded-full border border-white/20 px-6 py-3 font-mono text-[0.6875rem] tracking-[0.18em] text-bone uppercase hover:border-mint hover:text-mint"
                >
                  Order delivery · {SITE.phone.display}
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <StickyBar />
    </>
  );
}
