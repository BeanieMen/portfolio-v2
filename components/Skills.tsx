import { Icon } from "@iconify/react";

type Skill = {
  name: string;
  icon: string;
  url: string;
};

export const skills: Skill[] = [
  { name: "TypeScript", icon: "logos:typescript-icon", url: "https://www.typescriptlang.org/" },
  { name: "React", icon: "logos:react", url: "https://react.dev/" },
  { name: "SQL", icon: "logos:postgresql", url: "https://www.postgresql.org/" },
  { name: "RESTful API", icon: "logos:api-dot-video", url: "https://restfulapi.net/" },
  { name: "Docker", icon: "logos:docker-icon", url: "https://www.docker.com/" },
  { name: "CI/CD", icon: "logos:github-actions", url: "https://github.com/features/actions" },
  { name: "Deployment", icon: "logos:vercel-icon", url: "https://vercel.com/" },
  { name: "Infra", icon: "simple-icons:terraform", url: "https://www.terraform.io/" },
  { name: "DevOps", icon: "logos:kubernetes", url: "https://kubernetes.io/" },
  { name: "Git", icon: "logos:git-icon", url: "https://git-scm.com/" },
  { name: "Linux", icon: "logos:linux-tux", url: "https://www.linux.org/" },
  { name: "Three.js", icon: "logos:threejs", url: "https://threejs.org/" },
  { name: "WebGL", icon: "mdi:cube-scan", url: "https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API" },
];

export function SkillBadge({ skill }: { skill: Skill }) {
  return (
    <a
      href={skill.url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 rounded-md border border-chip-border bg-chip-bg px-3 py-1.5 text-sm sm:text-base transition hover:-translate-y-0.5"
    >
      <Icon icon={skill.icon} className="h-5 w-5" />
      <span>{skill.name}</span>
    </a>
  );
}
