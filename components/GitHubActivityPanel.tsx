import { Activity, ExternalLink } from "lucide-react";
import { COMMIT_LIMIT } from "@/lib/github-activity";
import type { GitHubActivityData } from "@/lib/github-activity";

type Props = {
    data: GitHubActivityData;
};

function formatPercentage(value: number): string {
    return `${Math.round(value)}%`;
}

export default function GitHubActivityPanel({ data }: Props) {
    const languageTotal = data.languages.reduce((sum, language) => sum + language.size, 0);

    return (
        <article className="rounded-2xl border border-panel-border bg-panel/25 p-4 shadow-lg backdrop-blur-sm sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-2 text-sm">
                <h3 className="flex items-center gap-2 font-semibold text-foreground">
                    <Activity className="h-4 w-4" />
                    <span>Recent commits</span>
                </h3>
                <a
                    href={data.profileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-text-muted transition hover:text-foreground"
                >
                    See on GitHub
                    <ExternalLink className="h-3.5 w-3.5" />
                </a>
            </div>


            {
                <>
                    <ul className="space-y-2 text-sm">
                        {data.commits.map((commit) => (
                            <li key={`${commit.repoFullName}-${commit.sha}`}>
                                <a
                                    href={commit.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex min-w-0 items-center gap-2 text-text-muted transition hover:text-foreground"
                                    title={`${commit.repo}: ${commit.message}`}
                                >
                                    <span className="shrink-0 font-medium text-foreground/90">{commit.repo}:</span>
                                    <span className="min-w-0 flex-1 truncate">{commit.message}</span>
                                    <span className="shrink-0 text-xs whitespace-nowrap">
                                        <span className="text-[#95d5b2]">+{commit.additions}</span>
                                        <span className="mx-1 text-text-muted">/</span>
                                        <span className="text-[#e5989b]">-{commit.deletions}</span>
                                    </span>
                                </a>
                            </li>
                        )).slice(0, COMMIT_LIMIT)}
                    </ul>

                    {languageTotal > 0 && data.languages.length > 0 && (
                        <div className="mt-4" aria-label="Language breakdown">
                            <div className="h-3 w-full rounded bg-chip-bg/80">
                                <div className="flex h-full w-full">
                                    {data.languages.map((language) => {
                                        const percentage = (language.size / languageTotal) * 100;
                                        const width = `clamp(8px, ${percentage}%, ${percentage}%)`;

                                        return (
                                            <div
                                                key={language.name}
                                                className="group relative h-full cursor-help first:rounded-l last:rounded-r"
                                                style={{
                                                    width,
                                                    backgroundColor: language.color,
                                                }}
                                            >
                                                <div className="pointer-events-none absolute -top-8 left-1/2 z-20 -translate-x-1/2 rounded border border-panel-border bg-panel px-2 py-0.5 text-xs whitespace-nowrap text-foreground opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                                                    <span className="inline-flex items-center gap-2">
                                                        <span className="inline-block h-2 w-2 rounded" style={{ backgroundColor: language.color }} />
                                                        <span>{language.name}</span>
                                                        <span className="text-text-muted">-</span>
                                                        <span>{formatPercentage(percentage)}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                        </div>
                    )}
                </>
            }
        </article>
    );
}
