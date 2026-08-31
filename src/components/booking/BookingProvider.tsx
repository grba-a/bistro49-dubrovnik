"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { BookingDialog } from "./BookingDialog";

/**
 * One dialog for the whole site.
 *
 * Every "Book a table" on every page — the header, the hero, the reserve
 * section, the menu, the thumb bar on a phone — opens the same instance. The
 * alternative, a dialog per section, means five copies of the form state and
 * five ways for them to disagree.
 */

type BookingContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function useBooking(): BookingContextValue {
  const value = useContext(BookingContext);
  if (!value) {
    throw new Error("useBooking must be used inside <BookingProvider>");
  }
  return value;
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, open, close }),
    [isOpen, open, close],
  );

  return (
    <BookingContext.Provider value={value}>
      {/* `children` is a stable element, so opening the dialog does not
          re-render the page behind it. */}
      {children}
      <BookingDialog />
    </BookingContext.Provider>
  );
}
