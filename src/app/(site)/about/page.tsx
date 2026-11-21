import type { Metadata } from "next";
import { getClinic, getPractitioners } from "@/lib/content";
import { Container, Eyebrow, PageHero, Photo, TextLink } from "@/components/ui";
import { Inline, Rich } from "@/components/rich";
import { BookingBand } from "@/components/booking-band";

export const metadata: Metadata = {
  title: "About",
  description: "Malak Chiropractic's philosophy and clinical approach, and Dr Jasmine Malak's background. Conservative, individualised musculoskeletal care in Panania.",
  alternates: { canonical: "/about" },
};

const approach = [
  { t: "Assessment", d: "A detailed history and examination — including neurological screening where indicated — so recommendations are grounded in your presentation." },
  { t: "Clinical reasoning", d: "We weigh what we find against current evidence and your preferences, and we're open about uncertainty." },
  { t: "Informed consent", d: "Before any treatment we explain what's involved, the expected benefits, the risks relevant to you and the alternatives. Consent is ongoing." },
  { t: "Appropriate treatment selection", d: "Techniques are chosen to suit you — from manipulation and lower-force options to soft tissue therapy, dry needling or none at all." },
  { t: "Rehabilitation", d: "Exercise and graded activity help build capacity and confidence, so improvement lasts beyond the treatment room." },
  { t: "Education", d: "Understanding what's happening reduces worry and helps you make good decisions about your care." },
  { t: "Referral where indicated", d: "If another practitioner or investigation is the better path, we'll say so and help you get there." },
];

export default function AboutPage() {
  const clinic = getClinic();
  const people = getPractitioners();
  const jasmine = people.find((p) => p.type === "principal");
  const locums = people.filter((p) => p.type === "locum");

  return (
    <>
      <PageHero eyebrow="About Malak Chiropractic" title={<>Thoughtful care, close to home.</>} intro={<p>A small, considered practice within Panania Family Doctors, focused on helping people move, work and live more comfortably.</p>} />

      <section className="bg-white py-20 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4" data-reveal>
            <Eyebrow index="01">Our philosophy</Eyebrow>
          </div>
          <div className="lg:col-span-7 lg:col-start-6" data-reveal>
            <p className="font-display text-display-sm leading-snug text-ink">
              We take a holistic, conservative and non-invasive approach to musculoskeletal health — one that looks at the whole person, not just the painful part.
            </p>
            <div className="prose-malak mt-8">
              <p>
                That means considering how your work, sleep, stress, activity and goals interact with your symptoms. It means choosing care that fits your presentation, preferences and circumstances. And it means helping you build comfort, mobility and confidence in managing your own body.
              </p>
              <p>
                Balance and wellbeing matter to us, but we&apos;re careful about what chiropractic care can and can&apos;t do. We don&apos;t claim that spinal care cures disease or guarantees outcomes. We do promise to listen carefully, explain clearly and recommend honestly.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {jasmine && (
        <section id="jasmine" className="border-y border-line bg-paper py-20 sm:py-24">
          <Container className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28" data-reveal>
                <Photo src="/photos/treatment-765.webp" alt="Dr Jasmine Malak assessing a patient in the treatment room" position="45% 40%" />
              </div>
            </div>
            <div className="lg:col-span-6 lg:col-start-7" data-reveal>
              <Eyebrow index="02">Meet Dr Jasmine Malak</Eyebrow>
              <h2 className="font-display mt-6 text-display-lg leading-[1.05] text-ink">{jasmine.name}</h2>
              <p className="mt-2 font-medium text-steel-deep">{jasmine.role}</p>
              <Rich text={jasmine.bio} className="mt-8" />
              <dl className="mt-10 grid gap-8 border-t border-line pt-8 sm:grid-cols-2">
                {[
                  ["Qualifications", jasmine.qualifications],
                  ["Certifications", jasmine.certifications],
                  ["Techniques", jasmine.techniques],
                  ["Clinical interests", jasmine.interests],
                ].map(([label, items]) => (
                  <div key={label as string}>
                    <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-steel-deep">{label as string}</dt>
                    <dd>
                      <ul className="mt-3 space-y-1.5 text-[0.95rem] text-ink">
                        {(items as string[]).map((q) => (
                          <li key={q}>
                            <Inline text={q} />
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-steel-deep">Registration</dt>
                  <dd className="mt-3 text-[0.95rem] text-ink">
                    <Inline text={jasmine.registration} />{" "}
                    <a className="text-burgundy underline underline-offset-4" href="https://www.ahpra.gov.au/Registration/Registers-of-Practitioners.aspx" target="_blank" rel="noopener noreferrer">
                      Check the Ahpra register<span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </Container>
        </section>
      )}

      <section className="bg-white py-20 sm:py-24">
        <Container>
          <div className="grid gap-6 lg:grid-cols-12" data-reveal>
            <div className="lg:col-span-5">
              <Eyebrow index="03">Our clinical approach</Eyebrow>
              <h2 className="font-display mt-6 text-display-lg leading-[1.05] text-ink">How decisions are made.</h2>
            </div>
            <p className="self-end text-lg leading-relaxed text-steel-deep lg:col-span-6 lg:col-start-7">
              Good care isn&apos;t a fixed routine. It&apos;s a series of decisions, made with you, that adapt as you progress.
            </p>
          </div>
          <ol className="mt-14 divide-y divide-line border-y border-line">
            {approach.map((a, i) => (
              <li key={a.t} className="grid gap-2 py-7 sm:grid-cols-12 sm:gap-6" data-reveal>
                <span className="font-display text-burgundy sm:col-span-1">0{i + 1}</span>
                <h3 className="text-lg font-semibold text-ink sm:col-span-4">{a.t}</h3>
                <p className="leading-relaxed text-steel-deep sm:col-span-7">{a.d}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="border-t border-line bg-paper py-20 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5" data-reveal>
            <Eyebrow index="04">Continuity of care</Eyebrow>
            <h2 className="font-display mt-6 text-display-md leading-tight text-ink">When Jasmine is away.</h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7" data-reveal>
            <div className="prose-malak">
              <p>
                From time to time, Dr Andrew Tyler, a chiropractor, provides locum cover when Dr Malak is unavailable, so you can continue your care without a long gap. Your records and management plan are shared securely so that care is consistent.
              </p>
              <p>
                If you&apos;d prefer to wait until Dr Malak returns, that&apos;s absolutely fine — just let us know when you book.
              </p>
            </div>
            {locums.filter((l) => l.published).map((l) => (
              <div key={l.slug} className="mt-8 rounded-2xl bg-white p-6 ring-1 ring-line">
                <h3 className="font-semibold text-ink">{l.name}</h3>
                <p className="text-sm text-steel-deep">{l.role}</p>
                <Rich text={l.bio} className="mt-3 !text-[0.95rem]" />
              </div>
            ))}
            <p className="mt-6 text-sm text-steel-deep">
              <Inline text="[TO CONFIRM: Dr Tyler's qualifications, biography and permission to publish his profile]" />
            </p>
            <TextLink href="/contact" className="mt-6">
              Ask about availability
            </TextLink>
          </div>
        </Container>
      </section>

      <BookingBand title="Let's talk about what's going on." text={`Appointments at ${clinic.streetAddress}, ${clinic.suburb}.`} />
    </>
  );
}
