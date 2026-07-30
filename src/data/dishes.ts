/**
 * The four time-based menus the house actually runs. This is the spine of the
 * whole page: it's their real operating structure *and* their only true
 * differentiator in Dubrovnik — one address that works at 08:00 and at 23:00.
 */

export type Chapter = {
  index: string;
  time: string;
  name: string;
  window: string;
  headline: string;
  body: string;
  image: string;
  alt: string;
  /** Drives the warm→cool light shift across the day. */
  tint: "amber" | "warm" | "neutral" | "mint";
};

export const CHAPTERS: Chapter[] = [
  {
    index: "01",
    time: "08:00",
    name: "Breakfast",
    window: "08:00 — 11:00",
    headline: "The coffee is for the neighbourhood.",
    body: "Before the first ship is tied up, the room belongs to Gruž. Muesli, eggs, warm bread and a cappuccino that nobody rushes you through.",
    image: "/images/bistro2024-101.webp",
    alt: "Breakfast bowl with fruit and muesli beside a cappuccino",
    tint: "amber",
  },
  {
    index: "02",
    time: "11:00",
    name: "Brunch",
    window: "11:00 — 14:00",
    headline: "The long middle of the day.",
    body: "Flatbread off the board, something grilled, something cold to drink. The hour when the harbour is loudest and nobody is in a hurry.",
    image: "/images/bis-52.webp",
    alt: "Grilled flatbread on a wooden board with red onion and dip",
    tint: "warm",
  },
  {
    index: "03",
    time: "11:00",
    name: "Bistro 49",
    window: "11:00 — 23:00",
    headline: "Something for everyone. We mean it.",
    body: "Wood-fired pizza, a proper burger, a wok that comes out steaming. Twelve hours of the menu that made people come back.",
    image: "/images/bistro2024-13.webp",
    alt: "Burger B49 on a wooden board with sweet potato fries",
    tint: "neutral",
  },
  {
    index: "04",
    time: "18:00",
    name: "Bistronomy 49",
    window: "18:00 — 23:00",
    headline: "When the harbour goes dark, the kitchen gets serious.",
    body: "Adriatic cuttlefish, slow-cooked beef cheeks, demi-glace and pistachio pesto. The same room, a quieter register.",
    image: "/images/bistro2024-73.webp",
    alt: "Plated fine dining dish with dark sauce, beetroot and herb quenelle",
    tint: "mint",
  },
];

/** Signature plates — the ones guests name in reviews. */
export type Signature = {
  name: string;
  note: string;
  price: string;
  image: string;
  alt: string;
  /** Portrait crops layer over the display type; landscape sit beside it. */
  orientation: "portrait" | "landscape";
};

export const SIGNATURES: Signature[] = [
  {
    name: "Burger B49",
    note: "100% beef, bacon, smoked cheese, tomato, onion jam",
    price: "7,83",
    image: "/images/bistro2024-41.webp",
    alt: "Burger B49 held in hand against a dark background",
    orientation: "portrait",
  },
  {
    name: "Pizza B49",
    note: "Bacon, prosciutto, mozzarella, rocket, cherry tomato",
    price: "7,83",
    image: "/images/bistro49-iii-101.webp",
    alt: "Long wood-fired pizza being sliced on a board",
    orientation: "landscape",
  },
  {
    name: "Teriyaki Chicken",
    note: "Chicken, noodles, julienne vegetables, teriyaki",
    price: "9,56",
    image: "/images/b49-46.webp",
    alt: "Wok bowl of teriyaki chicken with noodles and vegetables",
    orientation: "landscape",
  },
  {
    name: "Beef Tagliata",
    note: "180 g sliced beefsteak, pistachio pesto, demi-glace",
    price: "21,90",
    image: "/images/bis-25.webp",
    alt: "Sliced beefsteak with grilled tomato and fries",
    orientation: "landscape",
  },
  {
    name: "Meat Platter De Luxe",
    note: "For two. Beefsteak, rumpsteak, ćevapi, pork belly, ajvar",
    price: "33,18",
    image: "/images/bistro2024-111.webp",
    alt: "Large shared meat platter seen from above",
    orientation: "landscape",
  },
];

/** Atmosphere grid. */
export const GALLERY = [
  {
    src: "/images/bistro2024-4.webp",
    alt: "The neon Bistro 49 sign glowing inside the restaurant",
    span: "wide" as const,
  },
  {
    src: "/images/bistro2024-122.webp",
    alt: "Guests raising glasses of wine across the table",
    span: "tall" as const,
  },
  {
    src: "/images/bistro49-iii-90.webp",
    alt: "A wall of Croatian wine bottles",
    span: "normal" as const,
  },
  {
    src: "/images/bistro49-iii-107.webp",
    alt: "A guest smiling over a burger, wine shelves behind her",
    span: "normal" as const,
  },
  {
    src: "/images/bistro2024-31.webp",
    alt: "A stacked burger beside two glasses of craft beer",
    span: "normal" as const,
  },
  {
    src: "/images/bistro2024-133.webp",
    alt: "Hands reaching across shared boards of grilled food",
    span: "wide" as const,
  },
  {
    src: "/images/bistro2024-105.webp",
    alt: "A dish being finished at the pass beside a coffee",
    span: "normal" as const,
  },
  {
    src: "/images/bistro49-iii-95.webp",
    alt: "A bottle of wine being lifted from the shelf",
    span: "normal" as const,
  },
];
