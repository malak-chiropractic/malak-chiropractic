# QA report — 21 November 2026

## Tested and passing
- **Build and lint:** production build completes; TypeScript and ESLint pass with no errors. 39 routes are prerendered, plus the API routes.
- **Links:** an automated crawl from the homepage reached 36 internal pages with **0 broken links**.
- **Responsive:** all page types checked at 1440 px and 390 px. No horizontal overflow on mobile after fixes (the map sizing and footer email wrap were fixed).
- **Runtime errors:** no JavaScript page errors on any page type, on desktop or mobile.
- **Interactive spine:** region tabs work by mouse, touch hit areas and keyboard (arrow keys, Home and End); content updates; there's a text-only alternative.
- **Article library:** search and category filters work, and the empty state shows when nothing matches.
- **FAQ library:** search and category filters work.
- **Contact API:** valid input when email isn't configured returns 503 with a clear message, and the form shows the phone and email fallback. Invalid input returns 422 with field-level errors. The honeypot and the "too fast" check are in place.
- **CMS:** the editor loads all collections and singletons from the existing files. A save round-trip was tested (clinic details, an article) and the site reads the saved files correctly. One issue was fixed: empty review dates had been blocking article saves.
- **Article gate:** without `SHOW_UNREVIEWED`, no unreviewed article is listed, linked or in the sitemap.
- **Automated accessibility (axe-core, WCAG 2.0/2.1/2.2 A and AA rules):** all 41 pages passed with 0 violations, after fixing one list-markup issue on the homepage.
- **Lighthouse (simulated mobile):**
  - Homepage: Performance 97, Accessibility 100, Best Practices 100, SEO 100 (LCP 2.5 s, CLS 0)
  - For GPs page: Performance 94, Accessibility 100, Best Practices 100, SEO 100
  - Articles: Performance 94, Accessibility 100. SEO only drops because unreviewed drafts are intentionally set to noindex.
- **Colour contrast:** the token pairs used for text all pass WCAG AA (body text in steel-deep is 6.5:1 on soft white; white on burgundy is 9.4:1).

## Not yet tested (needs credentials or a live deployment)
- Email delivery through Resend (needs an API key and a verified domain).
- Keystatic GitHub mode on the live site (needs the GitHub App setup).
- The daily scheduled rebuild (needs Vercel Cron and a deploy hook).
- The Google Maps embed loading inside the live site. It's blocked inside the preview window but uses Google's standard embed.
- Core Web Vitals from real visitors (Search Console shows these once the site has traffic).
- Real-device testing on iOS Safari and Android Chrome. Only Chromium emulation has been used.
- Manual screen-reader pass (VoiceOver or NVDA). Automated checks pass, but a human pass with assistive technology is still recommended.

## Known limitations
- The preview link is a static copy. Its forms can't send, and the map won't load inside the preview window.
- Article cover images are original generative placeholders until real images are uploaded.
