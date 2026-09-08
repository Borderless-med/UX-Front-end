import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Stethoscope } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";
import AIQuickAnswerBox from "@/components/blog/AIQuickAnswerBox";
import StickyHubCTA from "@/components/blog/StickyHubCTA";
import ShareOnFacebook from "@/components/blog/ShareOnFacebook";
import { getPostBySlug } from "@/data/posts";
import { useDocumentSEO } from "@/hooks/useDocumentSEO";

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString("en-SG", { year: "numeric", month: "long", day: "numeric" });

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  // Hooks must run unconditionally; fall back to safe placeholder values when the post is missing.
  useDocumentSEO({
    title: post ? `${post.title} | OraChope Blog` : "Article Not Found | OraChope Blog",
    description: post ? post.metaDescription : "This article could not be found.",
    canonicalPath: post ? `/blog/${post.slug}` : undefined,
  });

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="px-4 pb-16 pt-44 text-center sm:px-6 lg:px-8">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">Article not found</h1>
          <p className="mb-6 text-neutral-gray">This article may have been moved or no longer exists.</p>
          <Link to="/blog" className="font-semibold text-blue-primary hover:underline">
            Back to all articles
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />

      <div className="px-4 pb-24 pt-40 sm:px-6 md:pt-44 lg:px-8 lg:pb-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1fr_280px]">
          {/* Article column */}
          <article className="min-w-0">
            <Link
              to="/blog"
              className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-gray hover:text-blue-primary"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to all articles
            </Link>

            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-primary">
              {post.category}
            </p>
            <h1 className="mb-4 text-3xl font-bold leading-tight text-gray-900 md:text-4xl">{post.title}</h1>
            <p className="mb-6 text-sm text-neutral-gray">
              {formatDate(post.publishDate)} · {post.readTimeMinutes} min read · By {post.author}
            </p>

            {/* CSS-based icon graphic slot — swap for a real website screenshot, no stock photos */}
            <div
              className="mb-6 flex h-48 items-center justify-center rounded-xl border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100 md:h-64"
              role="img"
              aria-label={post.heroImageAlt}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 shadow-md md:h-20 md:w-20">
                <Stethoscope className="h-8 w-8 text-white md:h-10 md:w-10" aria-hidden="true" />
              </div>
            </div>

            <AIQuickAnswerBox facts={post.quickAnswer} />

            <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-relaxed prose-p:text-gray-700 prose-li:text-gray-700 prose-a:text-blue-primary prose-strong:text-gray-900 prose-table:text-sm">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-6">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-neutral-gray"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <ShareOnFacebook title={post.title} />
            </div>

            <MedicalDisclaimer variant="compact" className="mt-8" />
          </article>

          {/* Sidebar / mobile bottom bar */}
          <aside>
            <StickyHubCTA treatment={post.relatedTreatment} />
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogPost;
