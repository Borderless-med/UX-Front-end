import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
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
      className="group flex flex-col rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
    >
      {/* Placeholder graphic slot — swap for a real screenshot, no stock photos */}
      <div className="mb-4 flex h-36 items-center justify-center rounded-lg bg-blue-150/50 text-blue-primary">
        <span className="text-xs font-semibold uppercase tracking-wide">{post.category}</span>
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
