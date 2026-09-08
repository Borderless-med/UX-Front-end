import { Link } from "react-router-dom";
import { ArrowRight, FileText } from "lucide-react";
import type { BlogPost } from "@/data/posts";

interface BlogPostCardProps {
  post: BlogPost;
}

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString("en-SG", { year: "numeric", month: "long", day: "numeric" });

const BlogPostCard = ({ post }: BlogPostCardProps) => {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="card-hover group flex flex-col rounded-xl border-2 border-blue-100 bg-white p-6 shadow-sm hover:border-blue-300"
    >
      {/* CSS-based icon graphic slot — swap for a real screenshot when available, no stock photos */}
      <div className="mb-4 flex h-32 flex-col items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
          <FileText className="h-6 w-6 text-white" aria-hidden="true" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wide text-blue-700">{post.category}</span>
      </div>

      <h2 className="mb-2 text-xl font-bold leading-snug text-gray-900 group-hover:text-blue-primary">
        {post.title}
      </h2>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-neutral-gray">{post.metaDescription}</p>

      <div className="flex items-center justify-between text-xs text-neutral-gray">
        <span>
          {formatDate(post.publishDate)} · {post.readTimeMinutes} min read
        </span>
        <span className="inline-flex items-center gap-1 font-semibold text-blue-primary">
          Read article <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
};

export default BlogPostCard;
