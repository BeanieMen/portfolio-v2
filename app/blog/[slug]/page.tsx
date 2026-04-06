import { getAllPosts, getPostBySlug } from "@/lib/posts";
import Background from "@/components/Background";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Aarjav Jain`,
    description: post.description,
  };
}

function slugToTransitionName(slug: string, word: string, idx: number): string {
  const safe = word.toLowerCase().replace(/[^a-z0-9-_]/g, "");
  return `${slug.replace(/[^a-z0-9-_]/g, "-")}__${safe}__${idx}`;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const words = post.title.split(" ");

  return (
    <div className="relative w-screen min-h-screen overflow-x-hidden bg-[#161616] font-manrope">
      <Background />
      <div className="relative z-10 max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[#a0a0a0] hover:text-white transition text-sm mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          All posts
        </Link>

        <header className="mb-10">
          <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-3">
            {words.map((word, i) => (
              <span
                key={i}
                style={
                  {
                    viewTransitionName: slugToTransitionName(slug, word, i),
                  } as React.CSSProperties
                }
              >
                {word}
                {i < words.length - 1 ? " " : ""}
              </span>
            ))}
          </h1>
          <p className="text-[#a0a0a0] text-sm">
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full bg-[#2a2a2a] text-[#a0a0a0] border border-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="blog-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
