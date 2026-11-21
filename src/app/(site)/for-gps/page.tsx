import type { Metadata } from "next";
import Link from "next/link";
import { getClinic, getGp } from "@/lib/content";
import { Container, Eyebrow, Icon, PageHero } from "@/components/ui";
import { Inline, Rich } from "@/components/rich";
import { EnquiryForm } from "@/components/enquiry-form";

export const metadata: Metadata = {
  title: "For GPs and Healthcare Professionals",
  description: "Referral information for GPs: scope, assessment approach, communication, red-flag pathways and funding arrangements at Malak Chiropractic, Panania.",
  alternates: { canonical: "/for-gps" },
};

const toc = [
  ["offer", "What we offer"],
  ["scope", "What can I refer for?"],
  ["referrals", "Referral pathways"],
  ["funding", "Medicare and private health"],
  ["assessment", "Assessment and communication"],
  ["refer-back", "When we refer back"],
  ["contact", "Contact and referral"],
  ["gp-faq", "GP FAQ"],
];

export default function GpPage() {
  const gp = getGp();
  const clinic = getClinic();
  const H = ({ id, n, children }: { id: string; n: string; children: React.ReactNode }) => (
    <h2 id={id} className="flex items-baseline gap-4 font-display text-display-sm text-ink">
      <span className="font-sans text-sm font-semibold text-burgundy">{n}</span>
      {children}
    </h2>
  );
  return (
    <>
      <PageHero eyebrow="For GPs and healthcare professionals" title="Musculoskeletal care that works alongside yours." intro={<p>{gp.intro}</p>}>
        <div className="flex flex-wrap gap-3">
          <a href="#contact" className="inline-flex min-h-11 items-center rounded-full bg-ink px-5 font-semibold text-white hover:bg-[#2a2e33]">Referral contact</a>
          <Link href="/for-gps/referral-information" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-5 font-semibold text-ink hover:border-ink">
            <Icon name="doc" className="h-5 w-5" /> Referral information sheet
          </Link>
        </div>
      </PageHero>

      <section className="bg-white py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-12">
          <aside className="hidden lg:col-span-3 lg:block">
            <nav aria-label="On this page" className="sticky top-28">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-steel-deep">On this page</p>
              <ol className="mt-4 space-y-2 border-l border-line">
                {toc.map(([id, t]) => (
                  <li key={id}>
                    <a href={`#${id}`} className="-ml-px block border-l border-transparent pl-4 text-sm text-steel-deep hover:border-burgundy hover:text-ink">{t}</a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <div className="space-y-16 lg:col-span-8 lg:col-start-5">
            <section data-reveal>
              <H id="offer" n="01">What does Malak Chiropractic offer?</H>
              <Rich text={gp.offer} className="mt-5" />
            </section>

            <section data-reveal className="border-t border-line pt-16">
              <H id="scope" n="02">What can I refer patients for?</H>
              <ul className="mt-6 grid gap-px overflow-hidden rounded-[18px] bg-line ring-1 ring-line sm:grid-cols-2">
                {gp.scope.map((s) => (
                  <li key={s} className="bg-white p-5 text-[0.95rem] leading-snug text-[#2b2f34]">{s}</li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-steel-deep">{gp.scopeNote}</p>
            </section>

            <section data-reveal className="border-t border-line pt-16">
              <H id="referrals" n="03">Do you accept GP referrals?</H>
              <Rich text={gp.referrals} className="mt-5" />
            </section>

            <section data-reveal className="rounded-[22px] bg-paper p-7 sm:p-9">
              <H id="funding" n="04">Medicare and private health</H>
              <Rich text={gp.medicare} className="mt-5" />
            </section>

            <section data-reveal className="border-t border-line pt-16">
              <H id="assessment" n="05">Clinical assessment and communication</H>
              <Rich text={gp.assessment} className="mt-5" />
              <h3 className="mt-8 font-semibold text-ink">Communication with referring practitioners</h3>
              <Rich text={gp.communication} className="mt-3" />
            </section>

            <section data-reveal className="border-t border-line pt-16">
              <H id="refer-back" n="06">When would you refer a patient back?</H>
              <ul className="mt-6 space-y-3">
                {gp.referBack.map((r) => (
                  <li key={r} className="flex gap-3 text-[#2b2f34]">
                    <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-burgundy" />
                    {r}
                  </li>
                ))}
              </ul>
              <p className="mt-6 rounded-xl bg-white p-4 text-sm text-[#2b2f34] ring-1 ring-burgundy/30">
                Suspected emergencies (e.g. cauda equina syndrome, cervical arterial dysfunction) are directed to the emergency department immediately, with the GP notified the same day.
              </p>
            </section>

            <section data-reveal id="contact" className="border-t border-line pt-16">
              <H id="contact-h" n="07">Contact and referral information</H>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[18px] bg-paper p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-steel-deep">Professional contact</p>
                  <p className="mt-3 text-ink">
                    <a href={`tel:${clinic.phone.replace(/\s/g, "")}`} className="font-semibold hover:text-burgundy">{clinic.phone}</a>
                    <br />
                    <a href={`mailto:${clinic.email}`} className="hover:text-burgundy">{clinic.email}</a>
                    <br />
                    <span className="text-sm text-steel-deep">{clinic.streetAddress}, {clinic.suburb} · {clinic.locationNote}</span>
                  </p>
                </div>
                <div className="rounded-[18px] bg-paper p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-steel-deep">Secure referral pathway</p>
                  <p className="mt-3 text-sm leading-relaxed text-[#2b2f34]"><Inline text={gp.secureReferral} /></p>
                </div>
              </div>
              <p className="mt-8 font-semibold text-ink">Professional enquiry</p>
              <p className="mb-4 text-sm text-steel-deep">For questions about scope, collaboration or referral processes — not for patient referrals.</p>
              <EnquiryForm kind="gp" phone={clinic.phone} email={clinic.email} />
            </section>

            <section data-reveal id="gp-faq" className="border-t border-line pt-16">
              <H id="gp-faq-h" n="08">GP FAQ</H>
              <div className="mt-6 divide-y divide-line border-y border-line">
                {gp.faqs.map((f) => (
                  <details key={f.q} className="acc">
                    <summary className="flex items-center justify-between gap-6 py-5 font-semibold text-ink">
                      {f.q}
                      <span aria-hidden className="acc-icon text-2xl font-light leading-none text-burgundy">+</span>
                    </summary>
                    <div className="pb-6 pr-10 leading-relaxed text-[#2b2f34]"><Inline text={f.a} /></div>
                  </details>
                ))}
              </div>
            </section>
          </div>
        </Container>
      </section>
    </>
  );
}
