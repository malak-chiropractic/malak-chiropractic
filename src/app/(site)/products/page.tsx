import type { Metadata } from "next";
import { getProducts } from "@/lib/content";
import { ButtonLink, Container, PageHero, PhotoPlaceholder, Photo } from "@/components/ui";
import { Inline } from "@/components/rich";

export const metadata: Metadata = {
  title: "Products",
  description: "Waterdrop and Fibre Boost, available in clinic at Malak Chiropractic, Panania.",
  alternates: { canonical: "/products" },
};

const accents = { sky: "bg-sky", butter: "bg-butter/80", burgundy: "bg-burgundy/15", steel: "bg-[#e7eaec]" } as const;

export default function ProductsPage() {
  const products = getProducts();
  return (
    <>
      <PageHero eyebrow="In clinic" title="A few good things, on the shelf." intro={<p>Products we stock for convenience. They&apos;re entirely optional, and aren&apos;t part of — or a substitute for — your care.</p>} />
      <section className="bg-white py-16 sm:py-24">
        <Container className="space-y-6">
          {products.map((p, i) => (
            <article key={p.slug} className={`grid items-center gap-8 overflow-hidden rounded-[28px] p-6 sm:p-10 lg:grid-cols-12 ${accents[p.accent]}`} data-reveal>
              <div className={`lg:col-span-5 ${i % 2 ? "lg:order-2 lg:col-start-8" : ""}`}>
                {p.image ? <Photo src={p.image} alt={p.imageAlt} ratio="aspect-square" /> : <PhotoPlaceholder label={p.imageAlt} ratio="aspect-square" tone="paper" />}
              </div>
              <div className={`lg:col-span-6 ${i % 2 ? "lg:order-1 lg:col-start-1" : "lg:col-start-7"}`}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel-deep">{p.kicker}</p>
                <h2 className="font-display mt-3 text-display-lg leading-none text-ink">{p.name}</h2>
                <p className="mt-5 text-lg leading-relaxed text-[#2b2f34]">{p.description}</p>
                <ul className="mt-5 space-y-1.5 text-[0.95rem] text-[#2b2f34]">{p.details.map((d) => <li key={d}><Inline text={d} /></li>)}</ul>
                <dl className="mt-7 grid gap-4 border-t border-ink/10 pt-6 text-sm sm:grid-cols-3">
                  <div><dt className="text-steel-deep">Price</dt><dd className="mt-1 font-semibold text-ink"><Inline text={p.price} /></dd></div>
                  <div><dt className="text-steel-deep">Availability</dt><dd className="mt-1 text-ink"><Inline text={p.availability} /></dd></div>
                  <div><dt className="text-steel-deep">How to buy</dt><dd className="mt-1 text-ink">{p.howToBuy}</dd></div>
                </dl>
              </div>
            </article>
          ))}
          <div className="flex flex-col gap-4 rounded-[22px] bg-paper p-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[#2b2f34]">Want to check stock before your visit?</p>
            <ButtonLink href="/contact" variant="ghost">Contact us</ButtonLink>
          </div>
          <p className="text-xs text-steel-deep">Product information is supplied by the manufacturers. Products are not intended to diagnose, treat or prevent any condition. Check the label for allergens and ingredients, or ask us before purchasing.</p>
        </Container>
      </section>
    </>
  );
}
