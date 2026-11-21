import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-12 ${className}`}>{children}</div>;
}

export function Eyebrow({ children, index, className = "" }: { children: ReactNode; index?: string; className?: string }) {
  return (
    <p className={`flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-steel-deep ${className}`}>
      {index && <span className="font-display text-sm normal-case tracking-normal text-burgundy">{index}</span>}
      {index && <span aria-hidden className="h-px w-8 bg-line-strong" />}
      <span>{children}</span>
    </p>
  );
}

type Variant = "primary" | "secondary" | "ghost" | "light";
const variants: Record<Variant, string> = {
  primary: "bg-burgundy text-white hover:bg-burgundy-deep shadow-[0_1px_0_rgba(0,0,0,0.08)]",
  secondary: "bg-ink text-white hover:bg-[#2a2e33]",
  ghost: "border border-line-strong text-ink hover:border-ink hover:bg-white",
  light: "bg-white text-ink hover:bg-paper",
};

const base =
  "group inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[0.95rem] font-semibold transition-all duration-300 ease-[var(--ease-calm)] active:scale-[0.98]";

export function ButtonLink({
  href,
  variant = "primary",
  children,
  external,
  className = "",
  ...rest
}: { href: string; variant?: Variant; external?: boolean; className?: string; children: ReactNode } & Omit<
  ComponentProps<"a">,
  "href"
>) {
  const cls = `${base} ${variants[variant]} ${className}`;
  const inner = (
    <>
      {children}
      <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" external={external} />
    </>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...rest}>
        {inner}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {inner}
    </Link>
  );
}

export function BookButton({
  url,
  label = "Book online",
  variant = "primary",
  className = "",
}: {
  url: string;
  label?: string;
  variant?: Variant;
  className?: string;
}) {
  return (
    <ButtonLink href={url} external variant={variant} className={className}>
      {label}
    </ButtonLink>
  );
}

export function TextLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-1.5 font-semibold text-burgundy underline decoration-burgundy/30 underline-offset-4 transition-colors hover:decoration-burgundy ${className}`}
    >
      {children}
      <Arrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

