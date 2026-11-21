import type { NextConfig } from "next";

// STATIC_EXPORT=1 produces a static preview build (no API routes, no CMS admin).
// Production on Vercel uses the normal server build so the contact form and CMS work.
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  // Classic static generation suits a content site; every page is prerendered at build time.
  cacheComponents: false,
  partialPrefetching: false,
  ...(isStaticExport
    ? { output: "export" as const, trailingSlash: true, images: { unoptimized: true } }
    : {}),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  ...(isStaticExport ? {} : { headers: async () => [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ] }),
};

export default nextConfig;
