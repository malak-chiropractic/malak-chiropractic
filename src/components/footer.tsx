import Link from "next/link";
import { type Clinic, fullAddress } from "@/lib/content";
import { Inline } from "./rich";
import { Container } from "./ui";
import { NAV } from "./nav";
import { Lockup } from "./brand";

export function SiteFooter({ clinic }: { clinic: Clinic }) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto bg-ink text-white">
      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Lockup tone="dark" className="h-auto w-[15rem]" />
            <p className="font-display mt-8 max-w-sm text-display-sm leading-tight text-white">
              Considered care for the way you move.
            </p>
            <a
              href={clinic.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex min-h-11 items-center rounded-full bg-white px-5 font-semibold text-ink transition-colors hover:bg-butter"
            >
              Book online<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Visit</h2>
              <address className="mt-4 not-italic leading-relaxed text-white/90">
                {clinic.streetAddress}
                <br />
                {clinic.suburb} {clinic.state} {clinic.postcode}
                <br />
                <span className="text-sm text-white/60">{clinic.locationNote}</span>
              </address>
              <a
                className="mt-3 inline-block text-sm text-butter underline underline-offset-4"
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress(clinic))}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get directions<span className="sr-only"> (opens Google Maps in a new tab)</span>
              </a>
            </div>
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Hours</h2>
              <ul className="mt-4 space-y-1 text-white/90">
                {clinic.hours
                  .filter((h) => h.open)
                  .map((h) => (
                    <li key={h.day}>
                      {h.day}
                      <br />
                      <span className="text-white/70">{h.note}</span>
                    </li>
                  ))}
              </ul>
              <h2 className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Contact</h2>
              <ul className="mt-4 space-y-1">
                <li>
                  <a href={`tel:${clinic.phone.replace(/\s/g, "")}`} className="hover:text-butter">
                    {clinic.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${clinic.email}`} className="hover:text-butter">
                    {clinic.email.split("@")[0]}
                    <wbr />@{clinic.email.split("@")[1]}
                  </a>
                </li>
              </ul>
            </div>
            <nav aria-label="Footer">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Explore</h2>
              <ul className="mt-4 space-y-1.5">
                {[...NAV, { href: "/conditions", label: "Conditions" }, { href: "/faq", label: "FAQ" }].map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="text-white/90 hover:text-butter">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-14 grid gap-6 border-t border-white/15 pt-8 text-sm leading-relaxed text-white/65 lg:grid-cols-2">
          <p>
            <strong className="font-semibold text-white">Not for emergencies.</strong> <Inline text={clinic.emergencyNotice} />
          </p>
          <p>
            Information on this website is general in nature and is not a substitute for individual clinical advice.
            Treatment is provided only where clinically appropriate and with informed consent. Individual results vary.
          </p>
          <p className="lg:col-span-2">
            We acknowledge the Traditional Custodians of the land on which we work and pay our respects to Elders past
            and present.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Malak Chiropractic. All rights reserved.</p>
          <ul className="flex flex-wrap gap-4">
            <li>
              <Link href="/privacy" className="hover:text-white">
                Privacy policy
              </Link>
            </li>
            <li>
              <Link href="/website-terms" className="hover:text-white">
                Website terms
              </Link>
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}
