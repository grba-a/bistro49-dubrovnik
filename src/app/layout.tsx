import type { Metadata, Viewport } from "next";
import { Fraunces, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { SmoothScroll } from "@/lib/smooth-scroll";
import { BookingProvider } from "@/components/booking/BookingProvider";
import "./globals.css";

/* Display: Fraunces is warm and a little idiosyncratic — a family bistro, not a
   fashion house. The SOFT axis rounds the terminals just enough to stay friendly
   at hero size, which generic Playfair can't do. */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "opsz"],
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

/* Mono carries times, prices and the chapter counters — harbour signage logic. */
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bistro49-dubrovnik.com"),
  title: {
    default: "Bistro 49 — Dubrovnik | Breakfast, Bistro & Bistronomy in Gruž",
    template: "%s | Bistro 49 Dubrovnik",
  },
  description:
    "A family bistro on the Gruž harbour, open 08:00 to midnight all year round. Breakfast, brunch, wood-fired pizza, burgers and Bistronomy 49 after dark. Obala Ivana Pavla II 49, Dubrovnik.",
  keywords: [
    "Bistro 49",
    "Dubrovnik restaurant",
    "Gruž",
    "breakfast Dubrovnik",
    "pizza Dubrovnik",
    "burger Dubrovnik",
    "bistronomy",
    "Mediterranean",
  ],
  openGraph: {
    title: "Bistro 49 — Dubrovnik",
    description:
      "One address on the Gruž harbour. First coffee at eight, last song after midnight.",
    url: "/",
    siteName: "Bistro 49 Dubrovnik",
    locale: "en_GB",
    type: "website",
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#08090a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${instrument.variable} ${jetbrains.variable}`}
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-full focus:bg-mint focus:px-5 focus:py-2 focus:font-mono focus:text-xs focus:tracking-widest focus:text-ink focus:uppercase"
        >
          Skip to content
        </a>
        <SmoothScroll>
          {/* One booking dialog for the whole site; every "Book a table"
              anywhere in the tree opens this instance. */}
          <BookingProvider>{children}</BookingProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
