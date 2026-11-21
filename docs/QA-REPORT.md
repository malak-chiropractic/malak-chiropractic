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
- **Colour contrast:** the token pairs used for text all pass WCAG AA (body text in steel-deep is 6.5:1 on soft white; white on burgundy is 9.4:1).

## Not yet tested (needs credentials or a live deployment)
- Email delivery through Resend (needs an API key and a verified domain).
- Keystatic GitHub mode on the live site (needs the GitHub App setup).
- The daily scheduled rebuild (needs Vercel Cron and a deploy hook).
- The Google Maps embed loading inside the live site. It's blocked inside the preview window but uses Google's standard embed.
- Lighthouse and Core Web Vitals on production hosting.
- Real-device testing on iOS Safari and Android Chrome. Only Chromium emulation has been used.
- Full screen-reader pass (VoiceOver or NVDA). Semantics, labels and focus states are in place but haven't been audited with assistive technology.

## Known limitations
- The preview link is a static copy. Its forms can't send, and the map won't load inside the preview window.
- Article cover images are original generative placeholders until real images are uploaded.
