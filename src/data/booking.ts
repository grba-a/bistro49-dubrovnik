import { HOURS } from "@/lib/hours";
import { SERVICES } from "./menu";
import { BOOKING, SITE } from "./site";

/**
 * Everything the booking dialog says, and the shape of what it sends.
 *
 * The field list is not invented. The client already takes reservations through
 * a Contact Form 7 form on bistro49-dubrovnik.com/reservations, and this is that
 * form's own set of questions — name, email, date, time, number of people,
 * restaurant or terrace, phone, a free note — rebuilt in this site's language.
 * Three deliberate differences: the room choice gains an "Either", because most
 * people genuinely do not mind and a forced choice is one more question between
 * them and a table; email stops being mandatory, because a phone number is the
 * faster way to confirm and demanding both loses bookings; and the form knows
 * the restaurant is shut on Sundays, which theirs does not.
 */

export const BOOKING_COPY = {
  title: "Book a table",
  /* Hours, not the address. The street is on the page behind this dialog
     twice over, and on a phone the pair wrapped to two lines above a form that
     is already asking for a screenful. What a booking needs is the days. */
  meta: HOURS.label,
  submit: "Send the request",
  /**
   * One line under the button, doing the work of the two paragraphs that were
   * here before: it says a person answers, and it says nothing is being
   * collected — which is why there is no consent checkbox.
   */
  reassure:
    "We read it ourselves and call back to confirm. Nothing is stored on this page.",
  /** Shown when the party is bigger than the chips go. */
  largeGroup:
    "For nine or more we build the menu with you — leave a number and we will call.",
  done: {
    title: "Almost there.",
    body: "Your request is written out and waiting in WhatsApp. Press send there and it comes straight to us.",
    urgent: "Booking for tonight, or a large group? A call is faster.",
    back: "Change something",
  },
  errors: {
    name: "We need a name for the table",
    date: "Pick a day",
    closed: `${HOURS.closedLabel}. Pick another day, or call us about it.`,
    phone: "Leave a number, so we can call back and confirm",
  },
} as const;

/**
 * Four questions and two answers.
 *
 * Their own form asks for an email as well as a phone, and required it. One
 * contact is enough to confirm a table, a phone is the faster of the two, and
 * it is the same number the reply arrives on — so the email field is gone. Every
 * field removed from a booking form on a phone is a booking kept.
 */
export type BookingValues = {
  name: string;
  date: string;
  time: string;
  guests: string;
  place: string;
  phone: string;
  note: string;
};

/** The client's own two rooms, plus the answer most people actually give. */
export const PLACE_OPTIONS = ["Either", "Restaurant", "Terrace"] as const;

/** One tappable row. Nine and over is a conversation, not a number in a form. */
export const GUEST_OPTIONS: readonly string[] = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9+",
];

/**
 * Half-hours from the first coffee to the last sitting: 08:00 to 23:00.
 *
 * The door is open until midnight; the last table goes down at eleven, so the
 * range is the kitchen's rather than the clock's. A native time input was the
 * other option and is worse here — it accepts 03:00, it renders as three
 * different controls across the browsers this page is read in, and on a phone
 * it costs a scroll wheel where a rail of chips costs a tap.
 */
