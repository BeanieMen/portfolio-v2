import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Tag } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import TransitionLink from "@/components/blog/TransitionLink";
import TransitionTitleText from "@/components/blog/TransitionTitleText";
import { formatBlogDate, getAllBlogSlugs, getBlogPostBySlug } from "@/lib/blog";

export const dynamic = "force-static";
export const dynamicParams = false;

type PageProps = {
  params: Promise<{ slug: string }>;
};

const tagTextPalette = ["#f9e2af", "#a6e3a1", "#fab387", "#f38ba8", "#89dceb", "#cba6f7"];

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="flex-1 px-0 py-8 md:px-5">
      <div className="mx-auto max-w-4xl px-4">
        <TransitionLink
          href="/blog"
          className="mb-6 inline-flex items-center gap-2 rounded border border-[#313a3c] bg-[#181f21] px-3 py-1.5 text-sm text-[#c5d0cb] transition hover:border-[#89dceb] hover:text-[#89dceb]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to blog
        </TransitionLink>

        <header className="mb-12 space-y-4">
          <h1 className="blog-title">
            <TransitionTitleText
              slug={post.slug}
              title={post.title}
              titleMarkdown={post.titleMarkdown}
            />
          </h1>

          <p className="text-sm text-[#9fa9a5]">{formatBlogDate(post.date)}</p>

          {post.tags.length > 0 && (
            <div className="flex max-h-8 flex-wrap gap-2 overflow-hidden pt-2 text-xs">
              <Tag className="h-4 w-4 text-[#a6aeb1]" />

              {post.tags.map((tag, index) => (
                <span
                  key={`${post.slug}-${tag}`}
                  className="rounded bg-[#2a3234] px-2 py-1 font-semibold"
                  style={{ color: tagTextPalette[index % tagTextPalette.length] }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <article className="blog-prose mx-auto mb-6 max-w-4xl">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {post.markdown}
          </ReactMarkdown>
        </article>
      </div>
    </main>
  );
}
