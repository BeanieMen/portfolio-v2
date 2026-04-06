import { getAllPosts } from "@/lib/posts";
import Background from "@/components/Background";
import BlogCard from "@/components/BlogCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Blog — Aarjav Jain",
  description: "Writing about infrastructure, software, and music.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="relative w-screen min-h-screen overflow-x-hidden bg-[#161616] font-manrope">
      <Background />
      <div className="relative z-10 max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#a0a0a0] hover:text-white transition text-sm mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back home
        </Link>

        <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-10">
          Blog
        </h1>

        {posts.length === 0 ? (
          <p className="text-[#a0a0a0]">No posts yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <BlogCard
                key={post.slug}
                post={{
                  slug: post.slug,
                  title: post.title,
                  date: post.date,
                  description: post.description,
                  tags: post.tags,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
