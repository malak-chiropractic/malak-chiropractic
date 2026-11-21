import { collection, config, fields, singleton } from "@keystatic/core";

/**
 * Content management for Malak Chiropractic.
 * Edit at /keystatic. Every field here maps to a file in /content that the site reads.
 *
 * Local development: edits save straight to the files on disk.
 * Live site: edits are saved to the GitHub repository, which triggers a redeploy (about a minute).
 */

const repo = process.env.NEXT_PUBLIC_KEYSTATIC_REPO as `${string}/${string}` | undefined;

const multiline = (label: string, description?: string) => fields.text({ label, multiline: true, description });
const listHint = "Separate paragraphs with a blank line. Start a line with “- ” to make a bullet point. Use [TO CONFIRM: …] for anything not yet confirmed.";

export default config({
  storage: repo && process.env.NODE_ENV !== "development" ? { kind: "github", repo } : { kind: "local" },
  ui: {
    brand: { name: "Malak Chiropractic" },
    navigation: {
      "Patient education": ["articles", "anatomy"],
      "Clinic": ["clinic", "pricing", "home", "faqs"],
      "Care": ["services", "conditions", "practitioners"],
      "Professionals": ["gp"],
      "Shop": ["products"],
    },
  },

  collections: {
    articles: collection({
      label: "Articles",
      slugField: "title",
      path: "content/articles/*",
      format: { contentField: "body" },
      entryLayout: "content",
      columns: ["title", "status", "publishDate"],
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        summary: fields.text({ label: "Short description", multiline: true, validation: { length: { min: 20, max: 240 } } }),
        category: fields.select({
          label: "Category",
          defaultValue: "understanding-pain",
          options: [
            { label: "Understanding Pain", value: "understanding-pain" },
            { label: "Spinal Health", value: "spinal-health" },
            { label: "Movement and Rehabilitation", value: "movement-rehabilitation" },
            { label: "Common Musculoskeletal Conditions", value: "common-conditions" },
            { label: "Workplace and Posture", value: "workplace-posture" },
            { label: "Pregnancy and Musculoskeletal Health", value: "pregnancy" },
            { label: "Children's Musculoskeletal Health", value: "children" },
            { label: "Frequently Asked Questions", value: "faq" },
            { label: "Chiropractic Care Explained", value: "chiropractic-care-explained" },
          ],
        }),
        audiences: fields.multiselect({
          label: "Written for",
          description: "Who is this article mainly for? Readers can filter the library by audience.",
          options: [
            { label: "Desk and office workers", value: "desk-workers" },
            { label: "Tradies and manual workers", value: "manual-workers" },
            { label: "Injured workers (workers comp)", value: "injured-workers" },
            { label: "Pregnancy and postnatal", value: "pregnancy" },
            { label: "Parents and children", value: "parents" },
            { label: "Active people and runners", value: "active" },
            { label: "Older adults", value: "older-adults" },
            { label: "People living with persistent pain", value: "persistent-pain" },
            { label: "Everyone", value: "everyone" },
          ],
        }),
        author: fields.text({ label: "Author", defaultValue: "Dr Jasmine Malak" }),
        status: fields.select({
          label: "Status",
          description: "Only “Approved” articles with a reviewer and review date appear on the website, from their publish date.",
          defaultValue: "draft",
          options: [
            { label: "Draft", value: "draft" },
            { label: "In clinical review", value: "in-review" },
            { label: "Approved — ready to publish", value: "approved" },
          ],
        }),
        publishDate: fields.date({ label: "Publish date", description: "Set a future date to schedule. The site rebuilds daily, so it will appear that morning." }),
        reviewer: fields.text({ label: "Clinically reviewed by", description: "Name and title of the chiropractor who reviewed this article." }),
        reviewedDate: fields.date({ label: "Last clinically reviewed" }),
        featuredImage: fields.image({ label: "Featured image", directory: "public/images/articles", publicPath: "/images/articles/" }),
        featuredImageAlt: fields.text({ label: "Featured image description (alt text)" }),
        seoTitle: fields.text({ label: "SEO title", description: "About 50–60 characters." }),
        seoDescription: fields.text({ label: "SEO description", multiline: true, description: "About 140–160 characters." }),
        relatedArticles: fields.array(fields.relationship({ label: "Article", collection: "articles" }), { label: "Related articles", itemLabel: (p) => p.value ?? "Article" }),
        references: fields.array(fields.text({ label: "Reference", multiline: true }), { label: "References", itemLabel: (p) => p.value.slice(0, 80) || "Reference" }),
        body: fields.markdoc({ label: "Article", extension: "mdoc" }),
      },
    }),

    services: collection({
      label: "Services",
      slugField: "title",
      path: "content/services/*",
      format: "yaml",
      columns: ["title", "order"],
      schema: {
        title: fields.slug({ name: { label: "Service name" } }),
        order: fields.integer({ label: "Display order", defaultValue: 10 }),
        icon: fields.select({
          label: "Icon",
          defaultValue: "consult",
          options: ["consult", "needle", "hands", "movement", "table", "neuro"].map((v) => ({ label: v, value: v })),
        }),
        summary: fields.text({ label: "Card summary", multiline: true }),
        seoTitle: fields.text({ label: "SEO title" }),
        seoDescription: fields.text({ label: "SEO description", multiline: true }),
        involves: multiline("What it involves", listHint),
        considered: multiline("Why it may be considered", listHint),
        expect: multiline("What patients can expect", listHint),
        suitability: multiline("How suitability is determined", listHint),
        precautions: multiline("Precautions and limitations", listHint),
        faqs: fields.array(fields.object({ q: fields.text({ label: "Question" }), a: fields.text({ label: "Answer", multiline: true }) }), { label: "Common questions", itemLabel: (p) => p.fields.q.value }),
        relatedArticles: fields.array(fields.relationship({ label: "Article", collection: "articles" }), { label: "Related articles", itemLabel: (p) => p.value ?? "" }),
        relatedConditions: fields.array(fields.relationship({ label: "Condition", collection: "conditions" }), { label: "Related conditions", itemLabel: (p) => p.value ?? "" }),
      },
    }),

    conditions: collection({
      label: "Conditions and concerns",
      slugField: "title",
      path: "content/conditions/*",
      format: "yaml",
      columns: ["title", "region"],
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        region: fields.select({
          label: "Region",
          defaultValue: "lumbar",
          options: [
            { label: "Neck", value: "cervical" },
            { label: "Mid-back", value: "thoracic" },
            { label: "Lower back", value: "lumbar" },
            { label: "Pelvis and hip", value: "pelvis" },
            { label: "Limbs", value: "peripheral" },
          ],
        }),
        order: fields.integer({ label: "Display order", defaultValue: 10 }),
        summary: fields.text({ label: "Summary", multiline: true }),
        overview: multiline("Overview", listHint),
        symptoms: multiline("What people commonly describe", listHint),
        contributors: multiline("Common contributing factors", listHint),
        care: multiline("How assessment and care may help", listHint),
        redFlags: multiline("When to see a doctor promptly", listHint),
        seoTitle: fields.text({ label: "SEO title" }),
        seoDescription: fields.text({ label: "SEO description", multiline: true }),
        relatedArticles: fields.array(fields.relationship({ label: "Article", collection: "articles" }), { label: "Related articles", itemLabel: (p) => p.value ?? "" }),
        relatedServices: fields.array(fields.relationship({ label: "Service", collection: "services" }), { label: "Related services", itemLabel: (p) => p.value ?? "" }),
      },
    }),

    practitioners: collection({
      label: "Practitioners",
      slugField: "name",
      path: "content/practitioners/*",
      format: "yaml",
      schema: {
        name: fields.slug({ name: { label: "Name" } }),
        role: fields.text({ label: "Role" }),
        type: fields.select({ label: "Type", defaultValue: "principal", options: [{ label: "Principal", value: "principal" }, { label: "Locum", value: "locum" }] }),
        order: fields.integer({ label: "Order", defaultValue: 1 }),
        published: fields.checkbox({ label: "Show full profile on the website", defaultValue: false }),
        qualifications: fields.array(fields.text({ label: "Qualification" }), { label: "Qualifications", itemLabel: (p) => p.value }),
        registration: fields.text({ label: "Registration" }),
        certifications: fields.array(fields.text({ label: "Certification" }), { label: "Certifications", itemLabel: (p) => p.value }),
        interests: fields.array(fields.text({ label: "Interest" }), { label: "Clinical interests", itemLabel: (p) => p.value }),
        techniques: fields.array(fields.text({ label: "Technique" }), { label: "Techniques", itemLabel: (p) => p.value }),
        short: fields.text({ label: "Short introduction", multiline: true }),
        bio: multiline("Full biography", listHint),
        philosophy: fields.text({ label: "Philosophy (quote)", multiline: true }),
        photo: fields.text({ label: "Photo path", description: "e.g. /photos/treatment-765.webp" }),
        photoAlt: fields.text({ label: "Photo description" }),
      },
    }),

    products: collection({
      label: "Products",
      slugField: "name",
      path: "content/products/*",
      format: "yaml",
      schema: {
        name: fields.slug({ name: { label: "Product name" } }),
        order: fields.integer({ label: "Order", defaultValue: 1 }),
        published: fields.checkbox({ label: "Show on website", defaultValue: true }),
        kicker: fields.text({ label: "Small label", description: "e.g. Hydration" }),
        description: fields.text({ label: "Description", multiline: true, description: "Describe the product accurately. Avoid health claims." }),
        details: fields.array(fields.text({ label: "Detail" }), { label: "Details (ingredients, flavours, allergens)", itemLabel: (p) => p.value }),
        price: fields.text({ label: "Price" }),
        availability: fields.text({ label: "Availability" }),
        howToBuy: fields.text({ label: "How to buy" }),
        accent: fields.select({ label: "Background colour", defaultValue: "sky", options: [{ label: "Baby blue", value: "sky" }, { label: "Butter yellow", value: "butter" }, { label: "Burgundy tint", value: "burgundy" }, { label: "Steel", value: "steel" }] }),
        image: fields.image({ label: "Product photo", directory: "public/images/products", publicPath: "/images/products/" }),
        imageAlt: fields.text({ label: "Photo description" }),
      },
    }),
  },

  singletons: {
    clinic: singleton({
      label: "Clinic details and hours",
      path: "content/settings/clinic",
      format: "yaml",
      schema: {
        name: fields.text({ label: "Clinic name" }),
        tagline: fields.text({ label: "Tagline" }),
        streetAddress: fields.text({ label: "Street address" }),
        suburb: fields.text({ label: "Suburb" }),
        state: fields.text({ label: "State" }),
        postcode: fields.text({ label: "Postcode" }),
        locationNote: fields.text({ label: "Location note" }),
        phone: fields.text({ label: "Main phone (shown on site)" }),
        mobile: fields.text({ label: "Mobile" }),
        email: fields.text({ label: "Email" }),
        bookingUrl: fields.url({ label: "Online booking link (Cliniko)" }),
        hours: fields.array(
          fields.object({ day: fields.text({ label: "Day" }), open: fields.checkbox({ label: "Open" }), note: fields.text({ label: "Hours, e.g. 9:00 AM – 5:00 PM" }) }),
          { label: "Opening hours", itemLabel: (p) => `${p.fields.day.value}${p.fields.open.value ? ` · ${p.fields.note.value}` : " · closed"}` }
        ),
        hoursNote: fields.text({ label: "Hours note" }),
        parking: fields.text({ label: "Parking", multiline: true }),
        accessibility: fields.text({ label: "Accessibility", multiline: true }),
        publicTransport: fields.text({ label: "Public transport", multiline: true }),
        emergencyNotice: fields.text({ label: "Emergency notice", multiline: true }),
        instagram: fields.text({ label: "Instagram URL" }),
        linkedin: fields.text({ label: "LinkedIn URL" }),
      },
    }),
    pricing: singleton({
      label: "Fees and payments",
      path: "content/settings/pricing",
      format: "yaml",
      schema: {
        intro: fields.text({ label: "Introduction", multiline: true }),
        items: fields.array(
          fields.object({ name: fields.text({ label: "Name" }), duration: fields.text({ label: "Duration" }), price: fields.text({ label: "Price" }), description: fields.text({ label: "Description", multiline: true }) }),
          { label: "Fees", itemLabel: (p) => `${p.fields.name.value} — ${p.fields.price.value}` }
        ),
        payments: fields.text({ label: "Payment methods", multiline: true }),
        rebates: fields.text({ label: "Private health rebates", multiline: true }),
        medicare: fields.text({ label: "Medicare", multiline: true }),
        dvaWorkersComp: fields.text({ label: "DVA and workers compensation", multiline: true }),
        cancellation: fields.text({ label: "Cancellation policy", multiline: true }),
      },
    }),
    home: singleton({
      label: "Homepage",
      path: "content/settings/home",
      format: "yaml",
      schema: {
        heroEyebrow: fields.text({ label: "Small label above headline" }),
        heroHeadline: fields.text({ label: "Headline" }),
        heroText: fields.text({ label: "Supporting text", multiline: true }),
        introHeading: fields.text({ label: "Introduction heading" }),
        introText: fields.text({ label: "Introduction text", multiline: true }),
        principles: fields.array(fields.object({ title: fields.text({ label: "Title" }), text: fields.text({ label: "Text", multiline: true }) }), { label: "Our approach — principles", itemLabel: (p) => p.fields.title.value }),
      },
    }),
    faqs: singleton({
      label: "FAQ library",
      path: "content/settings/faqs",
      format: "yaml",
      schema: {
        categories: fields.array(fields.object({ key: fields.text({ label: "Key (no spaces)" }), label: fields.text({ label: "Label" }) }), { label: "Categories", itemLabel: (p) => p.fields.label.value }),
        items: fields.array(
          fields.object({ category: fields.text({ label: "Category key", description: "Must match a category key above, e.g. pricing" }), question: fields.text({ label: "Question" }), answer: fields.text({ label: "Answer", multiline: true }) }),
          { label: "Questions", itemLabel: (p) => `${p.fields.category.value} · ${p.fields.question.value}` }
        ),
      },
    }),
    gp: singleton({
      label: "For GPs page",
      path: "content/settings/gp",
      format: "yaml",
      schema: {
        intro: fields.text({ label: "Introduction", multiline: true }),
        offer: multiline("What we offer", listHint),
        scope: fields.array(fields.text({ label: "Presentation" }), { label: "Presentations within scope", itemLabel: (p) => p.value }),
        scopeNote: fields.text({ label: "Scope note", multiline: true }),
        referrals: multiline("Referral pathways", listHint),
        medicare: multiline("Medicare and private health", listHint),
        assessment: multiline("Clinical assessment", listHint),
        communication: multiline("Communication with referrers", listHint),
        referBack: fields.array(fields.text({ label: "Reason" }), { label: "When we refer back", itemLabel: (p) => p.value }),
        secureReferral: fields.text({ label: "Secure referral pathway", multiline: true }),
        faqs: fields.array(fields.object({ q: fields.text({ label: "Question" }), a: fields.text({ label: "Answer", multiline: true }) }), { label: "GP FAQ", itemLabel: (p) => p.fields.q.value }),
      },
    }),
    anatomy: singleton({
      label: "Interactive spine content",
      path: "content/settings/anatomy",
      format: "yaml",
      schema: {
        intro: fields.text({ label: "Introduction", multiline: true }),
        regions: fields.array(
          fields.object({
            key: fields.select({ label: "Region", defaultValue: "lumbar", options: ["cervical", "thoracic", "lumbar", "pelvis"].map((v) => ({ label: v, value: v })) }),
            label: fields.text({ label: "Label" }),
            range: fields.text({ label: "Range, e.g. L1–L5" }),
            count: fields.text({ label: "Count, e.g. 5 vertebrae" }),
            summary: fields.text({ label: "Summary", multiline: true }),
            structures: fields.array(fields.text({ label: "Structure" }), { label: "Key structures", itemLabel: (p) => p.value }),
            function: fields.text({ label: "What it does", multiline: true }),
            symptoms: fields.array(fields.text({ label: "Concern" }), { label: "Commonly reported concerns", itemLabel: (p) => p.value }),
            seekCare: fields.text({ label: "When to seek assessment", multiline: true }),
            articles: fields.array(fields.relationship({ label: "Article", collection: "articles" }), { label: "Related articles", itemLabel: (p) => p.value ?? "" }),
            conditions: fields.array(fields.relationship({ label: "Condition", collection: "conditions" }), { label: "Related conditions", itemLabel: (p) => p.value ?? "" }),
          }),
          { label: "Regions", itemLabel: (p) => p.fields.label.value }
        ),
      },
    }),
  },
});
