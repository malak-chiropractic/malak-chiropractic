import "server-only";
import fs from "node:fs";
import path from "node:path";
import { load as yamlLoad } from "js-yaml";
import Markdoc, { type RenderableTreeNode } from "@markdoc/markdoc";

/**
 * Content layer. Every page renders from the files in /content, which are
 * edited through the CMS (Keystatic, at /keystatic). Field shapes here must
 * match keystatic.config.ts.
 */

const ROOT = path.join(process.cwd(), "content");

function readYaml<T>(rel: string): T {
  return yamlLoad(fs.readFileSync(path.join(ROOT, rel), "utf8")) as T;
}

function listSlugs(dir: string, ext: string): string[] {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(ext))
    .map((f) => f.slice(0, -ext.length))
    .sort();
}

/* ───────────── Types ───────────── */

export type Clinic = {
  name: string;
  tagline: string;
  streetAddress: string;
  suburb: string;
  state: string;
  postcode: string;
  locationNote: string;
  phone: string;
  email: string;
  bookingUrl: string;
  hours: { day: string; open: boolean; note: string }[];
  hoursNote: string;
  parking: string;
  accessibility: string;
  publicTransport: string;
  emergencyNotice: string;
  instagram?: string;
  linkedin?: string;
};

export type Pricing = {
  intro: string;
  items: { name: string; duration: string; price: string; description: string }[];
  payments: string;
  rebates: string;
  medicare: string;
  dvaWorkersComp: string;
  cancellation: string;
};

export type Home = {
  heroEyebrow: string;
  heroHeadline: string;
  heroText: string;
  introHeading: string;
  introText: string;
  principles: { title: string; text: string }[];
};

export type Practitioner = {
  slug: string;
  name: string;
  role: string;
  type: "principal" | "locum";
  order: number;
  qualifications: string[];
  registration: string;
  certifications: string[];
  interests: string[];
  techniques: string[];
  short: string;
  bio: string;
  philosophy: string;
  photo: string;
  photoAlt: string;
  published: boolean;
};

export type FAQ = { q: string; a: string };

export type Service = {
  slug: string;
  title: string;
  order: number;
  icon: string;
  summary: string;
  seoTitle: string;
  seoDescription: string;
  involves: string;
  considered: string;
  expect: string;
  suitability: string;
  precautions: string;
  faqs: FAQ[];
  relatedArticles: string[];
  relatedConditions: string[];
};

export type Region = "cervical" | "thoracic" | "lumbar" | "pelvis" | "peripheral";

export type Condition = {
  slug: string;
  title: string;
  region: Region;
  order: number;
  summary: string;
  overview: string;
  symptoms: string;
  contributors: string;
  care: string;
  redFlags: string;
  seoTitle: string;
  seoDescription: string;
  relatedArticles: string[];
  relatedServices: string[];
};

export type ArticleStatus = "draft" | "in-review" | "approved";

export type Article = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  audiences: string[];
  author: string;
  publishDate: string;
  status: ArticleStatus;
  reviewer: string;
  reviewedDate: string;
  featuredImage?: string;
  featuredImageAlt: string;
  seoTitle: string;
  seoDescription: string;
  relatedArticles: string[];
  references: string[];
  body: string;
  readingMinutes: number;
  /** true when it is visible only because unreviewed preview is enabled */
  isPreviewOnly: boolean;
};

export type Product = {
  slug: string;
  name: string;
  order: number;
  kicker: string;
  description: string;
  details: string[];
  price: string;
  availability: string;
  howToBuy: string;
  accent: "sky" | "butter" | "burgundy" | "steel";
  image: string;
  imageAlt: string;
  published: boolean;
};

export type FaqLibrary = {
  categories: { key: string; label: string }[];
  items: { category: string; question: string; answer: string }[];
};

