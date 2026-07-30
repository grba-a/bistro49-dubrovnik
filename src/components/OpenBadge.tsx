"use client";

import { useEffect, useState } from "react";
import { getOpenState, type OpenState } from "@/lib/hours";

/**
 * Live open/closed state.
 *
 * Deliberately renders nothing on the server and on first paint: the answer
 * depends on the current time, and a server-rendered guess would either
 * hydrate-mismatch or briefly lie to the guest. It appears a frame later
 * instead — reserved space below so nothing shifts.
 */
export function OpenBadge({ className = "" }: { className?: string }) {
  const [state, setState] = useState<OpenState | null>(null);

  useEffect(() => {
    const tick = () => setState(getOpenState());
    tick();
    // Cheap re-check so a badge left open in a tab doesn't go stale.
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      data-open-badge
      className={`flex min-h-6 items-center gap-2.5 ${className}`}
      aria-live="polite"
    >
      {state && (
        <>
          {/* A steady dot with a soft halo rather than a pulse. This badge is on
              screen the entire visit, and per-frame motion the guest never asked
              for gets tiring long before it gets informative. */}
          <span
            className={`size-2 shrink-0 rounded-full ${
              state.isOpen
                ? "bg-mint shadow-[0_0_0_3px_rgba(106,192,179,0.18)]"
                : "bg-muted"
            }`}
          />
          <span className="font-mono text-[0.6875rem] tracking-[0.18em] uppercase">
            <span className={state.isOpen ? "text-bone" : "text-muted"}>
              {state.status}
            </span>
            <span className="text-muted"> · {state.detail}</span>
          </span>
        </>
      )}
    </div>
  );
}
