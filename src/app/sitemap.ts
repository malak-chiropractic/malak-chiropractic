import type { MetadataRoute } from "next";
import { getArticles, getConditions, getServices, SITE_URL } from "@/lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/about", "/services", "/conditions", "/education", "/education/spine", "/for-gps", "/for-gps/referral-information", "/new-patients", "/products", "/faq", "/contact", "/privacy", "/website-terms"];
  return [
    ...staticPaths.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7 })),
    ...getServices().map((s) => ({ url: `${SITE_URL}/services/${s.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...getConditions().map((c) => ({ url: `${SITE_URL}/conditions/${c.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...getArticles().filter((a) => !a.isPreviewOnly).map((a) => ({ url: `${SITE_URL}/education/${a.slug}`, lastModified: a.reviewedDate || a.publishDate, priority: 0.6 })),
  ];
}
