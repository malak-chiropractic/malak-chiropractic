import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticles, getClinic, getCondition, getConditions, getServices, SITE_URL } from "@/lib/content";
import { BookButton, Container, Eyebrow } from "@/components/ui";
import { Rich } from "@/components/rich";
import { ArticleCard } from "@/components/article-card";
import { BookingBand } from "@/components/booking-band";
import { JsonLd } from "@/components/json-ld";

export function generateStaticParams() {
  return getConditions().map((c) => ({ slug: c.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/conditions/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = getCondition(slug);
  if (!c) return {};
  return { title: c.seoTitle, description: c.seoDescription, alternates: { canonical: `/conditions/${c.slug}` } };
}

export default async function ConditionPage({ params }: PageProps<"/conditions/[slug]">) {
  const { slug } = await params;
  const c = getCondition(slug);
  if (!c) notFound();
  const clinic = getClinic();
  const articles = getArticles().filter((a) => c.relatedArticles.includes(a.slug));
  const services = getServices().filter((s) => c.relatedServices.includes(s.slug));

  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "MedicalWebPage", name: c.title, description: c.seoDescription, url: `${SITE_URL}/conditions/${c.slug}`, publisher: { "@id": `${SITE_URL}/#clinic` } }} />
      <section className="border-b border-line bg-paper pt-12 pb-14 sm:pt-16 sm:pb-20">
        <Container>
          <nav aria-label="Breadcrumb" className="rise text-sm text-steel-deep">
            <Link href="/conditions" className="hover:text-burgundy">Conditions and concerns</Link> <span aria-hidden>/</span> <span aria-current="page">{c.title}</span>
          </nav>
          <div className="mt-8 grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h1 className="rise font-display max-w-4xl text-display-lg leading-[1.04] text-ink [animation-delay:80ms]">{c.title}</h1>
              <p className="rise mt-6 max-w-2xl text-xl leading-relaxed text-steel-deep [animation-delay:160ms]">{c.summary}</p>
            </div>
            {c.illustration && (
              <div className="rise lg:col-span-5 [animation-delay:200ms]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.illustration} alt={`Illustration of the anatomy involved in ${c.title.toLowerCase()}`} className="aspect-[4/3] w-full rounded-[24px] object-cover ring-1 ring-line" />
              </div>
            )}
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <section data-reveal>
              <h2 className="font-display text-display-sm text-ink">Overview</h2>
              <Rich text={c.overview} className="mt-5" />
            </section>
            <div className="mt-14 grid gap-10 border-t border-line pt-14 sm:grid-cols-2" data-reveal>
              <section>
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-steel-deep">What people commonly describe</h2>
                <Rich text={c.symptoms} className="mt-4 !text-base" />
              </section>
              <section>
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-steel-deep">Common contributing factors</h2>
                <Rich text={c.contributors} className="mt-4 !text-base" />
              </section>
            </div>
            <p className="mt-6 text-sm text-steel-deep">These are general patterns, not a diagnosis. Only an individual assessment can tell what&apos;s going on for you.</p>
            <section className="mt-14 border-t border-line pt-14" data-reveal>
              <h2 className="font-display text-display-sm text-ink">How assessment and care may help</h2>
              <Rich text={c.care} className="mt-5" />
            </section>
          </div>
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="space-y-4 lg:sticky lg:top-28">
              <div className="rounded-[22px] bg-white p-7 ring-1 ring-burgundy/30">
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-burgundy">See a doctor promptly if you notice</h2>
                <Rich text={c.redFlags} className="mt-4 !text-[0.95rem]" />
                <p className="mt-4 text-sm font-semibold text-ink">In an emergency, call 000.</p>
              </div>
              <div className="rounded-[22px] bg-ink p-7 text-white">
                <p className="font-display text-2xl leading-snug">Want it assessed properly?</p>
                <p className="mt-2 text-sm text-white/70">A consultation starts with your history and a thorough examination.</p>
                <BookButton url={clinic.bookingUrl} variant="light" className="mt-5" />
              </div>
              {services.length > 0 && (
                <div className="rounded-[22px] bg-paper p-7">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-steel-deep">Related services</h2>
                  <ul className="mt-3 space-y-2">
                    {services.map((s) => (
                      <li key={s.slug}>
                        <Link href={`/services/${s.slug}`} className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-burgundy">{s.title}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </Container>
      </section>

      {articles.length > 0 && (
        <section className="border-t border-line bg-paper py-16 sm:py-20">
          <Container>
            <Eyebrow>Related reading</Eyebrow>
            <div className="mt-10 grid gap-10 md:grid-cols-3">
              {articles.map((a, i) => <ArticleCard key={a.slug} article={a} i={i} />)}
            </div>
          </Container>
        </section>
      )}
      <BookingBand />
    </>
  );
}
