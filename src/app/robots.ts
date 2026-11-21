import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/content";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  if (process.env.NEXT_PUBLIC_NOINDEX === "1") return { rules: [{ userAgent: "*", disallow: "/" }] };
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/keystatic", "/api/", "/design-system"] }], sitemap: `${SITE_URL}/sitemap.xml` };
}
