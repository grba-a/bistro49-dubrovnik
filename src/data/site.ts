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
