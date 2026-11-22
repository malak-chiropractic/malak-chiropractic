# Malak Chiropractic website — handover guide

## 1. What you have
- A Next.js 16 website (React, TypeScript, Tailwind CSS), with every page built from the files in `/content`.
- A built-in content editor at **/keystatic** for articles, FAQs, services, conditions, fees, hours, products, GP information and the interactive spine.
- A contact form and GP enquiry form that email you through Resend, with spam protection (hidden honeypot field, timing check and rate limit) and server-side validation.
- Online booking goes to your existing Cliniko page. The site doesn't show live availability or a fake calendar.

## 2. Deploying (about 30 minutes, one time)
You'll need: a GitHub account, a Vercel account and a Resend account.

1. **GitHub:** create a private repository (e.g. `malak-chiropractic-website`) and upload this project to it.
2. **Vercel:** *Add New → Project → Import* the repository. Framework: Next.js (detected automatically). Add the environment variables in section 4, then **Deploy**.
3. **Plan:** Vercel's free Hobby plan is for non-commercial use only. A clinic website needs the **Pro** plan (US$20/month, which includes US$20 of usage credit).
4. **Content editor on the live site:** visit `https://your-site/keystatic` and follow Keystatic's prompt to create a GitHub App. It generates the four `KEYSTATIC_*` values. Add them to Vercel and redeploy. From then on, saving in the editor commits to GitHub and Vercel republishes within about a minute.
5. **Scheduled publishing:** in Vercel → Settings → Git → *Deploy Hooks*, create a hook and save its URL as `DEPLOY_HOOK_URL`. Add a random `CRON_SECRET`. `vercel.json` already runs a rebuild at about 6 am Sydney time every day, so articles with a future publish date appear on that morning.

## 3. Domain
1. Buy the domain (e.g. `malakchiropractic.com.au`). A `.com.au` needs your ABN.
2. In Vercel → Project → Settings → Domains, add `www.malakchiropractic.com.au` and `malakchiropractic.com.au`.
3. At your registrar, add the DNS records Vercel shows: an A record for the apex and a CNAME for `www`. HTTPS is automatic.
4. Set `NEXT_PUBLIC_SITE_URL` to the final address and redeploy.

## 4. Environment variables
| Name | Required | What it's for |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical URLs, sitemap and structured data, e.g. `https://www.malakchiropractic.com.au` |
| `RESEND_API_KEY` | Yes | Sends form enquiries (resend.com → API Keys) |
| `CONTACT_TO_EMAIL` | Yes | Where enquiries arrive |
| `CONTACT_FROM_EMAIL` | Yes | A sender on your verified domain, e.g. `Malak Chiropractic <website@malakchiropractic.com.au>` |
| `NEXT_PUBLIC_KEYSTATIC_REPO` | Yes | `github-username/repository-name` |
| `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | Yes | Created by the Keystatic setup screen |
| `DEPLOY_HOOK_URL`, `CRON_SECRET` | Yes | Daily rebuild for scheduled articles |
| `SHOW_UNREVIEWED` | Never in production | Preview-only: shows unapproved articles with a banner |
| `NEXT_PUBLIC_NOINDEX` | Optional | Set to `1` on a staging site to block search engines |

Secrets are only read on the server and never sent to the browser.

## 5. Using the editor (no code)
Go to `/keystatic` and sign in with GitHub.
- **Clinic details and hours:** phone, email, hours, parking, accessibility. Changes show across the whole site.
- **Fees and payments:** each fee, rebates, Medicare, DVA/workers comp and cancellation wording.
- **Homepage:** headline, intro and the six principles.
- **Services / Conditions:** each section is a text box. Leave a blank line between paragraphs, and start lines with `- ` for bullets.
- **FAQ library:** add a question and set its category key (e.g. `pricing`).
- **Products:** upload a photo, set the price and availability, and tick *Show on website*.
- **Practitioners:** tick *Show full profile* only once the details are confirmed (Dr Tyler is off for now).
- Anything written as `[TO CONFIRM: …]` shows on the site as a yellow highlighted note. Replace them all before launch.

## 6. Publishing an article
1. *Articles → Add*. Write the title, short description, category and body. Status: **Draft**.
2. When it's ready for review, set Status to **In clinical review**.
3. After clinical review, fill in **Clinically reviewed by** and **Last clinically reviewed**, set Status to **Approved**, choose a **Publish date**, and Save.
4. It appears on the publish date. If any of these steps is missing, it stays hidden. This is enforced in code (`src/lib/content.ts → isLive`).

## 7. Replacing images
- **Photos:** upload in the editor where there's an image field (articles, products). For other photos, add files to `public/photos/` and reference them as `/photos/file.webp`. Aim for under 300 KB, about 1600 px wide, in WebP or JPG.
- **Logo:** traced vectors are in `src/components/brand-paths.ts`, and the figure image is in `public/brand/`. Supply new artwork and re-run the trace, or replace the files with SVGs.
- **Favicon:** replace `src/app/icon.png` and `src/app/apple-icon.png`.

## 8. Maintenance
- **Monthly:** publish an article; check the form still delivers (send yourself a test); glance at Google Search Console.
- **Quarterly:** check fees, hours and FAQs; run `npm outdated` and update dependencies (or ask a developer for an hour's work).
- **Yearly:** re-review articles and update review dates; review the privacy policy and compliance checklist; renew the domain.

## 9. Estimated running costs
| Item | Approximate cost |
|---|---|
| Vercel Pro (hosting) | US$20/month |
| Domain (.com.au) | ~A$20–40/year |
| Resend (email) | Free tier is enough for enquiry volumes; paid plans if you outgrow it |
| GitHub, Keystatic | Free |
| Google Business Profile, Search Console | Free |

Check current prices before signing up.

## 10. Google Search Console and Business Profile
- **Search Console:** add the domain property, verify by DNS, and submit `https://www.malakchiropractic.com.au/sitemap.xml`.
- **Business Profile:** use exactly the same name, address and phone as the site ("Malak Chiropractic, 75 Anderson Avenue, Panania NSW 2213, 02 9053 8383"). Category: Chiropractor. Link to the homepage and set the booking link to Cliniko. Don't reuse patient reviews in your own advertising (see the compliance checklist).
- **Local SEO:** the site serves Panania, Revesby, Padstow, Picnic Point, East Hills and Bankstown through genuinely useful content. There are no separate suburb pages, by design.

## 11. Pre-launch checklist
- [ ] Every `[TO CONFIRM: …]` replaced (search the `/content` folder, or look for yellow highlights)
- [ ] Six articles clinically reviewed, references checked, set to Approved
- [ ] AHPRA number, fees, appointment durations, accessibility and public transport entered
- [ ] Dr Tyler's details confirmed (or profile left off)
- [ ] Written consent for the people in the treatment photo
- [ ] Product details and prices verified
- [ ] Privacy policy and website terms completed and dated
- [ ] Compliance checklist worked through
- [ ] Environment variables set; test both forms end-to-end
- [ ] Cliniko booking link opens correctly from mobile
- [ ] Domain live on HTTPS; `NEXT_PUBLIC_SITE_URL` set
- [ ] Sitemap submitted to Search Console; Business Profile linked
- [ ] `/design-system` kept or removed (it's hidden from search engines already)
