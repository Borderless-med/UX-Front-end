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
    slug: "beyond-the-border-premium-dental-care-jb",
    title: "Beyond the Border: Why Singaporeans are Choosing JB for Premium Dental Care",
    metaDescription:
      "Discover why Johor Bahru has become a trusted choice for Singaporeans: MDC-regulated clinics, minutes from the Causeway, and advanced technology like 3D CBCT scanning.",
    publishDate: "2026-01-15",
    lastmod: "2026-01-15",
    author: "OraChope Editorial Team",
    readTimeMinutes: 7,
    category: "Quality & Standards",
    tags: ["Johor Bahru", "dental quality", "MDC regulations", "dental technology"],
    relatedTreatment: "General & Cosmetic Dentistry",
    quickAnswer: [
      "Dental clinics in Johor Bahru are regulated by the Malaysian Dental Council (MDC), which sets qualification, hygiene, and continuing-education standards for practicing dentists.",
      "Many of JB's most established clinics are located just 1-3km from the Woodlands-Johor Bahru Causeway, making a same-day round trip from Singapore straightforward.",
      "Leading JB clinics are adopting advanced diagnostic technology such as 3D CBCT (Cone Beam CT) scanning, giving dentists a full 3D view of teeth, nerves, and bone before treatment.",
    ],
    heroImageAlt: "Illustration of a modern dental clinic examination room with digital imaging equipment",
    content: `
For many Singaporeans, a trip to Johor Bahru for dental care used to seem like a compromise. That perception is changing - not because JB clinics are simply cheaper, but because they've invested heavily in regulation, accessibility, and technology that rival what patients expect at home.

## Regulated for your safety

Every licensed dental clinic in Malaysia operates under the oversight of the **Malaysian Dental Council (MDC)**, the statutory body responsible for registering dentists and setting standards of practice. Dentists must meet recognized qualification requirements and adhere to a professional code of conduct, similar in spirit to the framework the Singapore Dental Council (SDC) maintains at home.

When researching a clinic, it's reasonable to ask:

- Is the dentist registered with the MDC? Most clinics display registration certificates in-clinic or list them on their website.
- Does the clinic follow standard sterilization protocols for instruments and equipment?
- Are treatment plans and consent discussed clearly before any procedure begins?

A clinic that welcomes these questions is usually one worth trusting.

## Minutes away, not hours

One of the most underrated advantages of JB dental care is simple geography. A number of well-established clinics are located just **1-3km from the Woodlands-Johor Bahru Causeway**, meaning the actual travel time from the checkpoint to the clinic chair can be shorter than crossing Singapore during peak hour traffic.

For patients who need a follow-up visit, a scan review, or a same-week adjustment, this proximity turns "dental tourism" into something closer to visiting a clinic in a neighbouring district - just with an immigration checkpoint in between.

## Technology & expertise

Modern dental care depends heavily on precise diagnostics, and this is an area where many JB clinics have invested significantly:

- **3D CBCT (Cone Beam CT) scanning.** Unlike a standard 2D X-ray, CBCT produces a full three-dimensional image of teeth, roots, nerves, and jawbone. This allows dentists to plan procedures like implants, root canals, and wisdom tooth extractions with far greater precision.
- **Internationally trained clinicians.** It's increasingly common for JB dentists to have trained or completed continuing education in Singapore, Australia, the UK, or the US, alongside their Malaysian qualifications.
- **FDA/CE-approved materials.** Reputable clinics use dental materials and implant systems (crowns, filling composites, implant fixtures) that carry FDA or CE regulatory approval - the same international standards used in Singapore.

None of this is unique to JB, but it reflects a broader shift: patients are no longer choosing between "affordable" and "advanced" - many verified clinics now offer both.

## What this means for you as a patient

Choosing a dental clinic - in Singapore, JB, or anywhere - should start with the same questions: Is the practitioner properly registered? Is the equipment modern and well-maintained? Is the treatment plan explained clearly, with realistic timelines?

JB's regulatory framework, physical proximity to Singapore, and growing technology adoption mean these questions increasingly have reassuring answers. As always, the right choice depends on your specific treatment needs and comfort level - which is exactly why comparing verified clinics side-by-side matters.

## Frequently asked questions

### Are Malaysian dental qualifications recognized internationally?

Dentists practicing in Malaysia must be registered with the Malaysian Dental Council and typically hold degrees recognized under Malaysia's Dental Act. Many also pursue additional certifications or training abroad, particularly in implantology, orthodontics, and cosmetic dentistry.

### How do I verify a clinic's credentials before booking?

Ask the clinic directly for their MDC registration details, check for verifiable reviews, and confirm what equipment (e.g. CBCT, intraoral scanners) they use for diagnosis. A transparent clinic will readily share this information.

### Is a same-day round trip realistic for a routine check-up?

For clinics near the Causeway, many Singaporean patients do complete a consultation or routine check-up and return home the same day, particularly when appointments are scheduled outside peak checkpoint hours.
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
