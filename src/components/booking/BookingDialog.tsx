"use client";

import { useEffect, useId, useRef, useState } from "react";
import { scrollLock } from "@/lib/smooth-scroll";
import { BOOKING, SITE } from "@/data/site";
import {
  BOOKING_COPY,
  DEFAULT_TIME,
  GUEST_OPTIONS,
  PLACE_OPTIONS,
  TIME_OPTIONS,
  addDays,
  channels,
  composeRequest,
  isClosedDay,
  serviceAt,
  shortDate,
  todayInDubrovnik,
  validate,
  type BookingErrors,
  type BookingValues,
} from "@/data/booking";
import { useBooking } from "./BookingProvider";

/**
 * The booking dialog.
 *
 * Built on the native `<dialog>` element rather than a div with a high z-index,
 * which buys the three things a hand-rolled modal always gets wrong: the focus
 * trap, Escape, and the page behind it going inert. What is left to do by hand
 * is holding the page still and closing on the backdrop.
 *
 * Everything that can be a tap is a tap. Day, time, party size and room are one
 * kind of object — a chip — so four questions read as one control rather than
 * as four widgets, and a booking costs a name, a number, and two taps. The two
 * things that cannot be chips are the ones that genuinely need typing.
 *
 * The line under the time rail is the reason this is not a generic form: it
 * names which of the four services that hour actually is, in the client's own
 * words. It is the site's whole argument — one address, one day, four registers
 * — restated at the exact moment somebody is choosing where in the day to land.
 *
 * On a phone it is a sheet off the bottom edge, where the thumb already is.
 * From 40rem it is a panel in the middle of the harbour night.
 */

const EMPTY: BookingValues = {
  name: "",
  date: "",
  time: DEFAULT_TIME,
  guests: "2",
  place: "Either",
  phone: "",
  note: "",
};

