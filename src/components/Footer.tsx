import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/data/site";
import { HOURS } from "@/lib/hours";

export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-surface/40">
      <div className="container-x py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Image
              src="/images/logo-b49.webp"
              alt="Bistro 49"
              width={56}
              height={56}
              className="size-12"
            />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
              A family bistro on the Gruž harbour. Urban Mediterranean, with a
              global touch.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="kicker text-muted">Visit</p>
            <address className="mt-3 text-sm leading-relaxed text-bone not-italic">
              {SITE.address.street}
              <br />
              {SITE.address.postcode} {SITE.address.city}
              <br />
              {SITE.address.country}
            </address>
            <p className="mt-3 text-sm text-muted">
              <a href={SITE.phone.href} className="hover:text-bone">
                {SITE.phone.display}
              </a>
              <br />
              <a href={SITE.mobile.href} className="hover:text-bone">
                {SITE.mobile.display}
              </a>
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="kicker text-muted">Hours</p>
            <p className="mt-3 text-sm leading-relaxed text-bone">
              {HOURS.label}
              <br />
              <span className="text-muted">{HOURS.closedLabel}</span>
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="kicker text-muted">Follow</p>
            <ul className="mt-3 flex flex-col gap-1.5 text-sm">
              {[
                { href: SITE.social.instagram, label: "Instagram" },
                { href: SITE.social.facebook, label: "Facebook" },
                { href: SITE.social.tripadvisor, label: "Tripadvisor" },
              ].map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted hover:text-mint"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <Link
              href="/menu"
              className="mt-4 inline-block text-sm text-muted hover:text-mint"
            >
              Menu
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/8 pt-6 font-mono text-[0.6875rem] tracking-wide text-muted md:flex-row md:items-center md:justify-between">
          <p>
            {SITE.legalName} · vl. {SITE.owners} · OIB {SITE.oib}
          </p>
          <p>
            © {new Date().getFullYear()} {SITE.name}, {SITE.address.city}
          </p>
        </div>
      </div>
    </footer>
  );
}
