import { DayArc } from "@/components/DayArc";
import { FindUs } from "@/components/FindUs";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Hero } from "@/components/Hero";
import { Manifesto } from "@/components/Manifesto";
import { Nav } from "@/components/Nav";
import { Nights } from "@/components/Nights";
import { Proof } from "@/components/Proof";
import { Reserve } from "@/components/Reserve";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Signature } from "@/components/Signature";
import { StickyBar } from "@/components/StickyBar";
import { SITE } from "@/data/site";

/** Structured data so the hours, address and rating surface in search. */
const schema = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: SITE.name,
  image: "https://bistro49-dubrovnik.com/images/bistro2024-13.webp",
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    postalCode: SITE.address.postcode,
    addressLocality: SITE.address.city,
    addressCountry: "HR",
  },
  telephone: "+385 20 891 038",
  servesCuisine: ["Mediterranean", "Croatian", "European"],
  priceRange: "€€",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "08:00",
      closes: "24:00",
    },
  ],
  url: "https://bistro49-dubrovnik.com",
  hasMenu: "https://bistro49-dubrovnik.com/menu",
};

export default function Home() {
  return (
    <>
      <Nav />
      <ScrollReveal />
      <main id="main">
        <Hero />
        <Manifesto />
        <DayArc />
        {/* The night follows dinner: the Day Arc ends at Bistronomy (18:00),
            so live music picks up from there rather than after the dishes. */}
        <Nights />
        <Signature />
        <Gallery />
        <Proof />
        <FindUs />
        <Reserve />
      </main>
      <Footer />
      <StickyBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
