import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "@fontsource/gilda-display/400.css";
import "./globals.css";
import { SITE_URL } from "@/lib/content";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Malak Chiropractic | Chiropractor in Panania, Sydney",
    template: "%s | Malak Chiropractic",
  },
  description:
    "Individualised, conservative chiropractic care in Panania, Sydney. Thorough assessment, clear explanations and exercise-based management for neck, back and musculoskeletal pain.",
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: "Malak Chiropractic",
  },
  robots: process.env.NEXT_PUBLIC_NOINDEX === "1" ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = {
  themeColor: "#f8f9fa",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU">
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
