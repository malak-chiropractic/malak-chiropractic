import Link from "next/link";
import { type Article, categoryLabel, formatDate } from "@/lib/content";

const tones = ["bg-sky", "bg-[#e7eaec]", "bg-butter/70"];

/** Editorial cover: an original generative composition until real imagery is supplied. */
export function ArticleCover({ article, i = 0, className = "" }: { article: Pick<Article, "slug" | "title" | "featuredImage" | "featuredImageAlt">; i?: number; className?: string }) {
  if (article.featuredImage) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={article.featuredImage} alt={article.featuredImageAlt} className={`h-full w-full object-cover ${className}`} loading="lazy" />;
  }
  const seed = article.slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const tone = tones[(seed + i) % tones.length];
  return (
    <div className={`relative h-full w-full overflow-hidden ${tone} ${className}`} role="img" aria-label={article.featuredImageAlt || article.title}>
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
        {Array.from({ length: 9 }).map((_, k) => {
          const y = 40 + k * 26;
          const amp = 10 + ((seed + k * 7) % 22);
          return (
            <path
              key={k}
              d={`M-10 ${y} C 90 ${y - amp}, 180 ${y + amp}, 260 ${y} S 380 ${y - amp / 2}, 420 ${y}`}
              fill="none"
              stroke="#17191c"
              strokeOpacity={0.08 + (k % 3) * 0.05}
              strokeWidth="1"
            />
          );
        })}
        <circle cx={120 + (seed % 160)} cy={110 + (seed % 70)} r={34 + (seed % 20)} fill="#762d43" fillOpacity="0.9" />
      </svg>
    </div>
  );
}

export function ArticleCard({ article, i = 0, headingLevel = 3 }: { article: Article; i?: number; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className="group relative flex h-full flex-col" data-reveal>
      <div className="aspect-[4/3] overflow-hidden rounded-[20px]">
        <div className="h-full w-full transition-transform duration-700 ease-[var(--ease-calm)] group-hover:scale-[1.03]">
          <ArticleCover article={article} i={i} />
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-steel-deep">
        <span className="font-semibold uppercase tracking-[0.12em] text-burgundy">{categoryLabel(article.category)}</span>
        <span aria-hidden>·</span>
        <time dateTime={article.publishDate}>{formatDate(article.publishDate)}</time>
        <span aria-hidden>·</span>
        <span>{article.readingMinutes} min read</span>
      </div>
      <H className="font-display mt-3 text-[1.45rem] leading-snug text-ink">
        <Link href={`/education/${article.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
          {article.title}
        </Link>
      </H>
      <p className="mt-2 line-clamp-3 text-[0.95rem] leading-relaxed text-steel-deep">{article.summary}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
        Read article
        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </span>
      {article.isPreviewOnly && (
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wider text-burgundy">
          Awaiting clinical review
        </span>
      )}
    </article>
  );
}
