import type { Metadata } from "next";
import { getFaqLibrary } from "@/lib/content";
import { Container, PageHero } from "@/components/ui";
import { FaqLibrary } from "@/components/faq-library";
import { BookingBand } from "@/components/booking-band";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers about chiropractic care, your first appointment, safety, pregnancy and children, fees, Medicare, referrals and booking at Malak Chiropractic.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const lib = getFaqLibrary();
  const answerable = lib.items.filter((i) => !i.answer.includes("[TO CONFIRM"));
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: answerable.map((i) => ({ "@type": "Question", name: i.question, acceptedAnswer: { "@type": "Answer", text: i.answer } })) }} />
      <PageHero eyebrow="FAQ" title="Questions, answered plainly." intro={<p>Can&apos;t find what you&apos;re looking for? Get in touch — we&apos;re happy to help.</p>} />
      <section className="bg-paper py-14 sm:py-20">
        <Container>
          <FaqLibrary categories={lib.categories} items={lib.items} />
        </Container>
      </section>
      <BookingBand />
    </>
  );
}
