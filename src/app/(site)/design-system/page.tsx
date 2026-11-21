import type { Metadata } from "next";
import { getArticles, getServices } from "@/lib/content";
import { ButtonLink, Container, Eyebrow, Icon, PhotoPlaceholder, TextLink } from "@/components/ui";
import { ArticleCard } from "@/components/article-card";
import { Figure, Lockup, Monogram, Words } from "@/components/brand";

export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

const colours = [
  { name: "Steel grey", hex: "#66717A", token: "steel", role: "Primary brand identity, borders, quiet UI", text: "AA for large text and UI on white (4.99:1). Body text uses Steel deep." },
  { name: "Steel deep", hex: "#525C64", token: "steel-deep", role: "Secondary text on light backgrounds", text: "6.48:1 on soft white — AA for body text" },
  { name: "Near black", hex: "#17191C", token: "ink", role: "Headings, navigation, dark panels", text: "16.7:1 on soft white" },
  { name: "Soft white", hex: "#F8F9FA", token: "paper", role: "Main page background", text: "" },
  { name: "Pure white", hex: "#FFFFFF", token: "white", role: "Cards and negative space", text: "" },
  { name: "Burgundy", hex: "#762D43", token: "burgundy", role: "Action & emphasis — buttons, links, focus rings", text: "White on burgundy 9.4:1" },
  { name: "Baby blue", hex: "#DCECF5", token: "sky", role: "Education — anatomy, explanations, reading", text: "Ink on baby blue 14.6:1" },
  { name: "Butter yellow", hex: "#F5E7A8", token: "butter", role: "Small human moments — open-day marker, highlights", text: "Ink on butter 14.2:1 · never used for text" },
];

const typeScale = [
  { label: "Display XL", cls: "font-display text-display-xl leading-[0.98]", spec: "Gilda Display · 44–96px · hero only", sample: "Care that moves" },
  { label: "Display L", cls: "font-display text-display-lg leading-[1.05]", spec: "Gilda Display · 36–68px · section headings", sample: "Your care should make sense" },
  { label: "Display M", cls: "font-display text-display-md leading-tight", spec: "Gilda Display · 28–44px · panel headings", sample: "Lumbar spine" },
  { label: "Display S", cls: "font-display text-display-sm leading-snug", spec: "Gilda Display · 22–30px · statements, sub-sections", sample: "What to expect" },
  { label: "Lead", cls: "text-xl leading-relaxed text-[#2b2f34]", spec: "Manrope 400 · 20px · intros", sample: "Individualised chiropractic care with a conservative, considered approach." },
  { label: "Body", cls: "text-[1.0625rem] leading-[1.75] text-[#2b2f34]", spec: "Manrope 400 · 17px / 1.75 · long-form reading", sample: "We take the time to understand your concerns, explain what we find and discuss options that suit your goals." },
  { label: "Small", cls: "text-sm text-steel-deep", spec: "Manrope 500 · 14px · metadata, captions", sample: "Understanding Pain · 3 November 2026 · 5 min read" },
  { label: "Eyebrow", cls: "text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-steel-deep", spec: "Manrope 600 · 11.5px · +18% tracking", sample: "Explore the spine" },
];

const spacing = [
  ["4", "Icon gaps"],
  ["8", "Tight groupings"],
  ["16", "Related elements"],
  ["24", "Card padding (mobile)"],
  ["40", "Card padding (desktop)"],
  ["64", "Between blocks"],
  ["80–112", "Section padding (mobile → desktop)"],
];

function Section({ id, index, title, intro, children }: { id: string; index: string; title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="border-t border-line py-16 sm:py-20">
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Eyebrow index={index}>{title}</Eyebrow>
          {intro && <p className="mt-4 max-w-sm leading-relaxed text-steel-deep">{intro}</p>}
        </div>
        <div className="lg:col-span-8">{children}</div>
      </div>
    </section>
  );
}