export function Arrow({ className = "", external }: { className?: string; external?: boolean }) {
  return external ? (
    <svg viewBox="0 0 16 16" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 11L11 5M6 5h5v5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 16 16" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Labelled placeholder for photography that hasn't been supplied yet. Never a fake photo. */
export function PhotoPlaceholder({
  label,
  ratio = "aspect-[4/5]",
  tone = "steel",
  className = "",
  labelTop = false,
}: {
  label: string;
  ratio?: string;
  tone?: "steel" | "sky" | "butter" | "paper";
  className?: string;
  labelTop?: boolean;
}) {
  const tones = {
    steel: "bg-[linear-gradient(160deg,#eef0f2,#dfe3e6)] text-steel-deep",
    sky: "bg-sky text-steel-deep",
    butter: "bg-butter/70 text-ink",
    paper: "bg-white text-steel-deep",
  };
  return (
    <div
      role="img"
      aria-label={`Photo placeholder: ${label}`}
      className={`relative overflow-hidden rounded-[22px] ${tones[tone]} ${ratio} ${className}`}
    >
      <svg aria-hidden className="absolute inset-0 h-full w-full opacity-[0.35]" preserveAspectRatio="none">
        <defs>
          <pattern id="ph-grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M28 0H0V28" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ph-grid)" />
      </svg>
      <div className={`absolute inset-x-4 flex justify-between gap-3 ${labelTop ? "top-4 items-start" : "bottom-4 items-end"}`}>
        <span className="whitespace-nowrap rounded-full bg-white/85 px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] backdrop-blur">
          Photo to come
        </span>
        <span className="text-right text-xs font-medium leading-snug opacity-80">{label}</span>
      </div>
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-line bg-paper pt-14 pb-12 sm:pt-20 sm:pb-16">
      <Container>
        <Eyebrow className="rise">{eyebrow}</Eyebrow>
        <h1 className="rise font-display mt-5 max-w-4xl text-display-lg leading-[1.04] text-ink [animation-delay:80ms]">
          {title}
        </h1>
        {intro && (
          <div className="rise mt-6 max-w-2xl text-lg leading-relaxed text-steel-deep [animation-delay:160ms]">{intro}</div>
        )}
        {children && <div className="rise mt-8 [animation-delay:220ms]">{children}</div>}
      </Container>
    </section>
  );
}

export function Icon({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<string, ReactNode> = {
    consult: (
      <>
        <circle cx="12" cy="8" r="3.2" {...p} />
        <path d="M5.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5" {...p} />
      </>
    ),
    needle: (
      <>
        <path d="M5 19L17.5 6.5" {...p} />
        <circle cx="18.5" cy="5.5" r="1.4" {...p} />
        <path d="M4 20l1.2-1.2" {...p} />
      </>
    ),
    hands: <path d="M7 13V7.5a1.5 1.5 0 013 0V12m0-5.5V5a1.5 1.5 0 013 0v7m0-5.5a1.5 1.5 0 013 0V13c0 4-2.5 7-6 7s-5.5-2-6.5-4.5L5 12.5a1.4 1.4 0 012.3-1.5L8 12" {...p} />,
    movement: (
      <>
        <circle cx="14" cy="4.5" r="1.8" {...p} />
        <path d="M8 21l3-6 3 2v4M6 11l3.5-3.5 4 1 2.5 3.5 3 .5M11 15l2-5" {...p} />
      </>
    ),
    table: (
      <>
        <path d="M3 11h5l1.5-1.5H14L15.5 11H21" {...p} />
        <path d="M5 11v8M19 11v8M3 15h18" {...p} />
      </>
    ),
    neuro: (
      <>
        <path d="M12 3v18" {...p} />
        <path d="M12 7c-2-1-4.5-.5-6 1M12 7c2-1 4.5-.5 6 1M12 12c-2.5-1-5-.3-7 1.5M12 12c2.5-1 5-.3 7 1.5M12 17c-2-.8-4-.2-5.5 1M12 17c2-.8 4-.2 5.5 1" {...p} />
      </>
    ),
    pin: (
      <>
        <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0113 0c0 5.4-6.5 11-6.5 11z" {...p} />
        <circle cx="12" cy="10" r="2.3" {...p} />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="8.5" {...p} />
        <path d="M12 7.5V12l3 2" {...p} />
      </>
    ),
    phone: <path d="M6.5 3.5h3l1.5 4-2 1.3a10 10 0 005.2 5.2l1.3-2 4 1.5v3A2 2 0 0117.3 18.5 14.5 14.5 0 014.5 5.7 2 2 0 016.5 3.5z" {...p} />,
    mail: (
      <>
        <rect x="3.5" y="5.5" width="17" height="13" rx="2" {...p} />
        <path d="M4 7l8 6 8-6" {...p} />
      </>
    ),
    book: (
      <>
        <rect x="4" y="5" width="16" height="15" rx="2" {...p} />
        <path d="M4 10h16M9 3v4M15 3v4" {...p} />
      </>
    ),
    doc: (
      <>
        <path d="M7 3.5h7l4 4V20a.5.5 0 01-.5.5h-10.5A.5.5 0 016.5 20V4a.5.5 0 01.5-.5z" {...p} />
        <path d="M14 3.5V8h4M9.5 12.5h5M9.5 16h5" {...p} />
      </>
    ),
    shield: (
      <>
        <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" {...p} />
        <path d="M9 12l2 2 4-4" {...p} />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      {paths[name] ?? paths.consult}
    </svg>
  );
}

/** A real photograph, art-directed into the same rounded frame as placeholders. */
export function Photo({ src, alt, ratio = "aspect-[4/5]", className = "", position = "center" }: { src: string; alt: string; ratio?: string; className?: string; position?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-[22px] bg-[#e7eaec] ${ratio} ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: position }} />
    </div>
  );
}
