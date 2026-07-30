import type { ReactNode } from "react";

/**
 * Section shell. Exists so vertical rhythm and the kicker/heading relationship
 * are defined once — the old site's biggest tell was that every band had a
 * different, arbitrary amount of air around it.
 */
export function Section({
  id,
  kicker,
  className = "",
  children,
}: {
  id?: string;
  kicker?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`relative py-20 md:py-32 ${className}`}
      // Anchored sections need clearance for the fixed header.
      style={id ? { scrollMarginTop: "5rem" } : undefined}
    >
      {kicker && (
        <div className="container-x mb-8 md:mb-12">
          <p data-reveal className="kicker">
            {kicker}
          </p>
        </div>
      )}
      {children}
    </section>
  );
}

/** A hairline that reads as a deliberate rule rather than a browser default. */
export function Rule() {
  return <div className="container-x"><div className="h-px w-full bg-white/8" /></div>;
}
