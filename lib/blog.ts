import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIRECTORY = path.join(process.cwd(), "content", "blog");

type BlogFrontmatter = {
  title?: unknown;
  titleMarkdown?: unknown;
  date?: unknown;
  excerpt?: unknown;
  tags?: unknown;
};

export type BlogPostMeta = {
  slug: string;
  title: string;
  titleMarkdown?: string;
  date: string;
  excerpt: string;
  tags: string[];
};

export type BlogPost = BlogPostMeta & {
  markdown: string;
};

function isMarkdownFile(fileName: string): boolean {
  return fileName.endsWith(".md") || fileName.endsWith(".markdown");
}

function toSlug(fileName: string): string {
  return fileName.replace(/\.(md|markdown)$/i, "");
}

function parseFrontmatter(slug: string, frontmatter: BlogFrontmatter): Omit<BlogPostMeta, "slug"> {
  if (typeof frontmatter.title !== "string" || !frontmatter.title.trim()) {
    throw new Error(`[blog] \"${slug}\" is missing a valid title`);
  }

  if (typeof frontmatter.date !== "string" || !frontmatter.date.trim()) {
    throw new Error(`[blog] \"${slug}\" is missing a valid date`);
  }

  if (typeof frontmatter.excerpt !== "string" || !frontmatter.excerpt.trim()) {
    throw new Error(`[blog] \"${slug}\" is missing a valid excerpt`);
  }

  const tags = Array.isArray(frontmatter.tags)
    ? frontmatter.tags.filter((tag): tag is string => typeof tag === "string" && tag.trim().length > 0)
    : [];

  const titleMarkdown =
    typeof frontmatter.titleMarkdown === "string" && frontmatter.titleMarkdown.trim()
      ? frontmatter.titleMarkdown.trim()
      : undefined;

  return {
    title: frontmatter.title.trim(),
    titleMarkdown,
    date: frontmatter.date.trim(),
    excerpt: frontmatter.excerpt.trim(),
    tags,
  };
}

function parseDateValue(input: string): number {
  const isoLike = /^\d{4}-\d{2}-\d{2}$/.test(input) ? `${input}T00:00:00Z` : input;
  const timestamp = new Date(isoLike).getTime();
  return Number.isNaN(timestamp) ? Number.MIN_SAFE_INTEGER : timestamp;
}

async function readBlogFileNames(): Promise<string[]> {
  try {
    const files = await fs.readdir(BLOG_DIRECTORY);
    return files.filter(isMarkdownFile);
  } catch {
    return [];
  }
}

export async function getAllBlogPostMeta(): Promise<BlogPostMeta[]> {
  const fileNames = await readBlogFileNames();

  const posts = await Promise.all(
    fileNames.map(async (fileName) => {
      const fullPath = path.join(BLOG_DIRECTORY, fileName);
      const raw = await fs.readFile(fullPath, "utf8");
      const slug = toSlug(fileName);
      const parsed = matter(raw);
      const frontmatter = parseFrontmatter(slug, parsed.data as BlogFrontmatter);

      return {
        slug,
        ...frontmatter,
      } satisfies BlogPostMeta;
    })
  );

  return posts.sort((a, b) => parseDateValue(b.date) - parseDateValue(a.date));
}

export async function getLatestBlogPosts(limit = 4): Promise<BlogPostMeta[]> {
  const all = await getAllBlogPostMeta();
  return all.slice(0, limit);
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const all = await getAllBlogPostMeta();
  return all.map((post) => post.slug);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const filePath = path.join(BLOG_DIRECTORY, `${slug}.md`);

  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = matter(raw);
    const frontmatter = parseFrontmatter(slug, parsed.data as BlogFrontmatter);

    return {
      slug,
      ...frontmatter,
      markdown: parsed.content,
    };
  } catch {
    return null;
  }
}

const blogDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

export function formatBlogDate(date: string): string {
  const maybeIsoDate = /^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date}T00:00:00Z` : date;
  const parsed = new Date(maybeIsoDate);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return blogDateFormatter.format(parsed);
}
