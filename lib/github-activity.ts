import "server-only";

import { unstable_cache } from "next/cache";

export type GitHubCommitItem = {
  repo: string;
  repoFullName: string;
  message: string;
  href: string;
  sha: string;
  date: string;
  additions: number;
  deletions: number;
};

export type GitHubLanguage = {
  name: string;
  size: number;
  color: string;
};

export type GitHubStreak = {
  current: number;
  highest: number;
  active: boolean;
};

export type GitHubActivityData = {
  username: string;
  profileUrl: string;
  commits: GitHubCommitItem[];
  languages: GitHubLanguage[];
  totalCommits: number;
  totalAdditions: number;
  totalDeletions: number;
  streak: GitHubStreak | null;
};

type GithubStatCommit = {
  sha: string;
  repository: string;
  message: string;
  author: string | undefined;
  date: string | undefined;
  url: string;
  additions: number;
  deletions: number;
  totalChanges: number;
  files?: Array<{
    filename: string;
    status: string;
    additions: number;
    deletions: number;
    changes: number;
  }>;
};

type GithubStatCommitsResponse = {
  username: string;
  commits: GithubStatCommit[];
};

type GithubStatLanguage = {
  language: string;
  bytes: number;
  percentage: number;
};

type GithubStatLangsResponse = {
  username: string;
  languages: GithubStatLanguage[];
};

const GITHUB_STAT_API_BASE = process.env.GITHUB_STAT_API_BASE ?? "http://beanoni.xyz:3001";
const CACHE_TTL_SECONDS = 60 * 30;
export const COMMIT_LIMIT = 3;
const DEFAULT_LANGUAGE_COLOR = "#8b949e";

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  CSS: "#663399",
  HTML: "#e34c26",
  Shell: "#89e051",
  Dockerfile: "#384d54",
  "C++": "#f34b7d",
  C: "#555555",
  Java: "#b07219",
  Swift: "#ffac45",
  Kotlin: "#F18E33",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Vue: "#42b883",
  Svelte: "#ff3e00",
  MDX: "#fcb32c",
  Markdown: "#083fa1",
  JSON: "#292929",
  YAML: "#cb171e",
  TOML: "#9c4221",
  SQL: "#e38c00",
  GraphQL: "#e10098",
  "C#": "#239120",
  Dart: "#00B4AB",
  Lua: "#000080",
  Zig: "#ec915c",
  R: "#198ce7",
  Haskell: "#5e5086",
  Elixir: "#6e4a7e",
  Clojure: "#db5855",
  Erlang: "#B83998",
  FSharp: "#b845fc",
  Scala: "#c22d40",
  Raku: "#0000fb",
  OCaml: "#3be133",
  Nim: "#ffc200",
  Crystal: "#000100",
  Julia: "#a270ba",
  Perl: "#0298c3",
  Groovy: "#e69f56",
  Vim: "#199f4b",
  Assembly: "#6e4c13",
  Pascal: "#E3F171",
  Fortran: "#4d41b1",
  Racket: "#3c5caa",
  Scheme: "#1e4aec",
  "Common Lisp": "#3fb68b",
  Emacs: "#d02f53",
  Vala: "#a56de2",
  ObjectiveC: "#438eff",
  ObjectiveCpp: "#6866fb",
  PowerShell: "#012456",
  Batchfile: "#C1F12E",
  Awk: "#c30e9b",
  Makefile: "#427819",
  CMake: "#da3434",
  Bazel: "#4e7819",
  Meson: "#007800",
  Gradle: "#02303a",
  Maven: "#C71A36",
  SBT: "#1e87d1",
  Cargo: "#fe6417",
  Nix: "#7ebae4",
  Dhall: "#dfafff",
  D: "#ba595e",
  "Gleam": "#ffaff3",
  "Purescript": "#1D222D",
  "Elm": "#60B5CC",
  "ReasonML": "#ff5847",
  "HCL": "#844FBA",
  "Terraform": "#7B42BC",
  "Protocol Buffer": "#0A8DD0",
  "OpenAPI": "#85EA2D",
};