export default function DesignSystemPage() {
  const service = getServices()[1];
  const article = getArticles()[0];
  return (
    <div className="bg-paper">
      <section className="pt-14 pb-12 sm:pt-20">
        <Container>
          <Eyebrow>Malak Chiropractic · Design system v1</Eyebrow>
          <h1 className="font-display mt-5 max-w-4xl text-display-lg leading-[1.04] text-ink">Modern clinical, with an editorial hand.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-steel-deep">
            Steel grey, near black and white carry the brand. Three accents each have one job, so colour always means something. Generous space, a warm serif for considered statements and a crisp sans for everything functional.
          </p>
          <ul className="mt-8 flex flex-wrap gap-2 text-sm">
            {["Logo", "Colour", "Typography", "Buttons", "Forms", "Cards", "Layouts", "Icons", "Spacing", "Motion"].map((x) => (
              <li key={x}>
                <a href={`#${x.toLowerCase()}`} className="inline-flex min-h-10 items-center rounded-full bg-white px-4 font-medium text-ink ring-1 ring-line hover:ring-burgundy">
                  {x}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Container>
        <Section id="logo" index="00" title="Logo" intro="Traced from the original artwork so it stays sharp at any size and can take on the palette. The interlocked MC is the primary mark; the words, figure and full lockup are used where they fit best.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex aspect-square items-center justify-center rounded-[22px] bg-white p-10 ring-1 ring-line">
              <Monogram className="h-full w-auto" />
            </div>
            <div className="flex aspect-square items-center justify-center rounded-[22px] bg-ink p-10">
              <Monogram tone="dark" className="h-full w-auto" />
            </div>
            <div className="flex items-center justify-center rounded-[22px] bg-white p-8 ring-1 ring-line sm:col-span-2">
              <Lockup className="h-auto w-full max-w-md" />
            </div>
            <div className="flex items-center justify-center rounded-[22px] bg-[#b4b4b4] p-8">
              <Words tone="dark" className="h-auto w-full max-w-[14rem]" />
            </div>
            <div className="flex items-center justify-center rounded-[22px] bg-sky p-8">
              <Figure className="h-40 w-auto" />
            </div>
          </div>
          <ul className="mt-6 space-y-1.5 text-sm leading-relaxed text-[#2b2f34]">
            <li><strong>Monogram (MC):</strong> header, favicon, hero, social avatar — the primary mark.</li>
            <li><strong>Full lockup:</strong> footer, printed referral sheets, email signatures.</li>
            <li><strong>Words only:</strong> beside the monogram in the header, and where space is wide but short.</li>
            <li><strong>Figure only:</strong> a quiet editorial accent — never more than once per page.</li>
            <li><strong>Colours:</strong> on light grounds, M in steel and C in near black; on dark grounds, M in white and C in butter.</li>
          </ul>
        </Section>

        <Section id="colour" index="01" title="Colour" intro="Neutrals dominate (about 90% of any screen). Accents are used one at a time, never all together in a section.">
          <ul className="grid gap-4 sm:grid-cols-2">
            {colours.map((c) => (
              <li key={c.hex} className="overflow-hidden rounded-[20px] bg-white ring-1 ring-line">
                <div className="h-24" style={{ background: c.hex, boxShadow: c.hex === "#FFFFFF" || c.hex === "#F8F9FA" ? "inset 0 -1px 0 #e2e5e8" : undefined }} />
                <div className="p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-semibold text-ink">{c.name}</h3>
                    <code className="text-xs text-steel-deep">{c.hex}</code>
                  </div>
                  <p className="mt-1 text-sm text-[#2b2f34]">{c.role}</p>
                  {c.text && <p className="mt-2 text-xs text-steel-deep">{c.text}</p>}
                  <p className="mt-2 text-[0.7rem] text-steel-deep">
                    Token: <code>--color-{c.token}</code>
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-steel-deep">These are proposed colours, ready to adjust once the official logo files are reviewed.</p>
        </Section>

        <Section id="typography" index="02" title="Typography" intro="Gilda Display (headlines) echoes the logo's fine, high-contrast lettering. Manrope (body and interface) keeps things clear and contemporary. Both are open-source and self-hosted for speed and privacy.">
          <ul className="divide-y divide-line border-y border-line">
            {typeScale.map((t) => (
              <li key={t.label} className="grid gap-3 py-6 sm:grid-cols-12">
                <div className="sm:col-span-3">
                  <p className="text-sm font-semibold text-ink">{t.label}</p>
                  <p className="mt-1 text-xs text-steel-deep">{t.spec}</p>
                </div>
                <p className={`${t.cls} sm:col-span-9`}>{t.sample}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="buttons" index="03" title="Buttons" intro="Pill-shaped, minimum 44px tall for touch. Burgundy is reserved for the primary action on a screen — usually booking.">
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              <ButtonLink href="#buttons">Book online</ButtonLink>
              <ButtonLink href="#buttons" variant="secondary">Secondary</ButtonLink>
              <ButtonLink href="#buttons" variant="ghost">Explore our approach</ButtonLink>
              <TextLink href="#buttons">Text link</TextLink>
            </div>
            <div className="flex flex-wrap items-center gap-3 rounded-[20px] bg-ink p-6">
              <ButtonLink href="#buttons" variant="light">On dark</ButtonLink>
              <ButtonLink href="#buttons" variant="ghost" className="!border-white/30 !text-white hover:!bg-white/10">Ghost on dark</ButtonLink>
            </div>
            <p className="text-sm text-steel-deep">Hover lifts the arrow 2px; press scales to 98%. Every interactive element has a 2px burgundy focus ring for keyboard users — try pressing Tab.</p>
          </div>
        </Section>

        <Section id="forms" index="04" title="Form controls" intro="Large, clearly labelled fields. Errors are described in words, not colour alone. Health information warnings sit above the form, not buried below.">
          <form className="grid gap-5 rounded-[22px] bg-white p-6 ring-1 ring-line sm:grid-cols-2 sm:p-8" aria-label="Form control examples" action="#">
            <div className="flex flex-col gap-2">
              <label htmlFor="ds-name" className="text-sm font-semibold text-ink">Full name</label>
              <input id="ds-name" className="min-h-12 rounded-xl border border-line-strong bg-paper px-4 text-ink outline-none transition focus:border-burgundy focus:bg-white focus:ring-4 focus:ring-burgundy/10" placeholder="Jane Citizen" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="ds-email" className="text-sm font-semibold text-ink">Email</label>
              <input id="ds-email" aria-invalid="true" aria-describedby="ds-email-err" defaultValue="jane@" className="min-h-12 rounded-xl border border-burgundy bg-white px-4 text-ink outline-none ring-4 ring-burgundy/10" />
              <p id="ds-email-err" className="flex items-center gap-1.5 text-sm font-medium text-burgundy">
                <span aria-hidden>!</span> Please enter a complete email address.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="ds-topic" className="text-sm font-semibold text-ink">Topic</label>
              <select id="ds-topic" className="min-h-12 rounded-xl border border-line-strong bg-paper px-4 text-ink outline-none focus:border-burgundy focus:ring-4 focus:ring-burgundy/10">
                <option>General enquiry</option>
                <option>Appointments</option>
                <option>Products</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="ds-phone" className="text-sm font-semibold text-ink">
                Phone <span className="font-normal text-steel-deep">(optional)</span>
              </label>
              <input id="ds-phone" type="tel" className="min-h-12 rounded-xl border border-line-strong bg-paper px-4 text-ink outline-none focus:border-burgundy focus:bg-white focus:ring-4 focus:ring-burgundy/10" />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label htmlFor="ds-msg" className="text-sm font-semibold text-ink">Message</label>
              <textarea id="ds-msg" rows={4} className="rounded-xl border border-line-strong bg-paper px-4 py-3 text-ink outline-none focus:border-burgundy focus:bg-white focus:ring-4 focus:ring-burgundy/10" />
              <p className="text-sm text-steel-deep">Please don&apos;t include detailed health information. This form isn&apos;t monitored for emergencies.</p>
            </div>
            <label className="flex items-start gap-3 text-sm text-[#2b2f34] sm:col-span-2">
              <input type="checkbox" className="mt-0.5 h-5 w-5 rounded accent-burgundy" />I understand this form is for general enquiries only.
            </label>
            <div className="sm:col-span-2">
              <button type="button" className="inline-flex min-h-11 items-center rounded-full bg-burgundy px-6 font-semibold text-white hover:bg-burgundy-deep">Send enquiry</button>
            </div>
          </form>
        </Section>

        <Section id="cards" index="05" title="Cards" intro="Used sparingly and in varied forms, so pages never become a wall of identical boxes.">
          <div className="grid gap-6 md:grid-cols-2">
            {service && (
              <div className="flex flex-col justify-between rounded-[22px] bg-white p-7 ring-1 ring-line">
                <div>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-paper text-burgundy">
                    <Icon name={service.icon} />
                  </span>
                  <h3 className="font-display mt-6 text-[1.5rem] leading-tight text-ink">{service.title}</h3>
                  <p className="mt-3 leading-relaxed text-steel-deep">{service.summary}</p>
                </div>
                <span className="mt-8 text-sm font-semibold text-ink">Service card →</span>
              </div>
            )}
            <div className="flex flex-col justify-between rounded-[22px] bg-ink p-7 text-white">
              <div>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-butter">
                  <Icon name="consult" />
                </span>
                <h3 className="font-display mt-6 text-display-sm leading-tight">Featured card</h3>
                <p className="mt-3 leading-relaxed text-white/75">One dark card anchors a group and leads the eye.</p>
              </div>
            </div>
            {article && <ArticleCard article={article} />}
            <div className="space-y-4">
              <div className="rounded-[22px] bg-sky/60 p-7 ring-1 ring-sky-deep/50">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-steel-deep">Education panel</p>
                <p className="mt-2 text-[#2b2f34]">Baby blue signals &ldquo;this is here to help you understand&rdquo;.</p>
              </div>
              <div className="rounded-[22px] bg-white p-7 ring-1 ring-line">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-burgundy">When to seek assessment</p>
                <p className="mt-2 text-[#2b2f34]">Safety callouts use a burgundy label on white.</p>
              </div>
              <PhotoPlaceholder label="Labelled placeholder until real photography arrives" ratio="aspect-[16/9]" />
            </div>
          </div>
        </Section>

        <Section id="layouts" index="06" title="Section layouts" intro="A 12-column editorial grid. Headings sit left with an index number; supporting text sits right, offset by a column. Hairline rules separate rather than boxes.">
          <div className="space-y-6">
            <div className="grid grid-cols-12 gap-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-16 rounded-md bg-sky/70" />
              ))}
            </div>
            <div className="grid gap-6 rounded-[22px] bg-white p-7 ring-1 ring-line lg:grid-cols-12">
              <div className="lg:col-span-5">
                <Eyebrow index="01">Heading left</Eyebrow>
                <p className="font-display mt-4 text-display-sm text-ink">Statement heading</p>
              </div>
              <p className="leading-relaxed text-steel-deep lg:col-span-6 lg:col-start-7">Supporting copy right, starting at column 7 — the asymmetric offset that gives the site its editorial rhythm.</p>
            </div>
            <ul className="text-sm leading-relaxed text-[#2b2f34]">
              <li><strong>Alternating grounds:</strong> sections alternate soft white and pure white, with one dark band per page at most.</li>
              <li className="mt-1"><strong>Numbered lists over card grids</strong> where content is a sequence or set of principles.</li>
              <li className="mt-1"><strong>Max content width</strong> 1240px; reading measure capped around 68 characters.</li>
            </ul>
          </div>
        </Section>

        <Section id="icons" index="07" title="Icons" intro="A small custom set drawn on a 24px grid with a 1.4px stroke — fine enough to feel refined, heavy enough to read at small sizes.">
          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {["consult", "needle", "hands", "movement", "table", "neuro", "pin", "clock", "phone", "mail", "book", "doc", "shield"].map((n) => (
              <li key={n} className="flex flex-col items-center gap-3 rounded-2xl bg-white py-6 ring-1 ring-line">
                <Icon name={n} className="h-7 w-7 text-ink" />
                <span className="text-xs text-steel-deep">{n}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="spacing" index="08" title="Spacing" intro="An 8-point system, with section spacing that grows from mobile to desktop.">
          <ul className="space-y-3">
            {spacing.map(([v, use]) => (
              <li key={v} className="grid grid-cols-12 items-center gap-4">
                <span className="col-span-2 text-sm font-semibold text-ink">{v}px</span>
                <span className="col-span-6 block h-3 rounded-full bg-burgundy/80" style={{ width: `${Math.min(100, parseInt(v) * 0.85)}%` }} />
                <span className="col-span-4 text-sm text-steel-deep">{use}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="motion" index="09" title="Motion" intro="Calm and purposeful. Nothing moves unless it helps orientation or feedback.">
          <ul className="grid gap-4 sm:grid-cols-2">
            {[
              ["Entrance", "Content rises 10–14px and fades in over 0.8–0.9s as it enters view, staggered by 70–90ms."],
              ["Easing", "One curve everywhere — cubic-bezier(0.22, 1, 0.36, 1) — fast start, gentle settle."],
              ["Signature", "The hero monogram assembles once on load — M, then C, then the figure; the anatomy explorer transitions colour over 0.5s."],
              ["Feedback", "Buttons respond in 0.3s; cards lift 4px on hover."],
              ["Reduced motion", "If your device asks for reduced motion, all animation is switched off and content simply appears."],
              ["Never", "No parallax, scroll-jacking, cursor effects or loading animations."],
            ].map(([t, d]) => (
              <li key={t} className="rounded-2xl bg-white p-6 ring-1 ring-line">
                <h3 className="font-semibold text-ink">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-steel-deep">{d}</p>
              </li>
            ))}
          </ul>
        </Section>
      </Container>
    </div>
  );
}