export type GpContent = {
  intro: string;
  offer: string;
  scope: string[];
  scopeNote: string;
  referrals: string;
  medicare: string;
  assessment: string;
  communication: string;
  referBack: string[];
  secureReferral: string;
  faqs: FAQ[];
};

/* ───────────── Categories ───────────── */

export const ARTICLE_CATEGORIES: { key: string; label: string }[] = [
  { key: "understanding-pain", label: "Understanding Pain" },
  { key: "spinal-health", label: "Spinal Health" },
  { key: "movement-rehabilitation", label: "Movement and Rehabilitation" },
  { key: "common-conditions", label: "Common Musculoskeletal Conditions" },
  { key: "workplace-posture", label: "Workplace and Posture" },
  { key: "pregnancy", label: "Pregnancy and Musculoskeletal Health" },
  { key: "children", label: "Children's Musculoskeletal Health" },
  { key: "faq", label: "Frequently Asked Questions" },
  { key: "chiropractic-care-explained", label: "Chiropractic Care Explained" },
];

export const AUDIENCES: { key: string; label: string }[] = [
  { key: "desk-workers", label: "Desk and office workers" },
  { key: "manual-workers", label: "Tradies and manual workers" },
  { key: "injured-workers", label: "Injured workers (workers comp)" },
  { key: "pregnancy", label: "Pregnancy and postnatal" },
  { key: "parents", label: "Parents and children" },
  { key: "active", label: "Active people and runners" },
  { key: "older-adults", label: "Older adults" },
  { key: "persistent-pain", label: "People living with persistent pain" },
  { key: "everyone", label: "Everyone" },
];
export const audienceLabel = (k: string) => AUDIENCES.find((a) => a.key === k)?.label ?? k;

export function categoryLabel(key: string) {
  return ARTICLE_CATEGORIES.find((c) => c.key === key)?.label ?? key;
}

/* ───────────── Loaders ───────────── */

export const getClinic = () => readYaml<Clinic>("settings/clinic.yaml");
export const getPricing = () => readYaml<Pricing>("settings/pricing.yaml");
export const getHome = () => readYaml<Home>("settings/home.yaml");
export const getFaqLibrary = () => readYaml<FaqLibrary>("settings/faqs.yaml");
export const getGp = () => readYaml<GpContent>("settings/gp.yaml");

export function getPractitioners(): Practitioner[] {
  return listSlugs("practitioners", ".yaml")
    .map((slug) => ({ slug, ...readYaml<Omit<Practitioner, "slug">>(`practitioners/${slug}.yaml`) }))
    .sort((a, b) => a.order - b.order);
}

export function getServices(): Service[] {
  return listSlugs("services", ".yaml")
    .map((slug) => {
      const d = readYaml<Omit<Service, "slug">>(`services/${slug}.yaml`);
      return { slug, ...d, faqs: d.faqs ?? [], relatedArticles: d.relatedArticles ?? [], relatedConditions: d.relatedConditions ?? [] };
    })
    .sort((a, b) => a.order - b.order);
}
export const getService = (slug: string) => getServices().find((s) => s.slug === slug);

export function getConditions(): Condition[] {
  return listSlugs("conditions", ".yaml")
    .map((slug) => {
      const d = readYaml<Omit<Condition, "slug">>(`conditions/${slug}.yaml`);
      return { slug, ...d, relatedArticles: d.relatedArticles ?? [], relatedServices: d.relatedServices ?? [] };
    })
    .sort((a, b) => a.order - b.order);
}
export const getCondition = (slug: string) => getConditions().find((c) => c.slug === slug);

export function getProducts(): Product[] {
  return listSlugs("products", ".yaml")
    .map((slug) => ({ slug, ...readYaml<Omit<Product, "slug">>(`products/${slug}.yaml`) }))
    .filter((p) => p.published)
    .sort((a, b) => a.order - b.order);
}

/* ───────────── Articles & the clinical review gate ───────────── */

