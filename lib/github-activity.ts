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

type KatibCommitItem = {
  repo: string;
  additions: number;
  deletions: number;
  commitUrl: string;
  committedDate: string;
  oid: string;
  messageHeadline: string;
};

type KatibLanguage = {
  size: number;
  name: string;
  color?: string;
};

type KatibLatestCommitsResponse = {
  commits?: KatibCommitItem[];
  languages?: KatibLanguage[];
  stats?: {
    totalAdditions?: number;
    totalDeletions?: number;
    totalCommits?: number;
  };
  error?: string;
};

type KatibStreakResponse = {
  currentStreak?: number;
  highestStreak?: number;
  active?: boolean;
  error?: string;
};

const KATIB_API_BASE = process.env.KATIB_API_BASE ?? "https://katib.jasoncameron.dev";
const CACHE_TTL_SECONDS = 60 * 30;
export const COMMIT_LIMIT = 3;
const DEFAULT_LANGUAGE_COLOR = "#8b949e";

const envGithubPat = process.env.GITHUB_PAT ?? process.env.GIHTUB_PAT ?? "";

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

function katibHeaders(): HeadersInit {
  if (!envGithubPat) {
    return { Accept: "application/json" };
  }

  return {
    Accept: "application/json",
    Authorization: `Bearer ${envGithubPat}`,
  };
}

async function fetchKatib<T>(path: string): Promise<T> {
  const response = await fetch(`${KATIB_API_BASE}${path}`, {
    headers: katibHeaders(),
    next: { revalidate: CACHE_TTL_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`Katib request failed (${response.status})`);
  }

  return (await response.json()) as T;
}

async function fetchGitHubActivityUncached(username: string): Promise<GitHubActivityData> {
  const encodedUsername = encodeURIComponent(username);

  try {
    const [latest, streakResponse] = await Promise.all([
      fetchKatib<KatibLatestCommitsResponse>(`/v2/commits/latest?username=${encodedUsername}&limit=${COMMIT_LIMIT}`),
      fetchKatib<KatibStreakResponse>(`/streak?username=${encodedUsername}`),
    ]);

    if (latest.error) {
      throw new Error(latest.error);
    }

    const commits = (latest.commits ?? []).slice(0, COMMIT_LIMIT).map((commit) => {
      const repoFullName = commit.repo;
      const repo = repoFullName.split("/")[1] ?? repoFullName;

      return {
        repo,
        repoFullName,
        message: commit.messageHeadline,
        href: commit.commitUrl,
        sha: commit.oid,
        date: commit.committedDate,
        additions: commit.additions ?? 0,
        deletions: commit.deletions ?? 0,
      } satisfies GitHubCommitItem;
    });

    if (commits.length === 0) {
      return fallbackData(username);
    }

    const languages = (latest.languages ?? []).map((language) => ({
      name: language.name,
      size: language.size,
      color: language.color || DEFAULT_LANGUAGE_COLOR,
    }));

    const totalAdditions =
      latest.stats?.totalAdditions ?? commits.reduce((sum, commit) => sum + commit.additions, 0);
    const totalDeletions =
      latest.stats?.totalDeletions ?? commits.reduce((sum, commit) => sum + commit.deletions, 0);
    const totalCommits = latest.stats?.totalCommits ?? commits.length;

    const streak =
      typeof streakResponse.currentStreak === "number" && typeof streakResponse.highestStreak === "number"
        ? {
            current: streakResponse.currentStreak,
            highest: streakResponse.highestStreak,
            active: Boolean(streakResponse.active),
          }
        : null;

    return {
      username,
      profileUrl: `https://github.com/${username}`,
      commits,
      languages,
      totalCommits,
      totalAdditions,
      totalDeletions,
      streak,
    };
  } catch {
    return fallbackData(username);
  }
}

const getCachedGitHubActivity = unstable_cache(
  async (username: string) => fetchGitHubActivityUncached(username),
  ["katib-github-activity"],
  { revalidate: CACHE_TTL_SECONDS }
);

export async function fetchGitHubActivity(username: string): Promise<GitHubActivityData> {
  return getCachedGitHubActivity(username);
}
