import type { Metadata } from "next";
import Link from "next/link";
import { getServices } from "@/lib/content";
import { Container, Icon, PageHero, TextLink } from "@/components/ui";
import { BookingBand } from "@/components/booking-band";

export const metadata: Metadata = {
  title: "Our Services",
  description: "Chiropractic consultations, dry needling, soft tissue therapy, exercise-based rehabilitation, Thompson Drop-Piece Technique and neurological assessment in Panania.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  const services = getServices();
  return (
    <>
      <PageHero
        eyebrow="Our services"
        title="Care that fits the problem — and the person."
        intro={<p>Every service is offered only where it suits your presentation and preferences. Your first consultation is where we work out what that means for you.</p>}
      />
      <section className="bg-white py-16 sm:py-24">
        <Container>
          <ul className="divide-y divide-line border-y border-line">
            {services.map((s, i) => (
              <li key={s.slug} data-reveal>
                <Link href={`/services/${s.slug}`} className="group grid items-center gap-4 py-8 sm:grid-cols-12 sm:gap-6 sm:py-10">
                  <span className="font-display text-burgundy sm:col-span-1">0{i + 1}</span>
                  <span className="flex items-center gap-4 sm:col-span-5">
                    <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-paper text-burgundy transition-colors group-hover:bg-burgundy group-hover:text-white">
                      <Icon name={s.icon} />
                    </span>
                    <h2 className="font-display text-[1.65rem] leading-tight text-ink sm:text-display-sm">{s.title}</h2>
                  </span>
                  <p className="leading-relaxed text-steel-deep sm:col-span-5">{s.summary}</p>
                  <span aria-hidden className="hidden justify-self-end text-2xl text-ink transition-transform duration-300 group-hover:translate-x-1 sm:col-span-1 sm:block">→</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-12 flex flex-col gap-4 rounded-[20px] bg-sky/60 p-7 sm:flex-row sm:items-center sm:justify-between" data-reveal>
            <p className="max-w-2xl text-[#2b2f34]">Looking for information about a particular concern, such as neck or lower back pain?</p>
            <TextLink href="/conditions">Conditions and concerns</TextLink>
          </div>
        </Container>
      </section>
      <BookingBand />
    </>
  );
}
