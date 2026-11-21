import type { Metadata } from "next";
import { getClinic, getPricing, fullAddress } from "@/lib/content";
import { BookButton, Container, Eyebrow, Icon, PageHero, TextLink } from "@/components/ui";
import { Inline } from "@/components/rich";
import { MapEmbed } from "@/components/map-embed";

export const metadata: Metadata = {
  title: "New Patients",
  description: "Your first visit to Malak Chiropractic in Panania: what to expect, what to wear and bring, fees, rebates, Medicare, DVA and workers compensation, and our cancellation policy.",
  alternates: { canonical: "/new-patients" },
};

export default function NewPatientsPage() {
  const c = getClinic();
  const p = getPricing();
  const prep = [
    { icon: "consult", t: "What to wear", d: "Comfortable clothing you can move in, like activewear. Most assessments don't require undressing, and we'll always explain and ask first." },
    { icon: "doc", t: "What to bring", d: "A list of your medications, any relevant scans or reports, your health fund card, and any referral letter (Medicare, DVA or workers compensation)." },
    { icon: "clock", t: "How long it takes", d: p.items[0]?.duration ?? "[TO CONFIRM: duration]" },
    { icon: "shield", t: "Do I need X-rays?", d: "Usually not. Imaging is only considered when there are signs of a serious condition or when results would change your care — and we'd coordinate it with your GP." },
  ];
  return (
    <>
      <PageHero eyebrow="New patients" title="Your first visit, step by step." intro={<p>Everything you need to know before you arrive — so you can spend your appointment on what matters.</p>}>
        <BookButton url={c.bookingUrl} label="Book your first appointment" />
      </PageHero>

      <section className="bg-white py-16 sm:py-24">
        <Container>
          <Eyebrow index="01">At your initial consultation</Eyebrow>
          <ol className="mt-10 grid gap-px overflow-hidden rounded-[24px] bg-line ring-1 ring-line md:grid-cols-4">
            {[
              ["Your story", "We'll talk through your concern, health history, medications and goals."],
              ["Examination", "Movement, orthopaedic and neurological testing tailored to your symptoms."],
              ["Explanation", "What we think is going on, your options, the risks and benefits, and costs."],
              ["Your plan", "Treatment only if appropriate and you consent — plus exercises and advice."],
            ].map(([t, d], i) => (
              <li key={t} className="bg-white p-7" data-reveal style={{ transitionDelay: `${i * 70}ms` }}>
                <span className="font-display text-[2.5rem] leading-none text-sky-deep">{i + 1}</span>
                <h3 className="mt-4 font-semibold text-ink">{t}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-steel-deep">{d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-6 rounded-[20px] bg-paper p-6 text-[0.95rem] leading-relaxed text-[#2b2f34]" data-reveal>
            <strong className="text-ink">Suitability and consent.</strong> Your history and examination guide whether chiropractic care is right for you. If it isn&apos;t, or if another service would suit you better, we&apos;ll tell you and help you get there. You can ask questions, decline any technique or stop at any time.
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-paper py-16 sm:py-24">
        <Container>
          <Eyebrow index="02">Before you arrive</Eyebrow>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {prep.map((x) => (
              <li key={x.t} className="flex gap-5 rounded-[20px] bg-white p-7 ring-1 ring-line" data-reveal>
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper text-burgundy"><Icon name={x.icon} /></span>
                <div>
                  <h3 className="font-semibold text-ink">{x.t}</h3>
                  <p className="mt-1.5 leading-relaxed text-steel-deep"><Inline text={x.d} /></p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section id="fees" className="bg-white py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4" data-reveal>
            <Eyebrow index="03">Fees</Eyebrow>
            <h2 className="font-display mt-6 text-display-md leading-tight text-ink">Clear pricing, no surprises.</h2>
            <p className="mt-4 leading-relaxed text-steel-deep">{p.intro}</p>
          </div>
          <div className="lg:col-span-8" data-reveal>
            <ul className="divide-y divide-line border-y border-line">
              {p.items.map((i) => (
                <li key={i.name} className="grid gap-2 py-6 sm:grid-cols-12 sm:gap-6">
                  <div className="sm:col-span-8">
                    <h3 className="font-semibold text-ink">{i.name}</h3>
                    {i.duration && <p className="mt-0.5 text-sm text-steel-deep"><Inline text={i.duration} /></p>}
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-[#2b2f34]">{i.description}</p>
                  </div>
                  <p className="font-display text-2xl text-ink sm:col-span-4 sm:text-right"><Inline text={i.price} /></p>
                </li>
              ))}
            </ul>
            <dl className="mt-10 grid gap-6 sm:grid-cols-2">
              {[
                ["Payment", p.payments],
                ["Private health rebates", p.rebates],
                ["Medicare (GP referral)", p.medicare],
                ["DVA and workers compensation", p.dvaWorkersComp],
              ].map(([k, v]) => (
                <div key={k} className="rounded-[18px] bg-paper p-6">
                  <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-steel-deep">{k}</dt>
                  <dd className="mt-2 text-[0.95rem] leading-relaxed text-[#2b2f34]"><Inline text={v} /></dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 rounded-[18px] border border-burgundy/30 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-burgundy">Cancellation policy</p>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-[#2b2f34]"><Inline text={p.cancellation} /></p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-paper py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-12 [&>*]:min-w-0">
          <div className="lg:col-span-5" data-reveal>
            <Eyebrow index="04">Getting here</Eyebrow>
            <h2 className="font-display mt-6 text-display-md leading-tight text-ink">{c.locationNote}.</h2>
            <dl className="mt-8 space-y-5 text-[0.95rem] leading-relaxed text-[#2b2f34]">
              <div><dt className="font-semibold text-ink">Address</dt><dd>{fullAddress(c)}</dd></div>
              <div><dt className="font-semibold text-ink">Parking</dt><dd><Inline text={c.parking} /></dd></div>
              <div><dt className="font-semibold text-ink">Accessibility</dt><dd><Inline text={c.accessibility} /></dd></div>
              <div><dt className="font-semibold text-ink">Public transport</dt><dd><Inline text={c.publicTransport} /></dd></div>
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <BookButton url={c.bookingUrl} />
              <TextLink href="/faq">Read the FAQs</TextLink>
            </div>
          </div>
          <div className="lg:col-span-7" data-reveal>
            <MapEmbed address={fullAddress(c)} className="h-[22rem] sm:h-[28rem] lg:h-full lg:min-h-[28rem]" />
          </div>
        </Container>
      </section>
    </>
  );
}
