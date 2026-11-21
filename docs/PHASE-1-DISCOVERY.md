# Phase 1 — Discovery and creative direction

## Brand and positioning
A considered, evidence-informed musculoskeletal clinic inside Panania Family Doctors. Malak Chiropractic stands for careful assessment, clear explanation, conservative care and working alongside GPs. It's a high-quality service within a GP practice, not a "quick crack". The tone is warm, professional, educational and quietly sophisticated.

## Visual direction
Modern clinical meets premium editorial: generous space, hairline rules, numbered sections and an asymmetric 12-column grid. The interlocked MC monogram is the primary mark. The anatomical figure is a quiet accent, used no more than once per page.

## Typography and colour
- **Typography:** Gilda Display for headlines (it echoes the logo's fine, high-contrast lettering) and Manrope for body text and interface.
- **Colour:** steel #66717A, near black #17191C and soft white #F8F9FA dominate. Burgundy #762D43 is for actions, baby blue #DCECF5 marks education, and butter yellow #F5E7A8 is for small highlights. See `/design-system`.

## Sitemap
Home · About · Services (6) · Conditions (10) · Patient Education (library, articles, interactive spine) · For GPs (+ printable referral sheet) · New Patients · Products · FAQ · Contact · Privacy · Website terms.

## Technical architecture
Next.js 16 (App Router), React, TypeScript and Tailwind CSS. Every page is prerendered from structured files. Motion is CSS-only (no animation library), to keep JavaScript minimal. The anatomy illustration is SVG. Forms go through a server route to Resend. The site deploys on Vercel.

## CMS recommendation: Keystatic
| | Keystatic (chosen) | Sanity | Payload | WordPress (headless) |
|---|---|---|---|---|
| Cost | Free | Free tier; paid for some workflow features | Free, but needs a database host | Hosting + plugins |
| Editing | Clean forms and rich text | Excellent | Good | Familiar |
| Maintenance | None (content lives in your repo) | Low | Database and server upkeep | Ongoing updates and security |
| Security | Login via GitHub; no database | Hosted | Self-managed | Frequent target |
| Clinical-review gate | Enforced in site code | Possible | Possible | Plugins |

Keystatic wins for a sole practitioner: there's nothing extra to pay for or patch, content is versioned (every change can be undone), and the review-before-publish rule is built into the site.
