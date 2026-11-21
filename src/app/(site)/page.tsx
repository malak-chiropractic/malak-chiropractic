import Link from "next/link";
import { getArticles, getClinic, getHome, getPractitioners, getServices, fullAddress } from "@/lib/content";
import { getExplorerData } from "@/lib/explorer";
import { BookButton, ButtonLink, Container, Eyebrow, Icon, Photo, TextLink } from "@/components/ui";
import { Inline } from "@/components/rich";
import { SpineExplorer } from "@/components/spine-explorer";
import { ArticleCard } from "@/components/article-card";
import { MapEmbed } from "@/components/map-embed";
import { Figure, Monogram } from "@/components/brand";

export default function HomePage() {
  const clinic = getClinic();
  const home = getHome();
  const services = getServices();
  const jasmine = getPractitioners().find((p) => p.type === "principal");
  const articles = getArticles().slice(0, 3);
  const explorer = getExplorerData();
  const openDays = clinic.hours.filter((h) => h.open);

  return (
    <>
      {/* 01 — Hero */}
      <section className="relative overflow-hidden bg-paper">
        <Container className="grid items-end gap-10 pt-10 pb-16 sm:pt-16 lg:grid-cols-12 lg:gap-8 lg:pt-20 lg:pb-24">
          <div className="lg:col-span-7">
            <Eyebrow className="rise">{home.heroEyebrow}</Eyebrow>
            <h1 className="rise font-display mt-6 text-display-xl leading-[0.98] text-ink [animation-delay:80ms]">
              {home.heroHeadline.split(" ").slice(0, -2).join(" ")}{" "}
              <span className="relative whitespace-nowrap">
                {home.heroHeadline.split(" ").slice(-2).join(" ")}
                <svg aria-hidden viewBox="0 0 300 20" className="absolute -bottom-2 left-0 h-3 w-full text-butter" preserveAspectRatio="none">
                  <path d="M2 14 C 80 4, 200 4, 298 12" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" className="draw-line" style={{ ["--len" as string]: 320 }} />
                </svg>
              </span>
            </h1>
            <p className="rise mt-8 max-w-xl text-lg leading-relaxed text-steel-deep sm:text-xl [animation-delay:160ms]">{home.heroText}</p>
            <div className="rise mt-9 flex flex-wrap items-center gap-3 [animation-delay:240ms]">
              <BookButton url={clinic.bookingUrl} label="Book an appointment" />
              <ButtonLink href="#approach" variant="ghost">
                Explore our approach
              </ButtonLink>
            </div>
            <dl className="rise mt-12 grid max-w-xl grid-cols-2 gap-6 border-t border-line pt-6 text-sm [animation-delay:320ms]">
              <div>
                <dt className="text-steel-deep">Location</dt>
                <dd className="mt-1 font-semibold text-ink">
                  {clinic.suburb}, Sydney
                  <span className="block font-normal text-steel-deep">{clinic.locationNote}</span>
                </dd>
              </div>
              <div>
                <dt className="text-steel-deep">Clinic hours</dt>
                <dd className="mt-1 font-semibold text-ink">
                  {openDays.map((d) => (
                    <span key={d.day} className="flex flex-wrap items-center gap-x-2">
                      <span aria-hidden className="h-2 w-2 rounded-full bg-butter ring-4 ring-butter/30" />
                      {d.day}
                      <span className="font-normal text-steel-deep">{d.note}</span>
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>

          <div className="relative lg:col-span-5">
            <div className="relative mx-auto aspect-[5/6] w-full max-w-[30rem] overflow-hidden rounded-[28px] bg-[linear-gradient(160deg,#ffffff_0%,#eef0f2_100%)] ring-1 ring-line sm:aspect-square">
              <svg aria-hidden className="absolute inset-0 h-full w-full text-line" preserveAspectRatio="none">
                <defs>
                  <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M40 0H0V40" fill="none" stroke="currentColor" strokeWidth="0.6" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#hero-grid)" />
              </svg>
              <Monogram animate className="absolute left-1/2 top-1/2 h-[44%] w-auto -translate-x-1/2 -translate-y-1/2" title="Malak Chiropractic monogram" />

              {/* What we're about — small notes placed around the mark */}
              <ul className="absolute inset-0 hidden text-ink sm:block" aria-label="What we're about">
                {[
                  { pos: "left-5 top-6", k: "Listen first", v: "Your story, in your own words", d: 500 },
                  { pos: "right-5 top-[18%]", k: "Hands-on", v: "Diversified · Thompson · Dry needling", d: 650 },
                  { pos: "right-5 bottom-[22%]", k: "Move better", v: "Pilates-based core activation", d: 800 },
                  { pos: "left-5 bottom-6", k: "Team care", v: "Alongside your GP at Panania Family Doctors", d: 950 },
                ].map((n) => (
                  <li
                    key={n.k}
                    className={`rise absolute ${n.pos} max-w-[11.5rem] rounded-2xl bg-white/90 px-3.5 py-2.5 shadow-[0_14px_34px_-18px_rgba(23,25,28,0.35)] ring-1 ring-line backdrop-blur`}
                    style={{ animationDelay: `${n.d}ms` }}
                  >
                    <span className="block text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-burgundy">{n.k}</span>
                    <span className="mt-0.5 block text-[0.82rem] leading-snug">{n.v}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mobile: the same notes as a tidy list */}
            <ul className="mt-4 grid grid-cols-2 gap-2 sm:hidden" aria-label="What we're about">
              {[
                ["Listen first", "Your story, in your words"],
                ["Hands-on", "Diversified · Thompson · Dry needling"],
                ["Move better", "Pilates-based core activation"],
                ["Team care", "Alongside your GP"],
              ].map(([k, v]) => (
                <li key={k} className="rounded-2xl bg-white px-3.5 py-3 ring-1 ring-line">
                  <span className="block text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-burgundy">{k}</span>
                  <span className="mt-0.5 block text-[0.82rem] leading-snug text-ink">{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* 02 — Introduction */}
      <section id="approach" className="border-t border-line bg-white py-20 sm:py-28">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5" data-reveal>
              <Eyebrow index="01">Our approach</Eyebrow>
              <h2 className="font-display mt-6 text-display-lg leading-[1.05] text-ink">{home.introHeading}</h2>
            </div>
            <div className="lg:col-span-6 lg:col-start-7" data-reveal>
              <p className="text-xl leading-relaxed text-[#2b2f34]">{home.introText}</p>
              <TextLink href="/about" className="mt-6">
                More about our philosophy
              </TextLink>
            </div>
          </div>
          <ol className="mt-16 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {home.principles.map((p, i) => (
              <li
                key={p.title}
                data-reveal
                style={{ transitionDelay: `${(i % 3) * 80}ms` }}
                className="border-t border-line py-8"
              >
                <span className="font-display text-sm text-burgundy">0{i + 1}</span>
                <h3 className="mt-3 text-lg font-semibold text-ink">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-steel-deep">{p.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* 03 — Services */}
      <section className="bg-paper py-20 sm:py-28">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6" data-reveal>
            <div>
              <Eyebrow index="02">Services</Eyebrow>
              <h2 className="font-display mt-6 max-w-2xl text-display-lg leading-[1.05] text-ink">Conservative care, chosen for you.</h2>
            </div>
            <TextLink href="/services">All services</TextLink>
          </div>
          <ul className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <li key={s.slug} data-reveal style={{ transitionDelay: `${(i % 3) * 70}ms` }} className={i === 0 ? "md:col-span-2 lg:col-span-3" : ""}>
                <Link
                  href={`/services/${s.slug}`}
                  className={`group flex h-full rounded-[22px] p-7 transition-all duration-500 ease-[var(--ease-calm)] hover:-translate-y-1 ${
                    i === 0
                      ? "relative flex-col overflow-hidden bg-ink text-white sm:p-10 lg:grid lg:grid-cols-12 lg:items-end lg:gap-8"
                      : "flex-col justify-between bg-white ring-1 ring-line hover:ring-line-strong hover:shadow-[0_24px_50px_-30px_rgba(23,25,28,0.35)]"
                  }`}
                >
                  {i === 0 ? (
                    <>
                      <div className="lg:col-span-6">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-butter">
                          <Icon name={s.icon} className="h-4 w-4" /> Where care begins
                        </span>
                        <h3 className="font-display mt-6 text-display-md leading-tight">{s.title}</h3>
                      </div>
                      <div className="mt-4 lg:col-span-5 lg:col-start-8 lg:mt-0">
                        <p className="text-lg leading-relaxed text-white/75">{s.summary}</p>
                        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white">
                          Learn more <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-paper text-burgundy">
                          <Icon name={s.icon} />
                        </span>
                        <h3 className="font-display mt-6 text-[1.5rem] leading-tight">{s.title}</h3>
                        <p className="mt-3 leading-relaxed text-steel-deep">{s.summary}</p>
                      </div>
                      <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-ink">
                        Learn more <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                      </span>
                    </>
                  )}
                </Link>
              </li>
            ))}
            <li data-reveal>
              <Link href="/conditions" className="group flex h-full flex-col justify-between rounded-[22px] bg-sky p-7 transition-all duration-500 ease-[var(--ease-calm)] hover:-translate-y-1">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-steel-deep">Not sure where you fit?</p>
                  <h3 className="font-display mt-6 text-[1.5rem] leading-tight text-ink">Conditions and concerns</h3>
                  <p className="mt-3 leading-relaxed text-[#2b2f34]">Read about neck pain, lower back pain, headaches and more — including when to see a doctor first.</p>
                </div>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-ink">
                  Explore concerns <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </li>
          </ul>
        </Container>
      </section>

      {/* 04 — Meet your chiropractor */}
      {jasmine && (
        <section className="bg-white py-20 sm:py-28">
          <Container className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5" data-reveal>
              <Photo src="/photos/treatment-765.webp" alt="Dr Jasmine Malak assessing a patient's neck movement in the Panania treatment room" ratio="aspect-[4/5]" position="45% 40%" />
            </div>
            <div className="lg:col-span-6 lg:col-start-7" data-reveal>
              <Eyebrow index="03">Meet your chiropractor</Eyebrow>
              <h2 className="font-display mt-6 text-display-lg leading-[1.05] text-ink">{jasmine.name}</h2>
              <p className="mt-2 font-medium text-steel-deep">{jasmine.role}</p>
              <p className="mt-6 text-lg leading-relaxed text-[#2b2f34]">{jasmine.short}</p>
              {jasmine.philosophy && (
                <blockquote className="font-display mt-8 border-l-2 border-burgundy pl-5 text-[1.4rem] leading-snug text-ink">
                  “{jasmine.philosophy}”
                </blockquote>
              )}
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-steel-deep">Qualifications</h3>
                  <ul className="mt-3 space-y-1.5 text-[0.95rem] text-ink">
                    {jasmine.qualifications.map((q) => (
                      <li key={q}>
                        <Inline text={q} />
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-steel-deep">Clinical interests</h3>
                  <ul className="mt-3 space-y-1.5 text-[0.95rem] text-ink">
                    {jasmine.interests.map((q) => (
                      <li key={q}>
                        <Inline text={q} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <TextLink href="/about#jasmine" className="mt-8">
                Read Jasmine&apos;s full biography
              </TextLink>
            </div>
          </Container>
        </section>
      )}

      {/* 05 — Interactive education */}
      <section className="border-y border-line bg-paper py-20 sm:py-28" aria-labelledby="explore-heading">
        <Container>
          <div className="grid gap-6 lg:grid-cols-12" data-reveal>
            <div className="lg:col-span-7">
              <Eyebrow index="04">Explore the spine</Eyebrow>
              <h2 id="explore-heading" className="font-display mt-6 text-display-lg leading-[1.05] text-ink">
                Understand the structure that carries you.
              </h2>
            </div>
            <p className="self-end text-lg leading-relaxed text-steel-deep lg:col-span-4 lg:col-start-9">
              Choose a region to see how it&apos;s built, what it does and when it&apos;s worth having something checked.
            </p>
          </div>
          <div className="mt-12">
            <SpineExplorer regions={explorer.regions} intro={explorer.intro} />
          </div>
        </Container>
      </section>

      {/* 06 — First visit */}
      <section className="bg-white py-20 sm:py-28">
        <Container>
          <div className="grid gap-6 lg:grid-cols-12" data-reveal>
            <div className="lg:col-span-6">
              <Eyebrow index="05">Your first visit</Eyebrow>
              <h2 className="font-display mt-6 text-display-lg leading-[1.05] text-ink">Three unhurried steps.</h2>
            </div>
            <div className="hidden justify-self-end lg:col-span-4 lg:col-start-9 lg:block">
              <Figure className="h-48 w-auto opacity-90" />
            </div>
          </div>
          <ol className="mt-14 grid gap-px overflow-hidden rounded-[24px] bg-line ring-1 ring-line md:grid-cols-3">
            {[
              { t: "Consultation and clinical history", d: "We listen first — your concern, your health history, how it's affecting you and what you'd like to get back to." },
              { t: "Assessment and discussion", d: "A physical and neurological examination, then a plain-language explanation of what we find and your options." },
              { t: "Individualised management planning", d: "Together we agree on a plan with clear goals and review points — including referral if another path suits you better." },
            ].map((s, i) => (
              <li key={s.t} className="bg-white p-8 sm:p-10" data-reveal style={{ transitionDelay: `${i * 90}ms` }}>
                <span className="font-display text-[3.5rem] leading-none text-sky-deep">{i + 1}</span>
                <h3 className="mt-6 text-lg font-semibold text-ink">{s.t}</h3>
                <p className="mt-3 leading-relaxed text-steel-deep">{s.d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-col gap-6 rounded-[20px] bg-paper p-6 sm:flex-row sm:items-center sm:justify-between" data-reveal>
            <p className="flex max-w-2xl gap-3 text-[0.95rem] leading-relaxed text-[#2b2f34]">
              <Icon name="shield" className="h-6 w-6 shrink-0 text-burgundy" />
              Treatment is provided only where it&apos;s clinically appropriate and with your informed consent. You can ask questions, decline any technique or change your mind at any time.
            </p>
            <TextLink href="/new-patients" className="shrink-0">
              New patient guide
            </TextLink>
          </div>
        </Container>
      </section>

      {/* 07 — Patient education */}
      {articles.length > 0 && (
        <section className="border-t border-line bg-paper py-20 sm:py-28">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-6" data-reveal>
              <div>
                <Eyebrow index="06">Patient education</Eyebrow>
                <h2 className="font-display mt-6 max-w-2xl text-display-lg leading-[1.05] text-ink">Clear, measured reading.</h2>
              </div>
              <TextLink href="/education">Browse the library</TextLink>
            </div>
            <div className="mt-14 grid gap-10 md:grid-cols-3">
              {articles.map((a, i) => (
                <ArticleCard key={a.slug} article={a} i={i} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 08 — Location and booking */}
      <section className="bg-white py-20 sm:py-28">
        <Container className="grid gap-10 lg:grid-cols-12 [&>*]:min-w-0">
          <div className="lg:col-span-5" data-reveal>
            <Eyebrow index="07">Visit us</Eyebrow>
            <h2 className="font-display mt-6 text-display-lg leading-[1.05] text-ink">Find us in Panania.</h2>
            <dl className="mt-10 space-y-6">
              <div className="flex gap-4">
                <Icon name="pin" className="h-6 w-6 shrink-0 text-burgundy" />
                <div>
                  <dt className="text-sm text-steel-deep">Address</dt>
                  <dd className="mt-0.5 font-semibold text-ink">
                    {clinic.streetAddress}, {clinic.suburb} {clinic.state} {clinic.postcode}
                    <span className="block font-normal text-steel-deep">{clinic.locationNote}</span>
                  </dd>
                </div>
              </div>
              <div className="flex gap-4">
                <Icon name="clock" className="h-6 w-6 shrink-0 text-burgundy" />
                <div>
                  <dt className="text-sm text-steel-deep">Hours</dt>
                  <dd className="mt-0.5 text-ink">
                    {openDays.map((d) => (
                      <span key={d.day} className="block font-semibold">
                        {d.day} · {d.note}
                      </span>
                    ))}
                    <span className="mt-1 block text-sm text-steel-deep">
                      <Inline text={clinic.hoursNote} />
                    </span>
                  </dd>
                </div>
              </div>
              <div className="flex gap-4">
                <Icon name="phone" className="h-6 w-6 shrink-0 text-burgundy" />
                <div>
                  <dt className="text-sm text-steel-deep">Phone and email</dt>
                  <dd className="mt-0.5 font-semibold text-ink">
                    <a href={`tel:${clinic.phone.replace(/\s/g, "")}`} className="hover:text-burgundy">
                      {clinic.phone}
                    </a>
                    <a href={`mailto:${clinic.email}`} className="block break-all font-normal text-steel-deep hover:text-burgundy">
                      {clinic.email}
                    </a>
                  </dd>
                </div>
              </div>
              <div className="border-t border-line pt-6 text-sm leading-relaxed text-steel-deep">
                <p>
                  <strong className="text-ink">Parking:</strong> <Inline text={clinic.parking} />
                </p>
                <p className="mt-2">
                  <strong className="text-ink">Accessibility:</strong> <Inline text={clinic.accessibility} />
                </p>
              </div>
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <BookButton url={clinic.bookingUrl} />
              <ButtonLink href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress(clinic))}`} external variant="ghost">
                Directions
              </ButtonLink>
            </div>
          </div>
          <div className="lg:col-span-7" data-reveal>
            <MapEmbed address={fullAddress(clinic)} className="h-[22rem] sm:h-[28rem] lg:h-full lg:min-h-[30rem]" />
          </div>
        </Container>
      </section>
    </>
  );
}
