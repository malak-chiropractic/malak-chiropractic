import { Container, PageHero } from "./ui";
import { Inline } from "./rich";

export function LegalPage({ eyebrow, title, updated, sections }: { eyebrow: string; title: string; updated: string; sections: { h: string; p: string[] }[] }) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} intro={<p>Last updated: <Inline text={updated} /></p>} />
      <section className="bg-white py-14 sm:py-20">
        <Container className="grid lg:grid-cols-12">
          <div className="prose-malak lg:col-span-8 lg:col-start-3">
            <p className="rounded-xl bg-butter/40 p-4 text-sm">
              <strong>Draft for review.</strong> This template must be reviewed against your actual practices, and ideally by a qualified adviser, before the site goes live.
            </p>
            {sections.map((s) => (
              <div key={s.h}>
                <h2>{s.h}</h2>
                {s.p.map((t) => <p key={t}><Inline text={t} /></p>)}
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
