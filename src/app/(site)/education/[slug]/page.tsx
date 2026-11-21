import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdoc from "@markdoc/markdoc";
import React from "react";
import { categoryLabel, formatDate, getArticle, getArticles, getClinic, renderMarkdoc, SITE_URL } from "@/lib/content";
import { BookButton, Container, Eyebrow } from "@/components/ui";
import { ArticleCard, ArticleCover } from "@/components/article-card";
import { JsonLd } from "@/components/json-ld";
import { BookingBand } from "@/components/booking-band";

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/education/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return {
    title: a.seoTitle,
    description: a.seoDescription,
    alternates: { canonical: `/education/${a.slug}` },
    openGraph: { type: "article", title: a.seoTitle, description: a.seoDescription, publishedTime: a.publishDate },
    robots: a.isPreviewOnly ? { index: false, follow: false } : undefined,
  };
}

export default async function ArticlePage({ params }: PageProps<"/education/[slug]">) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  const clinic = getClinic();
  const all = getArticles();
  const related = a.relatedArticles.map((s) => all.find((x) => x.slug === s)).filter((x): x is NonNullable<typeof x> => !!x).slice(0, 3);
  const content = Markdoc.renderers.react(renderMarkdoc(a.body), React);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "MedicalWebPage",
          headline: a.title,
          description: a.seoDescription,
          url: `${SITE_URL}/education/${a.slug}`,
          datePublished: a.publishDate,
          ...(a.reviewedDate ? { lastReviewed: a.reviewedDate } : {}),
          ...(a.reviewer ? { reviewedBy: { "@type": "Person", name: a.reviewer } } : {}),
          author: { "@type": "Person", name: a.author },
          publisher: { "@id": `${SITE_URL}/#clinic` },
        }}
      />
      {a.isPreviewOnly && (
        <div className="bg-butter px-5 py-3 text-center text-sm font-semibold text-ink" role="status">
          Draft preview — awaiting clinical review. This article is hidden on the live site until it&apos;s approved.
        </div>
      )}
      <article>
        <header className="bg-paper pt-12 sm:pt-16">
          <Container>
            <nav aria-label="Breadcrumb" className="rise text-sm text-steel-deep">
              <Link href="/education" className="hover:text-burgundy">Patient education</Link> <span aria-hidden>/</span> <span>{categoryLabel(a.category)}</span>
            </nav>
            <h1 className="rise font-display mt-8 max-w-4xl text-display-lg leading-[1.06] text-ink [animation-delay:80ms]">{a.title}</h1>
            <p className="rise mt-6 max-w-2xl text-xl leading-relaxed text-steel-deep [animation-delay:160ms]">{a.summary}</p>
            <dl className="rise mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6 text-sm [animation-delay:220ms]">
              <div><dt className="text-steel-deep">Author</dt><dd className="font-semibold text-ink">{a.author}</dd></div>
              <div><dt className="text-steel-deep">Published</dt><dd className="font-semibold text-ink"><time dateTime={a.publishDate}>{formatDate(a.publishDate)}</time></dd></div>
              <div>
                <dt className="text-steel-deep">Clinically reviewed</dt>
                <dd className="font-semibold text-ink">{a.reviewedDate ? <>{formatDate(a.reviewedDate)}{a.reviewer && ` · ${a.reviewer}`}</> : <span className="text-burgundy">Pending review</span>}</dd>
              </div>
              <div><dt className="text-steel-deep">Reading time</dt><dd className="font-semibold text-ink">{a.readingMinutes} min</dd></div>
            </dl>
            <div className="mt-10 aspect-[21/9] overflow-hidden rounded-[24px]">
              <ArticleCover article={a} />
            </div>
          </Container>
        </header>
        <div className="bg-paper py-14 sm:py-20">
          <Container className="grid gap-12 lg:grid-cols-12">
            <div className="prose-malak lg:col-span-7 lg:col-start-2">{content}</div>
            <aside className="lg:col-span-3 lg:col-start-10">
              <div className="space-y-4 lg:sticky lg:top-28">
                <div className="rounded-[22px] bg-ink p-6 text-white">
                  <p className="font-display text-xl leading-snug">Questions about your own situation?</p>
                  <p className="mt-2 text-sm text-white/70">A consultation is the best way to get advice specific to you.</p>
                  <BookButton url={clinic.bookingUrl} variant="light" className="mt-5" />
                </div>
                <p className="text-xs leading-relaxed text-steel-deep">General information only — not a substitute for individual advice. In an emergency call 000.</p>
              </div>
            </aside>
          </Container>
          {a.references.length > 0 && (
            <Container className="mt-14 grid lg:grid-cols-12">
              <section className="border-t border-line pt-8 lg:col-span-7 lg:col-start-2">
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-steel-deep">References</h2>
                <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-[#2b2f34]">
                  {a.references.map((r) => <li key={r}>{r}</li>)}
                </ol>
              </section>
            </Container>
          )}
        </div>
      </article>
      {related.length > 0 && (
        <section className="border-t border-line bg-white py-16 sm:py-20">
          <Container>
            <Eyebrow>Related reading</Eyebrow>
            <div className="mt-10 grid gap-10 md:grid-cols-3">{related.map((r, i) => <ArticleCard key={r.slug} article={r} i={i} />)}</div>
          </Container>
        </section>
      )}
      <BookingBand />
    </>
  );
}
