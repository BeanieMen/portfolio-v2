import type { CSSProperties } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { getTitleTransitionTokens } from "@/lib/blog-transitions";

type TransitionTitleTextProps = {
  slug: string;
  title: string;
  titleMarkdown?: string;
};

function transitionStyle(viewTransitionName: string): CSSProperties {
  return { viewTransitionName } as CSSProperties;
}

function countWords(value: string): number {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  return parts.length;
}

function appendViewTransitionToStyle(styleValue: string, viewTransitionName: string): string {
  const trimmedStyle = styleValue.trim().replace(/;\s*$/, "");
  if (!trimmedStyle) {
    return `view-transition-name: ${viewTransitionName};`;
  }

  return `${trimmedStyle}; view-transition-name: ${viewTransitionName};`;
}

function injectTransitionNamesIntoTitleMarkdown(
  titleMarkdown: string,
  tokens: ReturnType<typeof getTitleTransitionTokens>
): string {
  let tokenIndex = 0;

  return titleMarkdown.replace(/<span\b([^>]*)>([\s\S]*?)<\/span>/gi, (match, attrs, content) => {
    const token = tokens[tokenIndex];
    const wordCount = Math.max(1, countWords(content.replace(/<[^>]+>/g, " ")));
    tokenIndex += wordCount;

    if (!token) {
      return match;
    }

    const attrsText = String(attrs ?? "");
    const styleMatch = attrsText.match(/style\s*=\s*(["'])(.*?)\1/i);
    const nextStyle = appendViewTransitionToStyle(styleMatch?.[2] ?? "", token.viewTransitionName);

    if (styleMatch) {
      const updatedAttrs = attrsText.replace(styleMatch[0], `style=${styleMatch[1]}${nextStyle}${styleMatch[1]}`);
      return `<span${updatedAttrs}>${content}</span>`;
    }

    return `<span${attrsText} style="${nextStyle}">${content}</span>`;
  });
}

export default function TransitionTitleText({ slug, title, titleMarkdown }: TransitionTitleTextProps) {
  const tokens = getTitleTransitionTokens(slug, title);

  if (!titleMarkdown?.trim()) {
    return (
      <>
        {tokens.map((token) => (
          <span key={token.key} style={transitionStyle(token.viewTransitionName)}>
            {token.text}
            {token.trailingSpace ? " " : ""}
          </span>
        ))}
      </>
    );
  }

  const transitionedTitleMarkdown = injectTransitionNamesIntoTitleMarkdown(titleMarkdown, tokens);

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={{ p: ({ children }) => <>{children}</> }}>
      {transitionedTitleMarkdown}
    </ReactMarkdown>
  );
}