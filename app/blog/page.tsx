import { ArrowUpRight, BookOpen } from "lucide-react";
import TransitionLink from "@/components/blog/TransitionLink";
import TransitionTitleText from "@/components/blog/TransitionTitleText";
import { formatBlogDate, getAllBlogPostMeta } from "@/lib/blog";

export const dynamic = "force-static";

export const metadata = {
  title: "Blog",
  description: "Markdown notes about projects, engineering, and learning.",
};

export default async function BlogIndexPage() {
  const posts = await getAllBlogPostMeta();

  return (
    <main className="flex-1 px-0 py-8 md:px-5">
      <div className="mx-auto max-w-4xl px-4">
        <header className="mb-12 space-y-4 text-center">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.08em] text-[#9aa9a1]">
            <BookOpen className="h-4 w-4" />
            Posts
          </p>

          <h1 className="font-mono text-5xl font-black uppercase leading-none text-[#89dceb] sm:text-6xl">
            Writing
          </h1>

          <p className="text-sm text-[#9aa9a1]">Click a post to open the full article.</p>
        </header>

        {posts.length === 0 ? (
          <p className="text-text-muted">No posts yet.</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => {
              return (
                <TransitionLink
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block rounded border border-[#2f3a3d] bg-[#171d1f] p-5 transition hover:border-[#89dceb] hover:bg-[#1b2427]"
                >
                  <article>
                    <h2 className="blog-card-title">
                      <TransitionTitleText
                        slug={post.slug}
                        title={post.title}
                        titleMarkdown={post.titleMarkdown}
                      />
                    </h2>

                    <p className="mt-3 text-sm text-[#a9b7b2]">{post.excerpt}</p>

                    <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                      <span className="text-[#9aa9a1]">{formatBlogDate(post.date)}</span>
                      <span className="inline-flex items-center gap-1 text-[#89dceb] transition group-hover:translate-x-0.5">
                        Read post
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>

                    {post.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span
                            key={`${post.slug}-${tag}`}
                            className="rounded bg-[#2a3234] px-2 py-1 text-xs font-semibold text-[#a8d9cd]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                </TransitionLink>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
