/**
 * Live open/closed state.
 *
 * Real hours: Monday–Saturday 08:00–24:00, Sunday closed. Always evaluated in
 * the restaurant's own timezone — a guest checking from another country should
 * see whether the kitchen is open *in Dubrovnik*, not where they happen to be.
 */

export const HOURS = {
  timeZone: "Europe/Zagreb",
  opensAt: 8, // 08:00
  closesAt: 24, // midnight
  closedDay: 0, // Sunday
  label: "Mon–Sat · 08:00–24:00",
  closedLabel: "Sunday closed",
} as const;

export type OpenState = {
  isOpen: boolean;
  /** Short status for the badge, e.g. "Open now". */
  status: string;
  /** Supporting clause, e.g. "Closes at midnight". */
  detail: string;
};

/** Restaurant-local weekday (0 = Sunday) and decimal hour. */
function localParts(now: Date): { day: number; hour: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: HOURS.timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "0";
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const day = days.indexOf(get("weekday"));
  // Intl renders midnight as "24" in some locales and "00" in others.
  const hour = Number(get("hour")) % 24 + Number(get("minute")) / 60;

  return { day: day === -1 ? new Date().getDay() : day, hour };
}

export function getOpenState(now: Date = new Date()): OpenState {
  const { day, hour } = localParts(now);

  if (day === HOURS.closedDay) {
    return {
      isOpen: false,
      status: "Closed today",
      detail: "We open again Monday at 08:00",
    };
  }

  if (hour < HOURS.opensAt) {
    const mins = Math.round((HOURS.opensAt - hour) * 60);
    return {
      isOpen: false,
      status: "Closed",
      detail:
        mins <= 90 ? `Opening in ${mins} min` : "Doors open at 08:00",
    };
  }

  const untilClose = HOURS.closesAt - hour;

  if (untilClose <= 1) {
    return {
      isOpen: true,
      status: "Last orders",
      detail: `Closing in ${Math.max(1, Math.round(untilClose * 60))} min`,
    };
  }

  return {
    isOpen: true,
    status: "Open now",
    detail: untilClose <= 4 ? "Kitchen open until midnight" : "Open until midnight",
  };
}
