import type { Metadata } from "next";
import Link from "next/link";
import { getConditions } from "@/lib/content";
import { Container, PageHero } from "@/components/ui";
import { BookingBand } from "@/components/booking-band";

export const metadata: Metadata = {
  title: "Conditions and Concerns",
  description: "Evidence-informed information on neck pain, lower back pain, headaches, sciatica-like symptoms and other musculoskeletal concerns — including when to see a doctor.",
  alternates: { canonical: "/conditions" },
};

const regionLabel: Record<string, string> = { cervical: "Neck", thoracic: "Mid-back", lumbar: "Lower back", pelvis: "Pelvis & hip", peripheral: "Limbs" };

export default function ConditionsPage() {
  const conditions = getConditions();
  return (
    <>
      <PageHero
        eyebrow="Conditions and concerns"
        title="Understanding what you're feeling."
        intro={<p>Clear, measured information on common musculoskeletal concerns. Symptoms aren&apos;t a diagnosis — each page explains what&apos;s commonly involved, what tends to help, and when to see a doctor first.</p>}
      />
      <section className="bg-white py-16 sm:py-24">
        <Container>
          <ul className="grid gap-x-10 sm:grid-cols-2">
            {conditions.map((c, i) => (
              <li key={c.slug} className="border-t border-line" data-reveal style={{ transitionDelay: `${(i % 2) * 70}ms` }}>
                <Link href={`/conditions/${c.slug}`} className="group flex items-start justify-between gap-6 py-7">
                  {(c.photo || c.illustration) && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.photo || c.illustration} alt="" aria-hidden className="hidden h-24 w-32 shrink-0 rounded-2xl object-cover ring-1 ring-line sm:block" loading="lazy" />
                  )}
                  <span className="flex-1">
                    <span className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-steel-deep">{regionLabel[c.region]}</span>
                    <h2 className="font-display mt-2 text-[1.6rem] leading-tight text-ink transition-colors group-hover:text-burgundy">{c.title}</h2>
                    <p className="mt-2 leading-relaxed text-steel-deep">{c.summary}</p>
                  </span>
                  <span aria-hidden className="mt-8 text-xl text-ink transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-12 max-w-3xl rounded-[20px] bg-paper p-6 text-sm leading-relaxed text-[#2b2f34]" data-reveal>
            <strong className="text-ink">In an emergency, call 000.</strong> Seek urgent care for loss of bladder or bowel control, numbness around the groin, rapidly worsening weakness, chest pain, or a sudden severe headache.
          </p>
        </Container>
      </section>
      <BookingBand />
    </>
  );
}
