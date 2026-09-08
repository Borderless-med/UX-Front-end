import { useEffect } from "react";

interface DocumentSEOOptions {
  title: string;
  description: string;
  /** Path only, e.g. "/blog/my-post". Combined with the site origin for the canonical tag and og:url. */
  canonicalPath?: string;
}

const SITE_ORIGIN = "https://www.orachope.org";

function syncMetaTag(selector: string, createTag: () => HTMLElement, attr: string, value: string) {
  let tag = document.querySelector<HTMLElement>(selector);
  const previousValue = tag?.getAttribute(attr) ?? null;
  let created = false;
  if (!tag) {
    tag = createTag();
    document.head.appendChild(tag);
    created = true;
  }
  tag.setAttribute(attr, value);
  return { tag, previousValue, created };
}

/**
 * Lightweight, dependency-free per-page SEO hook.
 *
 * Updates document.title, <meta name="description">, the Open Graph
 * title/description/url tags, and an optional canonical <link> tag on
 * mount, restoring the previous values on unmount so navigating away (SPA
 * route change) doesn't leak this page's metadata onto the next page.
 *
 * Note: Because this is a client-rendered SPA, crawlers that don't execute
 * JavaScript (e.g. Facebook's link scraper) will still see the static tags
 * in index.html on first fetch. This hook keeps things correct for the
 * live browser session and for crawlers that do render JS; true per-post
 * Open Graph previews would require server-side rendering or an edge
 * function that serves per-route meta tags to bots.
 */
export function useDocumentSEO({ title, description, canonicalPath }: DocumentSEOOptions) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    const descriptionMeta = syncMetaTag(
      'meta[name="description"]',
      () => {
        const meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        return meta;
      },
      "content",
      description
    );

    const ogTitleMeta = syncMetaTag(
      'meta[property="og:title"]',
      () => {
        const meta = document.createElement("meta");
        meta.setAttribute("property", "og:title");
        return meta;
      },
      "content",
      title
    );

    const ogDescriptionMeta = syncMetaTag(
      'meta[property="og:description"]',
      () => {
        const meta = document.createElement("meta");
        meta.setAttribute("property", "og:description");
        return meta;
      },
      "content",
      description
    );

    let canonicalTag: HTMLLinkElement | null = null;
    let previousCanonical: string | null = null;
    let createdCanonicalTag = false;
    let ogUrlResult: ReturnType<typeof syncMetaTag> | null = null;

    if (canonicalPath) {
      const fullUrl = `${SITE_ORIGIN}${canonicalPath}`;

      canonicalTag = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      previousCanonical = canonicalTag?.getAttribute("href") ?? null;
      if (!canonicalTag) {
        canonicalTag = document.createElement("link");
        canonicalTag.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalTag);
        createdCanonicalTag = true;
      }
      canonicalTag.setAttribute("href", fullUrl);

      ogUrlResult = syncMetaTag(
        'meta[property="og:url"]',
        () => {
          const meta = document.createElement("meta");
          meta.setAttribute("property", "og:url");
          return meta;
        },
        "content",
        fullUrl
      );
    }

    return () => {
      document.title = previousTitle;

      const restore = (result: ReturnType<typeof syncMetaTag>, attr: string) => {
        if (result.created) {
          result.tag.remove();
        } else if (result.previousValue !== null) {
          result.tag.setAttribute(attr, result.previousValue);
        }
      };

      restore(descriptionMeta, "content");
      restore(ogTitleMeta, "content");
      restore(ogDescriptionMeta, "content");

      if (ogUrlResult) {
        restore(ogUrlResult, "content");
      }

      if (canonicalTag) {
        if (createdCanonicalTag) {
          canonicalTag.remove();
        } else if (previousCanonical !== null) {
          canonicalTag.setAttribute("href", previousCanonical);
        }
      }
    };
  }, [title, description, canonicalPath]);
}
