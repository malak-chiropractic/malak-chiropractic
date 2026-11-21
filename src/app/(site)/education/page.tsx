import type { Metadata } from "next";
import { ARTICLE_CATEGORIES, AUDIENCES, getArticles } from "@/lib/content";
import { Container, PageHero, TextLink } from "@/components/ui";
import { ArticleCard } from "@/components/article-card";
import { ArticleLibrary } from "@/components/article-library";
import { BookingBand } from "@/components/booking-band";

export const metadata: Metadata = {
  title: "Patient Education",
  description: "Clear, evidence-informed articles on pain, spinal health, exercise and chiropractic care from Malak Chiropractic in Panania.",
  alternates: { canonical: "/education" },
};

export default function EducationPage() {
  const articles = getArticles();
  const cards = Object.fromEntries(articles.map((a, i) => [a.slug, <ArticleCard key={a.slug} article={a} i={i} headingLevel={2} />]));
  return (
    <>
      <PageHero
        eyebrow="Patient education"
        title="Reading that helps you understand your body."
        intro={<p>Practical, evidence-informed articles — reviewed by a chiropractor before they&apos;re published. New pieces each month.</p>}
      >
        <TextLink href="/education/spine">Explore the interactive spine</TextLink>
      </PageHero>
      <section className="bg-paper py-14 sm:py-20">
        <Container>
          <ArticleLibrary
            items={articles.map((a) => ({ slug: a.slug, title: a.title, summary: a.summary, category: a.category, audiences: a.audiences, text: `${a.title} ${a.summary} ${a.body}`.toLowerCase() }))}
            categories={ARTICLE_CATEGORIES.map((c) => ({ ...c, count: articles.filter((a) => a.category === c.key).length }))}
            audiences={AUDIENCES.map((x) => ({ ...x, count: articles.filter((a) => a.audiences.includes(x.key)).length }))}
            cards={cards}
          />
        </Container>
      </section>
      <BookingBand />
    </>
  );
}
