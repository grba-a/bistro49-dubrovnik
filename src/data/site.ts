/**
 * Every real-world fact about the restaurant lives here, so no component ever
 * hardcodes a phone number or invents a statistic.
 * Sources: the client's own site/footer, their Google Business listing,
 * TripAdvisor, and Gault&Millau Croatia.
 */

export const SITE = {
  name: "Bistro 49",
  legalName: "ZUO PUPO | BISTRO 49",
  owners: "N. Farčić & M. Kuznin",
  oib: "15769729553",
  chef: "Ivan Zmijarević",

  address: {
    street: "Obala Ivana Pavla II 49",
    postcode: "20000",
    city: "Dubrovnik",
    district: "Gruž",
    country: "Croatia",
  },

  phone: { display: "020 891 038", href: "tel:+38520891038" },
  mobile: { display: "+385 99 216 5454", href: "tel:+385992165454" },

  social: {
    instagram: "https://www.instagram.com/bistro49_dubrovnik/",
    facebook: "https://www.facebook.com/bistro49dubrovnik/",
    tripadvisor:
      "https://www.tripadvisor.com/Restaurant_Review-g295371-d14055675-Reviews-Bistro_49-Dubrovnik_Dubrovnik_Neretva_County_Dalmatia.html",
  },

  maps: "https://maps.google.com/?q=Bistro+49+Obala+Ivana+Pavla+II+49+Dubrovnik",

  /** Verified counts, not decoration. */
  ratings: [
    { source: "Google", score: "4.5", count: "1,753 reviews" },
    { source: "Tripadvisor", score: "4.3", count: "#154 of 448 in Dubrovnik" },
  ],

  /** Why the address matters — the strongest conversion lever for this location. */
  arrival: [
    { time: "3 min", label: "Dubrovnik bus station" },
    { time: "5 min", label: "Gruž cruise terminal" },
    { time: "6 min", label: "Ferry & catamaran pier" },
    { time: "15 min", label: "Old Town by bus" },
  ],
} as const;

/**
 * One switch for every price on the site.
 *
 * The numbers themselves are not going anywhere — all of `menu.ts` and the five
 * in `dishes.ts` stay exactly where they are, because they are coming back the
 * moment the client confirms them. Flip `shown` to `true` and every price on
 * the site returns in the same instant.
 *
 * While they are off, the price column is not deleted. A menu whose right-hand
 * edge simply vanishes reads as a page that failed to load, and the rows lose
 * the vertical rhythm the tabular figures were giving them. The column stays
 * and holds a mark, so the ledger keeps its shape and the absence looks
 * deliberate rather than broken. An em dash is the typographic form of "figure
 * withheld"; `placeholder` is one string to change if a blunter "--- €" is
 * wanted instead.
 *
 * `note` is the only place the absence is explained, and it is written to
 * convert rather than to apologise — the answer to "how much?" becomes a phone
 * call, which is a thing this page wants to cause anyway.
 *
 * Why now: the figures in `menu.ts` were converted from the kuna-era card and
 * have never been confirmed by the client. Publishing a number a guest is then
 * charged differently for is worse than publishing none.
 */
export const PRICES: {
  shown: boolean;
  placeholder: string;
  note: string;
} = {
  shown: false,
  placeholder: "—",
  note: "Prices are not published here at the moment — call us and we will tell you, or ask when you sit down.",
};

/**
 * Where a booking request goes once the dialog has written it out.
 *
 * The client's own WordPress runs a Contact Form 7 reservation form, so a
 * booking form is what they already work with — but its recipient lives in
 * their WP settings and is not published anywhere we can read. Until we are
 * given an inbox (or a key for one), the dialog hands the finished request to a
 * channel the restaurant demonstrably reads instead of posting it into nothing.
 *
 * `whatsapp` is their published mobile. NOTE: that the number carries WhatsApp
 * is an assumption — the sister restaurant's does, on the consecutive number —
 * and it needs one message to confirm before this goes live.
 *
 * `email` is null because no address for Bistro 49 is published on their site,
 * their listings, or in anything the client has sent. Fill it in and the email
 * button appears; nothing else changes.
 */
export const BOOKING: {
  whatsapp: string;
  email: string | null;
} = {
  whatsapp: "https://wa.me/385992165454",
  email: null,
};

/** Real guest reviews, quoted as written. */
export const REVIEWS = [
  {
    quote:
      "Great place and great food. Very near the main bus station and a great place to eat. Nice hamburgers and pizzas! All recommendations.",
    author: "Robert F.",
  },
  {
    quote:
      "Great food and a good location next to a major bus network. The people were friendly and the atmosphere was warm and cozy.",
    author: "Luka U.",
  },
  {
    quote:
      "Every meal I've had so far was high quality, fresh, and full of flavor — including the burgers.",
    author: "Google review",
  },
  {
    quote:
      "Great food at a good price, the service was great, workers are friendly and nice. I suggest you get the wok, it is very tasty and filling.",
    author: "Gabriel G.",
  },
  {
    quote:
      "Delivery has always been on time, and the delivery staff are polite and professional.",
    author: "Google review",
  },
] as const;
