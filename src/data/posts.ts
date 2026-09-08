/**
 * Blog data source.
 *
 * This is a plain TypeScript data file (no CMS, no network fetch) so new
 * articles can be added by appending an object to `blogPosts` below.
 * No new React components/routes are required per post — both
 * `BlogIndex.tsx` and `BlogPost.tsx` render dynamically from this data.
 *
 * `content` is a Markdown string rendered via `react-markdown` (already a
 * project dependency) inside `BlogPost.tsx`, styled with Tailwind's
 * `prose` typography classes.
 */

export interface BlogPost {
  /** URL segment, e.g. "/blog/:slug" */
  slug: string;
  /** Page <title> and H1. Keep under ~60 chars for SEO where possible. */
  title: string;
  /** <meta name="description">. Keep ~150-160 chars. */
  metaDescription: string;
  /** ISO date the article was first published. */
  publishDate: string;
  /** ISO date last modified. Feeds sitemap.xml <lastmod>. */
  lastmod: string;
  author: string;
  readTimeMinutes: number;
  category: string;
  tags: string[];
  /** The treatment this article is most relevant to, used in the Hub CTA copy. */
  relatedTreatment?: string;
  /**
   * 2-3 short, self-contained "atomic facts" for the AI Quick Answer box.
   * Written so an AI Overview / chatbot can lift them verbatim as a citation.
   */
  quickAnswer: string[];
  /** Describes the intended screenshot/graphic for the hero slot (no stock photos). */
  heroImageAlt: string;
  /** Markdown body content. */
  content: string;
}

export const POSTS_PER_PAGE = 10;

export const blogPosts: BlogPost[] = [
  {
    slug: "saving-60-percent-dental-implants-jb-clinics-guide",
    title: "Saving 60% on Dental Implants: The Singaporean's Guide to JB Clinics",
    metaDescription:
      "See real 2026 price comparisons for dental implants in Johor Bahru vs Singapore, how much Singaporeans really save, and how to pick a verified JB clinic.",
    publishDate: "2026-01-15",
    lastmod: "2026-01-15",
    author: "OraChope Editorial Team",
    readTimeMinutes: 7,
    category: "Dental Implants",
    tags: ["dental implants", "Johor Bahru", "cost comparison", "dental tourism"],
    relatedTreatment: "Dental Implants",
    quickAnswer: [
      "A single dental implant in Johor Bahru typically costs SGD 1,200–1,800, versus SGD 3,500–5,500 in Singapore — a saving of roughly 55–65%.",
      "Verified JB clinics generally use the same globally recognized implant systems (e.g. Straumann, Nobel Biocare) as Singapore clinics, with English-speaking, internationally trained dentists.",
      "A full implant treatment (consult → implant placement → crown) usually needs 2–3 trips across 3–6 months due to osseointegration (bone-healing) time.",
    ],
    heroImageAlt:
      "Placeholder: side-by-side price comparison graphic — Singapore vs Johor Bahru dental implant costs",
    content: `
Dental implants are one of the most expensive dental procedures in Singapore — and one of the biggest reasons Singaporeans are crossing the Causeway for dental care. Here's what the actual savings look like, and what to check before you book.

## How much cheaper are dental implants in JB?

| Item | Singapore (avg.) | Johor Bahru (avg.) | Typical Saving |
| --- | --- | --- | --- |
| Single implant (fixture only) | SGD 3,500 – 5,500 | SGD 1,200 – 1,800 | ~55–65% |
| Implant + crown (full restoration) | SGD 5,000 – 8,000 | SGD 2,000 – 3,200 | ~55–65% |
| Bone graft (if required) | SGD 800 – 1,500 | SGD 300 – 600 | ~55–65% |

These are indicative ranges based on published clinic price lists as of early 2026. Always confirm current pricing directly with a clinic before booking, as costs vary by implant brand, bone quality, and case complexity.

## Why is it so much cheaper?

The dentistry itself isn't "lower quality" at reputable clinics — the savings mostly come from lower **operating costs** (rent, staff wages, clinic overheads) in Malaysia compared to Singapore. Verified clinics import the same FDA/CE-approved implant systems used regionally, and many dentists trained or hold qualifications recognized in Singapore.

The savings are real, but only if you choose a clinic carefully.

## What to check before booking a JB implant clinic

1. **Dentist credentials.** Look for registration with the Malaysian Dental Council (MDC) and, ideally, additional implant-specific training certificates.
2. **Implant brand transparency.** A reputable clinic will tell you exactly which implant system they use (e.g. Straumann, Nobel Biocare, Osstem) — this affects both cost and long-term warranty support.
3. **Number of visits required.** Ask for a written treatment timeline. Most implant cases need at least 2 trips: (1) placement, and (2) crown fitting after 3–6 months of healing.
4. **Total cost in writing.** Get an itemized quote covering the implant, abutment, crown, and any x-rays/scans — not just a headline "from" price.
5. **Aftercare plan.** Ask what happens if something goes wrong after you're back in Singapore — does the clinic offer remote consults or coordinate with a local partner?

## Is it actually worth the trip?

For a single implant, most patients save enough to comfortably cover a short JB trip (transport, 1-2 nights' stay, meals) several times over. The savings scale further for multiple implants or full-arch cases, where Singapore pricing can run into tens of thousands of dollars.

The trade-off is convenience: you'll need to plan 2-3 trips around your healing timeline rather than walking to a clinic down the road. For many Singaporeans, that trade-off is well worth 60% in savings.

## Frequently asked questions

### Do I need to stay overnight in JB for a dental implant?

For the implant placement visit, most clinics recommend staying overnight in case of swelling or discomfort, though same-day return is possible for straightforward single-implant cases. For the final crown-fitting visit, a day trip is usually sufficient.

### Will my Singapore dentist "take over" the treatment?

Some Singapore dentists are willing to do periodic check-ups between JB visits, but implant placement and crown fitting should be completed by the same clinic that started the case for continuity of care.

### How do I know a JB clinic is legitimate?

Verify the clinic is registered with the Malaysian Ministry of Health and that dentists are listed with the Malaysian Dental Council. Independent review volume, clear pricing, and a physical clinic address you can look up are all good signs.
`,
  },
];

/** Returns all posts sorted newest-first. */
export function getAllPosts(): BlogPost[] {
  return [...blogPosts].sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
}

/** Returns a single post by slug, or undefined if not found. */
export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
