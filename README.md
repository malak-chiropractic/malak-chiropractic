# Malak Chiropractic — website

Next.js 16 · React · TypeScript · Tailwind CSS · Keystatic CMS

```bash
npm install
cp .env.example .env.local     # fill in values
npm run dev                    # http://localhost:3000  (editor at /keystatic)
npm run build && npm start
```

- Content lives in `/content` and is edited at `/keystatic`.
- Pages are in `src/app/(site)`; components in `src/components`; content loading and the clinical-review gate are in `src/lib/content.ts`.
- Docs: `docs/HANDOVER.md` (deploy, domain, CMS, costs, launch checklist), `docs/COMPLIANCE-CHECKLIST.md`, `docs/EDITORIAL-CALENDAR.md`, `docs/QA-REPORT.md`, `docs/PHASE-1-DISCOVERY.md`.