export const TIME_OPTIONS: readonly string[] = Array.from(
  { length: 31 },
  (_, i) => {
    const minutes = 8 * 60 + i * 30;
    return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(
      minutes % 60,
    ).padStart(2, "0")}`;
  },
);

/** The half-hour the rail opens on. Dinner, because that is what gets booked. */
export const DEFAULT_TIME = "19:30";

/**
 * Which of the four services a guest is walking into at a given time.
 *
 * The client's published windows overlap — Bistro 49 runs 11:00–23:00 straight
 * through Brunch and Bistronomy — so they cannot be used as a filter. Read as
 * "what is this hour actually for", they resolve cleanly, and that is what the
 * dialog says out loud as the time changes. It is the site's whole argument in
 * one line: this is not a restaurant with a menu, it is one address with a day.
 */
const SERVICE_WINDOWS = [
  { from: 8, to: 11, name: "Breakfast" },
  { from: 11, to: 14, name: "Brunch" },
  { from: 14, to: 18, name: "Bistro 49" },
  { from: 18, to: 24, name: "Bistronomy 49" },
] as const;

export function serviceAt(time: string): (typeof SERVICES)[number] {
  const hour = Number(time.slice(0, 2)) + Number(time.slice(3, 5)) / 60;
  const window =
    SERVICE_WINDOWS.find((w) => hour >= w.from && hour < w.to) ??
    SERVICE_WINDOWS[3];
  return SERVICES.find((s) => s.name === window.name) ?? SERVICES[2];
}

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/**
 * Today in Dubrovnik as YYYY-MM-DD.
 *
 * Called from the client on open, never at module scope: a value read while the
 * page is being prerendered is the build machine's date, and it would sit in
 * the form as the default until the next deploy — a booking silently made for a
 * day already gone.
 */
export function todayInDubrovnik(): string {
  // `en-CA` formats as YYYY-MM-DD, which is exactly what a date input wants.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: HOURS.timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/**
 * Calendar arithmetic that cannot drift.
 *
 * Every date here is a plain calendar day, so all of it happens in UTC and is
 * read back with UTC getters. `new Date("2026-09-02")` is midnight UTC printed
 * in the reader's own zone, which anywhere west of Greenwich hands the
 * restaurant the day before.
 */
function parseISO(iso: string): Date | null {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(Date.UTC(y, m - 1, d));
}

export function addDays(iso: string, days: number): string {
  const date = parseISO(iso);
  if (!date) return iso;
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** "2026-09-02" to "Wednesday 2 September 2026". */
export function prettyDate(iso: string): string {
  const date = parseISO(iso);
  if (!date) return iso;
  return `${WEEKDAYS[date.getUTCDay()]} ${date.getUTCDate()} ${
    MONTHS[date.getUTCMonth()]
  } ${date.getUTCFullYear()}`;
}

/** The short form the day chips wear: "Fri 5 Sep". */
export function shortDate(iso: string): string {
  const date = parseISO(iso);
  if (!date) return iso;
  return `${WEEKDAYS[date.getUTCDay()].slice(0, 3)} ${date.getUTCDate()} ${MONTHS[
    date.getUTCMonth()
  ].slice(0, 3)}`;
}

/** Sunday. The one day the form must not let anybody book into. */
export function isClosedDay(iso: string): boolean {
  const date = parseISO(iso);
  return date ? date.getUTCDay() === HOURS.closedDay : false;
}

export type BookingErrors = Partial<Record<"name" | "date" | "phone", string>>;

/**
 * What must be true before a request is worth sending.
 *
 * A name, a day the kitchen is actually lit, and a number to call back on.
 * Everything else already has a sensible value sitting in the form, so an
 * honest booking costs two taps and two words.
 */
export function validate(values: BookingValues): BookingErrors {
  const errors: BookingErrors = {};

  if (!values.name.trim()) errors.name = BOOKING_COPY.errors.name;

  if (!values.date) errors.date = BOOKING_COPY.errors.date;
  else if (isClosedDay(values.date)) errors.date = BOOKING_COPY.errors.closed;

  if (!values.phone.trim()) errors.phone = BOOKING_COPY.errors.phone;

  return errors;
}

/**
 * The booking as whoever is holding the restaurant's phone will read it:
 * labelled lines, in the order somebody taking a reservation needs them —
 * when, how many, where, who, and how to reach them.
 */
export function composeRequest(values: BookingValues): string {
  const lines = [
    `Table booking — ${SITE.name}`,
    "",
    `Day: ${prettyDate(values.date)}`,
    `Time: ${values.time} (${serviceAt(values.time).name})`,
    `Guests: ${values.guests}`,
  ];

  if (values.place !== "Either") lines.push(`Where: ${values.place}`);
  lines.push(`Name: ${values.name.trim()}`);
  lines.push(`Phone: ${values.phone.trim()}`);
  if (values.note.trim()) lines.push("", `Note: ${values.note.trim()}`);
  lines.push("", "Sent from bistro49-dubrovnik.com");

  return lines.join("\n");
}

/**
 * Where a composed booking goes.
 *
 * WhatsApp leads because it is the channel that completes on the device this
 * page is mostly read on: a phone with no mail account configured opens a
 * `mailto:` into nothing at all, while `wa.me` either hands off to the app or
 * falls through to the web client. Email is built and ready but stays hidden
 * until `BOOKING.email` is filled in — an address nobody answers is worse than
 * no button.
 *
 * When a real inbox arrives, this is the one place that changes: swap these for
 * a `fetch("/api/booking")` and the dialog above it does not move.
 */
export const channels = {
  whatsapp: (message: string) =>
    `${BOOKING.whatsapp}?text=${encodeURIComponent(message)}`,
  email: (message: string) =>
    BOOKING.email
      ? `mailto:${BOOKING.email}` +
        `?subject=${encodeURIComponent(`Table booking — ${SITE.name}`)}` +
        `&body=${encodeURIComponent(message)}`
      : null,
} as const;