const fallbackCommits: Omit<GitHubCommitItem, "repoFullName">[] = [
  {
    repo: "portfolio-v2",
    message: "feat: wire GitHub activity and markdown blog pages",
    href: "https://github.com/BeanieMen/portfolio-v2",
    sha: "local",
    date: new Date().toISOString(),
    additions: 142,
    deletions: 19,
  },
  {
    repo: "notes",
    message: "docs: outline deployment and rollback checklist",
    href: "https://github.com/BeanieMen",
    sha: "local-2",
    date: new Date().toISOString(),
    additions: 64,
    deletions: 7,
  },
  {
    repo: "infra-lab",
    message: "chore: tune resource alerts and dashboards",
    href: "https://github.com/BeanieMen",
    sha: "local-3",
    date: new Date().toISOString(),
    additions: 81,
    deletions: 26,
  },
];

const fallbackLanguages: GitHubLanguage[] = [
  { name: "TypeScript", size: 520_000, color: "#3178c6" },
  { name: "Go", size: 190_000, color: "#00ADD8" },
  { name: "CSS", size: 72_000, color: "#663399" },
  { name: "Shell", size: 46_000, color: "#89e051" },
];

function fallbackData(username: string): GitHubActivityData {
  const commits = fallbackCommits.map((commit) => ({
    ...commit,
    repoFullName: `${username}/${commit.repo}`,
  }));

  return {
    username,
    profileUrl: `https://github.com/${username}`,
    commits,
    languages: fallbackLanguages,
    totalCommits: commits.length,
    totalAdditions: commits.reduce((sum, commit) => sum + commit.additions, 0),
    totalDeletions: commits.reduce((sum, commit) => sum + commit.deletions, 0),
    streak: null,
  };
}

async function fetchGithubStat<T>(path: string): Promise<T> {
  const response = await fetch(`${GITHUB_STAT_API_BASE}${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: CACHE_TTL_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`GitHub Stat request failed (${response.status})`);
  }

  return (await response.json()) as T;
}

async function fetchGitHubActivityUncached(username: string): Promise<GitHubActivityData> {
  try {
    const [commitsResponse, langsResponse] = await Promise.all([
      fetchGithubStat<GithubStatCommitsResponse>("/commits"),
      fetchGithubStat<GithubStatLangsResponse>("/langs"),
    ]);

    const commits = (commitsResponse.commits ?? []).slice(0, COMMIT_LIMIT).map((commit) => {
      const repoFullName = commit.repository;
      const repo = repoFullName.split("/")[1] ?? repoFullName;

      return {
        repo,
        repoFullName,
        message: commit.message,
        href: commit.url,
        sha: commit.sha,
        date: commit.date ?? new Date().toISOString(),
        additions: commit.additions,
        deletions: commit.deletions,
      } satisfies GitHubCommitItem;
    });

    if (commits.length === 0) {
      return fallbackData(username);
    }

    const languages = (langsResponse.languages ?? []).map((language) => ({
      name: language.language,
      size: language.bytes,
      color: LANGUAGE_COLORS[language.language] ?? DEFAULT_LANGUAGE_COLOR,
    }));

    const totalAdditions = commits.reduce((sum, commit) => sum + commit.additions, 0);
    const totalDeletions = commits.reduce((sum, commit) => sum + commit.deletions, 0);
    const totalCommits = commits.length;

    return {
      username,
      profileUrl: `https://github.com/${username}`,
      commits,
      languages,
      totalCommits,
      totalAdditions,
      totalDeletions,
      streak: null,
    };
  } catch {
    return fallbackData(username);
  }
}

const getCachedGitHubActivity = unstable_cache(
  async (username: string) => fetchGitHubActivityUncached(username),
  ["github-stat-activity"],
  { revalidate: CACHE_TTL_SECONDS }
);

export async function fetchGitHubActivity(username: string): Promise<GitHubActivityData> {
  return getCachedGitHubActivity(username);
}