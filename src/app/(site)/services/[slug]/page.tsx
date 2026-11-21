import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticles, getClinic, getConditions, getService, getServices } from "@/lib/content";
import { BookButton, Container, Eyebrow, Icon, TextLink } from "@/components/ui";
import { Inline, Rich } from "@/components/rich";
import { ArticleCard } from "@/components/article-card";
import { BookingBand } from "@/components/booking-band";
import { JsonLd } from "@/components/json-ld";
import { SITE_URL } from "@/lib/content";

export function generateStaticParams() {
  return getServices().map((s) => ({ slug: s.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return { title: s.seoTitle, description: s.seoDescription, alternates: { canonical: `/services/${s.slug}` }, openGraph: { title: s.seoTitle, description: s.seoDescription } };
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();
  const clinic = getClinic();
  const articles = getArticles().filter((a) => s.relatedArticles.includes(a.slug));
  const conditions = getConditions().filter((c) => s.relatedConditions.includes(c.slug));
  const others = getServices().filter((o) => o.slug !== s.slug);

  const sections = [
    { id: "involves", title: "What it involves", text: s.involves },
    { id: "considered", title: "Why it may be considered", text: s.considered },
    { id: "expect", title: "What to expect", text: s.expect },
    { id: "suitability", title: "How suitability is determined", text: s.suitability },
    { id: "precautions", title: "Precautions and limitations", text: s.precautions },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "MedicalWebPage",
          name: s.title,
          description: s.seoDescription,
          url: `${SITE_URL}/services/${s.slug}`,
          about: { "@type": "MedicalTherapy", name: s.title },
          publisher: { "@id": `${SITE_URL}/#clinic` },
        }}
      />
      <section className="border-b border-line bg-paper pt-12 pb-14 sm:pt-16 sm:pb-20">
        <Container>
          <nav aria-label="Breadcrumb" className="rise text-sm text-steel-deep">
            <Link href="/services" className="hover:text-burgundy">Our services</Link> <span aria-hidden>/</span> <span aria-current="page">{s.title}</span>
          </nav>
          <div className="mt-8 grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <span className="rise inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-burgundy ring-1 ring-line">
                <Icon name={s.icon} className="h-7 w-7" />
              </span>
              <h1 className="rise font-display mt-6 text-display-lg leading-[1.04] text-ink [animation-delay:80ms]">{s.title}</h1>
              <p className="rise mt-6 max-w-2xl text-xl leading-relaxed text-steel-deep [animation-delay:160ms]">{s.summary}</p>
            </div>
            <div className="rise self-end lg:col-span-4 lg:justify-self-end [animation-delay:240ms]">
              <BookButton url={clinic.bookingUrl} label="Book a consultation" />
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-12">
          <aside className="hidden lg:col-span-3 lg:block">
            <nav aria-label="On this page" className="sticky top-28">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-steel-deep">On this page</p>
              <ul className="mt-4 space-y-2 border-l border-line">
                {[...sections, { id: "faq", title: "Common questions" }].map((x) => (
                  <li key={x.id}>
                    <a href={`#${x.id}`} className="-ml-px block border-l border-transparent pl-4 text-sm text-steel-deep transition-colors hover:border-burgundy hover:text-ink">
                      {x.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
          <div className="lg:col-span-8 lg:col-start-5">
            {sections.map((sec, i) => (
              <section key={sec.id} id={sec.id} className={`${i ? "mt-14 border-t border-line pt-14" : ""} ${sec.id === "precautions" ? "rounded-[22px] !border-t-0 bg-paper p-7 sm:p-9" : ""}`} data-reveal>
                <h2 className="font-display text-display-sm text-ink">{sec.title}</h2>
                <Rich text={sec.text} className="mt-5" />
              </section>
            ))}

            {s.faqs.length > 0 && (
              <section id="faq" className="mt-14 border-t border-line pt-14" data-reveal>
                <h2 className="font-display text-display-sm text-ink">Common questions</h2>
                <div className="mt-6 divide-y divide-line border-y border-line">
                  {s.faqs.map((f) => (
                    <details key={f.q} className="acc group">
                      <summary className="flex items-center justify-between gap-6 py-5 text-left font-semibold text-ink">
                        {f.q}
                        <span aria-hidden className="acc-icon text-2xl font-light leading-none text-burgundy">+</span>
                      </summary>
                      <div className="pb-6 pr-10 leading-relaxed text-[#2b2f34]">
                        <Inline text={f.a} />
                      </div>
                    </details>
                  ))}
                </div>
                <TextLink href="/faq" className="mt-6">
                  See all frequently asked questions
                </TextLink>
              </section>
            )}

            {conditions.length > 0 && (
              <section className="mt-14" data-reveal>
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-steel-deep">Related concerns</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {conditions.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/conditions/${c.slug}`} className="inline-flex min-h-10 items-center rounded-full bg-paper px-4 text-sm font-semibold text-ink ring-1 ring-line hover:ring-burgundy">
                        {c.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </Container>
      </section>

      {articles.length > 0 && (
        <section className="border-t border-line bg-paper py-16 sm:py-20">
          <Container>
            <Eyebrow>Related reading</Eyebrow>
            <div className="mt-10 grid gap-10 md:grid-cols-3">
              {articles.map((a, i) => (
                <ArticleCard key={a.slug} article={a} i={i} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="bg-white py-14">
        <Container>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-steel-deep">Other services</p>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/services/${o.slug}`} className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-burgundy">
                  {o.title}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <BookingBand />
    </>
  );
}
