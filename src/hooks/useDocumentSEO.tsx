import { useEffect } from "react";

interface DocumentSEOOptions {
  title: string;
  description: string;
  /** Path only, e.g. "/blog/my-post". Combined with the site origin for the canonical tag. */
  canonicalPath?: string;
}

const SITE_ORIGIN = "https://www.orachope.org";

/**
 * Lightweight, dependency-free per-page SEO hook.
 *
 * Updates document.title, <meta name="description">, and an optional
 * canonical <link> tag on mount, and restores the previous values on
 * unmount so navigating away (SPA route change) doesn't leak this page's
 * metadata onto the next page.
 */
export function useDocumentSEO({ title, description, canonicalPath }: DocumentSEOOptions) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    let descriptionTag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = descriptionTag?.getAttribute("content") ?? null;
    let createdDescriptionTag = false;
    if (!descriptionTag) {
      descriptionTag = document.createElement("meta");
      descriptionTag.setAttribute("name", "description");
      document.head.appendChild(descriptionTag);
      createdDescriptionTag = true;
    }
    descriptionTag.setAttribute("content", description);

    let canonicalTag: HTMLLinkElement | null = null;
    let previousCanonical: string | null = null;
    let createdCanonicalTag = false;
    if (canonicalPath) {
      canonicalTag = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      previousCanonical = canonicalTag?.getAttribute("href") ?? null;
      if (!canonicalTag) {
        canonicalTag = document.createElement("link");
        canonicalTag.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalTag);
        createdCanonicalTag = true;
      }
      canonicalTag.setAttribute("href", `${SITE_ORIGIN}${canonicalPath}`);
    }

    return () => {
      document.title = previousTitle;

      if (descriptionTag) {
        if (createdDescriptionTag) {
          descriptionTag.remove();
        } else if (previousDescription !== null) {
          descriptionTag.setAttribute("content", previousDescription);
        }
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
