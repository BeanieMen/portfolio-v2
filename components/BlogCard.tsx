"use client";

import { useRouter } from "next/navigation";
import type { Post } from "@/lib/posts";

type ViewTransitionDocument = Document & {
  startViewTransition: (callback: () => void) => void;
};

function hasViewTransition(doc: Document): doc is ViewTransitionDocument {
  return "startViewTransition" in doc;
}

function slugToTransitionName(slug: string, word: string, idx: number): string {
  const safe = word.toLowerCase().replace(/[^a-z0-9-_]/g, "");
  return `${slug.replace(/[^a-z0-9-_]/g, "-")}__${safe}__${idx}`;
}

export default function BlogCard({ post }: { post: Omit<Post, "content"> }) {
  const router = useRouter();
  const words = post.title.split(" ");

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const target = `/blog/${post.slug}`;
    if (typeof document !== "undefined" && hasViewTransition(document)) {
      document.startViewTransition(() => router.push(target));
    } else {
      router.push(target);
    }
  }

  return (
    <a
      href={`/blog/${post.slug}`}
      onClick={handleClick}
      className="block group"
    >
      <article className="px-4 py-4 rounded-xl border border-gray-700 bg-[#1a1a1a] hover:bg-[#212121] hover:border-gray-500 transition space-y-1.5">
        <h2 className="text-white text-xl font-semibold group-hover:text-purple-300 transition-colors leading-snug">
          {words.map((word, i) => (
            <span
              key={i}
              style={
                {
                  viewTransitionName: slugToTransitionName(post.slug, word, i),
                } as React.CSSProperties
              }
            >
              {word}
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </h2>
        <p className="text-[#a0a0a0] text-xs">
          {new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p className="text-[#a0a0a0] text-sm leading-relaxed">
          {post.description}
        </p>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
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
      </article>
    </a>
  );
}
