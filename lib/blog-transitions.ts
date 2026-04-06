export type TitleTransitionToken = {
  key: string;
  text: string;
  trailingSpace: boolean;
  viewTransitionName: string;
};

function normalizeToken(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9_-]/g, "");
}

function safeSlugPart(slug: string): string {
  const value = slug.split("/").pop() ?? slug;
  const normalized = normalizeToken(value);
  return normalized || "post";
}

export function getTitleTransitionTokens(slug: string, title: string): TitleTransitionToken[] {
  const words = title.trim().split(/\s+/).filter(Boolean);
  const occurrences = new Map<string, number>();
  const safeSlug = safeSlugPart(slug);

  return words.map((word, index) => {
    const normalized = normalizeToken(word) || `word-${index}`;
    const count = occurrences.get(normalized) ?? 0;
    occurrences.set(normalized, count + 1);

    const duplicateSuffix = count > 0 ? `___${count}` : "";

    return {
      key: `${normalized}-${index}`,
      text: word,
      trailingSpace: index < words.length - 1,
      viewTransitionName: `_${safeSlug}__${normalized}${duplicateSuffix}`,
    };
  });
}
