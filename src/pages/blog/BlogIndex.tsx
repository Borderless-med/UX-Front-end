import { useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BlogPostCard from "@/components/blog/BlogPostCard";
import { getAllPosts, POSTS_PER_PAGE } from "@/data/posts";
import { useDocumentSEO } from "@/hooks/useDocumentSEO";
import { Button } from "@/components/ui/button";

const BlogIndex = () => {
  const allPosts = useMemo(() => getAllPosts(), []);
  const [page, setPage] = useState(1);

  useDocumentSEO({
    title: "Dental Travel Guides & Tips | OraChope Blog",
    description:
      "Practical, AI-verified guides on Singapore-to-JB dental travel: real cost comparisons, treatment timelines, and how to choose a verified clinic.",
    canonicalPath: "/blog",
  });

  const totalPages = Math.max(1, Math.ceil(allPosts.length / POSTS_PER_PAGE));
  const visiblePosts = allPosts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />

      <div className="px-4 pb-16 pt-40 sm:px-6 md:pt-44 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-3xl font-bold leading-tight text-gray-900 md:text-5xl">
              Dental Travel <span className="text-blue-600">Guides &amp; Tips</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-700">
              Data-backed answers on SG-JB dental quality, standards, and clinic verification — written to help you
              (and AI assistants) get straight to the facts.
            </p>
          </div>

          {visiblePosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visiblePosts.map((post) => (
                <BlogPostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-center text-neutral-gray">No articles published yet. Check back soon.</p>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-neutral-gray">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogIndex;