function parseFrontmatter(src: string): { data: Record<string, unknown>; body: string } {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: src };
  return { data: (yamlLoad(m[1]) as Record<string, unknown>) ?? {}, body: m[2] };
}

function toDateString(v: unknown): string {
  if (!v) return "";
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v);
}

/** Today's date in Sydney, YYYY-MM-DD — used for scheduled publishing. */
export function todaySydney(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Australia/Sydney" }).format(new Date());
}

/**
 * An article goes live only when ALL of these are true:
 *  - status is "approved"
 *  - a clinical reviewer and review date are recorded
 *  - the publish date has arrived (enables scheduling)
 * SHOW_UNREVIEWED=1 lets drafts appear (clearly bannered) in preview builds only.
 */
export function isLive(a: Pick<Article, "status" | "reviewer" | "reviewedDate" | "publishDate">) {
  return (
    a.status === "approved" &&
    !!a.reviewer?.trim() &&
    !!a.reviewedDate &&
    !!a.publishDate &&
    a.publishDate <= todaySydney()
  );
}

const showUnreviewed = () => process.env.SHOW_UNREVIEWED === "1";

function loadArticle(slug: string): Article {
  const raw = fs.readFileSync(path.join(ROOT, "articles", `${slug}.mdoc`), "utf8");
  const { data, body } = parseFrontmatter(raw);
  const words = body.split(/\s+/).filter(Boolean).length;
  const a = {
    slug,
    title: String(data.title ?? slug),
    summary: String(data.summary ?? ""),
    category: String(data.category ?? ""),
    audiences: (data.audiences as string[]) ?? [],
    author: String(data.author ?? ""),
    publishDate: toDateString(data.publishDate),
    status: (data.status as ArticleStatus) ?? "draft",
    reviewer: String(data.reviewer ?? ""),
    reviewedDate: toDateString(data.reviewedDate),
    featuredImage: data.featuredImage ? String(data.featuredImage) : undefined,
    featuredImageAlt: String(data.featuredImageAlt ?? ""),
    seoTitle: String(data.seoTitle ?? data.title ?? ""),
    seoDescription: String(data.seoDescription ?? data.summary ?? ""),
    relatedArticles: (data.relatedArticles as string[]) ?? [],
    references: (data.references as string[]) ?? [],
    body,
    readingMinutes: Math.max(1, Math.round(words / 220)),
    isPreviewOnly: false,
  };
  a.isPreviewOnly = !isLive(a);
  return a;
}

/** Articles visible on the site, newest first. */
export function getArticles(): Article[] {
  return listSlugs("articles", ".mdoc")
    .map(loadArticle)
    .filter((a) => isLive(a) || (showUnreviewed() && a.status !== "draft"))
    .sort((a, b) => (a.publishDate < b.publishDate ? 1 : -1));
}
export const getArticle = (slug: string) => getArticles().find((a) => a.slug === slug);

export function renderMarkdoc(body: string): RenderableTreeNode {
  const ast = Markdoc.parse(body);
  return Markdoc.transform(ast);
}

/* ───────────── Helpers ───────────── */

export function formatDate(d: string) {
  if (!d) return "";
  const [y, m, day] = d.split("-").map(Number);
  return new Intl.DateTimeFormat("en-AU", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(Date.UTC(y, m - 1, day))
  );
}

export function fullAddress(c: Clinic) {
  return `${c.streetAddress}, ${c.suburb} ${c.state} ${c.postcode}`;
}

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.malakchiropractic.com.au").replace(/\/$/, "");

export type AnatomyRegion = {
  key: "cervical" | "thoracic" | "lumbar" | "pelvis";
  label: string;
  range: string;
  count: string;
  summary: string;
  structures: string[];
  function: string;
  symptoms: string[];
  seekCare: string;
  articles: string[];
  conditions: string[];
};
export const getAnatomy = () => readYaml<{ intro: string; regions: AnatomyRegion[] }>("settings/anatomy.yaml");
