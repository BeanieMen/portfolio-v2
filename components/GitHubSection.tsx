"use client";

import { useEffect, useState } from "react";
import { Github, GitCommit } from "lucide-react";

interface Commit {
  sha: string;
  message: string;
  repo: string;
  url: string;
  date: string;
}

interface GitHubEvent {
  type: string;
  repo?: { name: string };
  created_at?: string;
  payload?: {
    commits?: Array<{ sha: string; message: string }>;
  };
}

interface GitHubRepo {
  fork: boolean;
  languages_url: string;
}

interface GitHubLangMap {
  [lang: string]: number;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Shell: "#89e051",
  Dockerfile: "#384d54",
  SCSS: "#c6538c",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Kotlin: "#A97BFF",
  Java: "#b07219",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#ffac45",
  HCL: "#844FBA",
  Nix: "#7e7eff",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function GitHubSection() {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [langStats, setLangStats] = useState<GitHubLangMap>({});
  const [hoveredLang, setHoveredLang] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch recent push events
        const eventsRes = await fetch(
          "https://api.github.com/users/BeanieMen/events?per_page=30",
          { headers: { Accept: "application/vnd.github+json" } }
        );
        const events = await eventsRes.json();
        const pushEvents = (events as GitHubEvent[]).filter(
          (e) => e.type === "PushEvent"
        );
        const recentCommits: Commit[] = [];
        for (const event of pushEvents) {
          if (recentCommits.length >= 6) break;
          for (const commit of event.payload?.commits ?? []) {
            if (recentCommits.length >= 6) break;
            recentCommits.push({
              sha: commit.sha?.slice(0, 7) ?? "",
              message: commit.message?.split("\n")[0] ?? "",
              repo: event.repo?.name ?? "",
              url: `https://github.com/${event.repo?.name}/commit/${commit.sha}`,
              date: event.created_at ?? "",
            });
          }
        }
        setCommits(recentCommits);

        // Fetch repos and aggregate language bytes
        const reposRes = await fetch(
          "https://api.github.com/users/BeanieMen/repos?per_page=100&type=owner",
          { headers: { Accept: "application/vnd.github+json" } }
        );
        const repos = await reposRes.json();
        const aggregated: GitHubLangMap = {};
        await Promise.all(
          (repos as GitHubRepo[]).map(async (repo) => {
            if (repo.fork) return;
            try {
              const langRes = await fetch(repo.languages_url, {
                headers: { Accept: "application/vnd.github+json" },
              });
              const langs = await langRes.json();
              for (const [lang, bytes] of Object.entries(langs)) {
                aggregated[lang] = (aggregated[lang] ?? 0) + (bytes as number);
              }
            } catch {
              // ignore individual failures
            }
          })
        );
        setLangStats(aggregated);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalBytes = Object.values(langStats).reduce((a, b) => a + b, 0);
  const sortedLangs = Object.entries(langStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  return (
    <section className="mb-16 lg:mb-20">
      <div className="flex items-center gap-3 mb-6 lg:mb-8">
        <Github className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
        <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl font-semibold">
          GitHub
        </h2>
        <a
          href="https://github.com/BeanieMen"
          target="_blank"
          rel="noreferrer"
          className="ml-auto text-[#a0a0a0] text-sm hover:text-white transition text-nowrap"
        >
          @BeanieMen →
        </a>
      </div>

      {loading ? (
        <div className="text-[#a0a0a0] text-sm animate-pulse">Loading…</div>
      ) : (
        <>
          {/* Language bar */}
          {sortedLangs.length > 0 && (
            <div className="mb-8">
              <p className="text-[#a0a0a0] text-sm mb-3">Languages</p>
              <div className="flex w-full h-3 rounded-full overflow-hidden gap-px">
                {sortedLangs.map(([lang, bytes]) => {
                  const pct = ((bytes / totalBytes) * 100).toFixed(1);
                  const color = LANG_COLORS[lang] ?? "#888888";
                  return (
                    <div
                      key={lang}
                      role="button"
                      tabIndex={0}
                      aria-label={`${lang}: ${pct}%`}
                      className="relative h-full cursor-pointer transition-opacity duration-150"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: color,
                        opacity: hoveredLang && hoveredLang !== lang ? 0.35 : 1,
                      }}
                      onMouseEnter={() => setHoveredLang(lang)}
                      onMouseLeave={() => setHoveredLang(null)}
                      onFocus={() => setHoveredLang(lang)}
                      onBlur={() => setHoveredLang(null)}
                    />
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                {sortedLangs.map(([lang, bytes]) => {
                  const pct = ((bytes / totalBytes) * 100).toFixed(1);
                  const color = LANG_COLORS[lang] ?? "#888888";
                  return (
                    <span
                      key={lang}
                      tabIndex={0}
                      className="flex items-center gap-1.5 text-xs text-[#a0a0a0] cursor-default transition-colors duration-150"
                      style={{
                        color:
                          hoveredLang === lang ? "#ffffff" : undefined,
                      }}
                      onMouseEnter={() => setHoveredLang(lang)}
                      onMouseLeave={() => setHoveredLang(null)}
                      onFocus={() => setHoveredLang(lang)}
                      onBlur={() => setHoveredLang(null)}
                    >
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      {lang}
                      {hoveredLang === lang && (
                        <span className="text-white font-semibold">{pct}%</span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent commits */}
          {commits.length > 0 && (
            <div>
              <p className="text-[#a0a0a0] text-sm mb-3">Recent commits</p>
              <div className="flex flex-col gap-2">
                {commits.map((commit) => (
                  <a
                    key={`${commit.sha}-${commit.url}`}
                    href={commit.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start gap-3 px-3 py-2.5 rounded-lg bg-[#212121] border border-gray-700 hover:bg-[#2a2a2a] hover:border-gray-500 transition group"
                  >
                    <GitCommit className="w-4 h-4 text-[#a0a0a0] mt-0.5 flex-shrink-0 group-hover:text-white transition" />
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-sm truncate font-mono leading-snug">
                        {commit.message}
                      </p>
                      <p className="text-[#a0a0a0] text-xs mt-0.5">
                        <span className="font-mono text-purple-400">{commit.sha}</span>
                        {" · "}
                        <span>{commit.repo.replace("BeanieMen/", "")}</span>
                        {" · "}
                        <span>{formatDate(commit.date)}</span>
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