export function BookingDialog() {
  const { isOpen, close } = useBooking();

  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  const [values, setValues] = useState<BookingValues>(EMPTY);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [sent, setSent] = useState<null | "whatsapp" | "email">(null);
  const [noteOpen, setNoteOpen] = useState(false);
  /** The calendar stays folded away until somebody wants a day past tomorrow. */
  const [pickDay, setPickDay] = useState(false);
  /** Today in Dubrovnik, read on open so no prerendered date is ever baked in. */
  const [today, setToday] = useState("");
  const [wasOpen, setWasOpen] = useState(false);

  const id = useId();
  const field = (name: string) => `${id}-${name}`;

  /**
   * Reset on open, during render rather than in an effect.
   *
   * This is React's own pattern for adjusting state when something upstream
   * changes: it runs before the browser paints, so nothing flashes yesterday's
   * date, and it does not cost the extra render an effect would. It also keeps
   * `todayInDubrovnik()` off the server — `isOpen` can only become true from a
   * click, so the date is always read on the visitor's machine and never baked
   * into a prerender that would then serve a stale day until the next deploy.
   */
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);

    if (isOpen) {
      const now = todayInDubrovnik();
      setToday(now);
      // A date left over from an earlier visit can be in the past by the time
      // the dialog opens again. Anything stale falls forward to today — or to
      // Monday, if today is the one day the kitchen is dark.
      setValues((current) =>
        current.date && current.date >= now && !isClosedDay(current.date)
          ? current
          : { ...current, date: isClosedDay(now) ? addDays(now, 1) : now },
      );
      setErrors({});
      setSent(null);
      setPickDay(false);
    }
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) dialog.showModal();
      scrollLock.lock();
      // The heading takes focus, not the first field: focusing an input on a
      // phone throws the keyboard up over the form before anyone has read what
      // they are looking at.
      headingRef.current?.focus();
    } else {
      if (dialog.open) dialog.close();
      scrollLock.unlock();
    }
  }, [isOpen]);

  /**
   * Open the time rail at the chosen half-hour rather than at 08:00.
   *
   * `scrollIntoView` is the obvious call and the wrong one: it walks up every
   * scrollable ancestor, so it would scroll the sheet itself as well as the
   * rail. This moves the rail and nothing else.
   */
  useEffect(() => {
    if (!isOpen || sent) return;
    const rail = railRef.current;
    const chip = rail?.querySelector<HTMLElement>("[data-selected='true']");
    if (!rail || !chip) return;
    rail.scrollLeft =
      chip.offsetLeft - rail.clientWidth / 2 + chip.offsetWidth / 2;
  }, [isOpen, sent]);

  // If this ever unmounts while open, the page must not be left frozen.
  useEffect(() => () => scrollLock.unlock(), []);

  const set = <K extends keyof BookingValues>(key: K, value: BookingValues[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  const send = (channel: "whatsapp" | "email") => {
    const found = validate(values);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      // Land on the first thing that is actually wrong, rather than making
      // somebody hunt for the amber line.
      if (found.name) nameRef.current?.focus();
      else if (found.date) dateRef.current?.focus();
      else phoneRef.current?.focus();
      return;
    }

    const message = composeRequest(values);

    if (channel === "email") {
      const href = channels.email(message);
      if (!href) return;
      // A mail client is a handoff, not a page: opening it in a tab leaves an
      // empty one behind on every desktop browser.
      window.location.href = href;
    } else {
      window.open(channels.whatsapp(message), "_blank", "noopener,noreferrer");
    }

    setSent(channel);
  };

  const service = serviceAt(values.time);
  const shortcuts = today
    ? [
        { label: "Today", date: today },
        { label: "Tomorrow", date: addDays(today, 1) },
      ]
    : [];

  return (
    <dialog
      ref={dialogRef}
      className="booking-dialog"
      aria-labelledby={field("title")}
      // Escape and the backdrop both route through the same close, so the
      // provider's state never disagrees with what is on screen.
      onClose={close}
      onClick={(event) => {
        if (event.target === dialogRef.current) close();
      }}
    >
      <div className="booking-panel">
        <div className="booking-head flex items-start justify-between gap-6 px-6 py-5 md:px-8">
          <span aria-hidden className="booking-horizon" />

          <div>
            <h2
              id={field("title")}
              ref={headingRef}
              tabIndex={-1}
              className="text-3xl text-bone outline-none md:text-4xl"
            >
              {sent ? BOOKING_COPY.done.title : BOOKING_COPY.title}
            </h2>
            <p className="mt-2.5 font-mono text-[0.625rem] tracking-[0.16em] text-muted uppercase">
              {BOOKING_COPY.meta}
            </p>
          </div>

          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="pressable -mr-1 grid size-11 shrink-0 place-items-center rounded-full border border-white/15 text-muted hover:border-mint hover:text-mint"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {sent ? (
          /* ---------- Handed over ---------- */
          <div className="px-6 py-8 md:px-8">
            <p className="text-[0.9375rem] leading-relaxed text-bone">
              {BOOKING_COPY.done.body}
            </p>

            <p className="mt-8 text-sm leading-relaxed text-muted">
              {BOOKING_COPY.done.urgent}
            </p>
            <a
              href={SITE.phone.href}
              className="pressable mt-3 flex items-center justify-between gap-4 rounded-full border border-white/20 px-7 py-4 font-mono text-[0.6875rem] tracking-[0.18em] text-bone uppercase hover:border-mint hover:text-mint"
            >
              {SITE.phone.display}
              <span aria-hidden>↗</span>
            </a>

            <button
              type="button"
              onClick={() => setSent(null)}
              className="mt-6 font-mono text-[0.6875rem] tracking-[0.18em] text-muted uppercase underline underline-offset-4 hover:text-mint"
            >
              {BOOKING_COPY.done.back}
            </button>
          </div>
        ) : (
          /* ---------- The request ---------- */
          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              send("whatsapp");
            }}
            className="px-6 pt-6 pb-7 md:px-8"
          >
            {/* ---- Which day ----
                Almost every booking is tonight or tomorrow, so those are one
                tap each and the calendar stays folded away until somebody
                actually wants a day further out. */}
            <fieldset>
              <legend className="field-label">Which day</legend>
              <div className="mt-2.5 grid grid-cols-3 gap-2">
                {shortcuts.map((shortcut) => {
                  const shut = isClosedDay(shortcut.date);
                  const on = !pickDay && values.date === shortcut.date;
                  return (
                    <button
                      key={shortcut.label}
                      type="button"
                      disabled={shut}
                      title={shut ? BOOKING_COPY.errors.closed : undefined}
                      onClick={() => {
                        setPickDay(false);
                        set("date", shortcut.date);
                      }}
                      className={`chip ${on ? "chip-on" : ""}`}
                    >
                      {shut ? "Closed" : shortcut.label}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setPickDay(true)}
                  className={`chip ${pickDay ? "chip-on" : ""}`}
                >
                  Another day
                </button>
              </div>

              {pickDay && (
                <input
                  ref={dateRef}
                  id={field("date")}
                  name="date"
                  type="date"
                  autoFocus
                  aria-label="Pick a day"
                  className="field"
                  value={values.date}
                  min={today || undefined}
                  onChange={(event) => set("date", event.target.value)}
                  aria-invalid={errors.date ? true : undefined}
                  aria-describedby={
                    errors.date ? field("date-error") : undefined
                  }
                />
              )}

              {errors.date ? (
                <p id={field("date-error")} className="field-error">
                  {errors.date}
                </p>
              ) : (
                pickDay &&
                values.date && (
                  <p className="mt-2 font-mono text-[0.625rem] tracking-[0.14em] text-muted uppercase">
                    {shortDate(values.date)}
                  </p>
                )
              )}
            </fieldset>

            {/* ---- Time, and what that hour is for ---- */}
            <fieldset className="mt-7">
              <legend className="field-label">What time</legend>
              <div ref={railRef} className="chip-rail mt-2.5 -mx-6 px-6 md:-mx-8 md:px-8">
                {TIME_OPTIONS.map((time) => (
                  <label
                    key={time}
                    data-selected={values.time === time}
                    className={`chip shrink-0 ${values.time === time ? "chip-on" : ""}`}
                  >
                    <input
                      type="radio"
                      name={field("time")}
                      value={time}
                      checked={values.time === time}
                      onChange={() => set("time", time)}
                      className="sr-only"
                    />
                    {time}
                  </label>
                ))}
              </div>

              {/* Not decoration: the four services are the client's own
                  structure, and this says which one they are walking into. */}
              <p className="service-line mt-3" aria-live="polite">
                <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-mint uppercase">
                  {service.name}
                </span>
                <span className="ml-2 text-sm leading-relaxed text-muted">
                  {service.note}
                </span>
              </p>
            </fieldset>

            {/* ---- How many ---- */}
            <fieldset className="mt-6">
              <legend className="field-label">How many</legend>
              <div className="mt-2.5 grid grid-cols-5 gap-2 sm:grid-cols-9">
                {GUEST_OPTIONS.map((count) => (
                  <label
                    key={count}
                    className={`chip px-0 ${values.guests === count ? "chip-on" : ""}`}
                  >
                    <input
                      type="radio"
                      name={field("guests")}
                      value={count}
                      checked={values.guests === count}
                      onChange={() => set("guests", count)}
                      className="sr-only"
                    />
                    {count}
                  </label>
                ))}
              </div>
              {values.guests === "9+" && (
                <p className="mt-2.5 text-sm leading-relaxed text-muted">
                  {BOOKING_COPY.largeGroup}
                </p>
              )}
            </fieldset>

            {/* ---- Which room ---- */}
            <fieldset className="mt-6">
              <legend className="field-label">Where</legend>
              <div className="mt-2.5 grid grid-cols-3 gap-2">
                {PLACE_OPTIONS.map((option) => (
                  <label
                    key={option}
                    className={`chip ${values.place === option ? "chip-on" : ""}`}
                  >
                    <input
                      type="radio"
                      name={field("place")}
                      value={option}
                      checked={values.place === option}
                      onChange={() => set("place", option)}
                      className="sr-only"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </fieldset>

            {/* ---- Who ---- */}
            <div className="mt-7 flex flex-col gap-4">
              <div>
                <label className="field-label" htmlFor={field("name")}>
                  Name
                </label>
                <input
                  ref={nameRef}
                  id={field("name")}
                  name="name"
                  type="text"
                  autoComplete="name"
                  className="field"
                  placeholder="Who is the table for?"
                  value={values.name}
                  onChange={(event) => set("name", event.target.value)}
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={errors.name ? field("name-error") : undefined}
                />
                {errors.name && (
                  <p id={field("name-error")} className="field-error">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="field-label" htmlFor={field("phone")}>
                  Phone
                </label>
                <input
                  ref={phoneRef}
                  id={field("phone")}
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  className="field"
                  placeholder="+385 …"
                  value={values.phone}
                  onChange={(event) => set("phone", event.target.value)}
                  aria-invalid={errors.phone ? true : undefined}
                  aria-describedby={
                    errors.phone ? field("phone-error") : undefined
                  }
                />
                {errors.phone && (
                  <p id={field("phone-error")} className="field-error">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Folded away, because most bookings have nothing to add and an
                  empty textarea is just height between somebody and the table. */}
              {noteOpen ? (
                <div>
                  <label className="field-label" htmlFor={field("note")}>
                    Anything to add
                  </label>
                  <textarea
                    id={field("note")}
                    name="note"
                    rows={3}
                    autoFocus
                    className="field"
                    placeholder="A birthday, a high chair, an allergy, a table by the water…"
                    value={values.note}
                    onChange={(event) => set("note", event.target.value)}
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setNoteOpen(true)}
                  className="-my-2 self-start py-2 font-mono text-[0.625rem] tracking-[0.18em] text-muted uppercase underline underline-offset-4 hover:text-mint"
                >
                  + Add a note
                </button>
              )}
            </div>

            <div className="mt-7 flex flex-col gap-3">
              <button
                type="submit"
                className="pressable flex items-center justify-between gap-4 rounded-full bg-mint px-7 py-4 font-mono text-[0.6875rem] tracking-[0.18em] text-ink uppercase hover:bg-mint-bright"
              >
                {BOOKING_COPY.submit}
                <span aria-hidden>→</span>
              </button>

              {/* Only when there is an inbox to send it to. */}
              {BOOKING.email && (
                <button
                  type="button"
                  onClick={() => send("email")}
                  className="pressable flex items-center justify-between gap-4 rounded-full border border-white/20 px-7 py-4 font-mono text-[0.6875rem] tracking-[0.18em] text-bone uppercase hover:border-mint hover:text-mint"
                >
                  Send by email instead
                  <span aria-hidden>↗</span>
                </button>
              )}
            </div>

            <p className="mt-4 text-xs leading-relaxed text-muted">
              {BOOKING_COPY.reassure}
            </p>
          </form>
        )}
      </div>
    </dialog>
  );
}
