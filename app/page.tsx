import Background from "@/components/Background";
import { BookOpen, Download, ExternalLink, MapPin } from "lucide-react";
import { Icon } from "@iconify/react";
import { skills, SkillBadge } from "@/components/Skills";
import Footer from "@/components/Footer";
import IntroCurtain from "@/components/IntroCurtain";
import LocalClock from "@/components/LocalClock";
import GitHubActivityPanel from "@/components/GitHubActivityPanel";
import TransitionLink from "@/components/blog/TransitionLink";
import TransitionTitleText from "@/components/blog/TransitionTitleText";
import { formatBlogDate, getLatestBlogPosts } from "@/lib/blog";
import { fetchGitHubActivity } from "@/lib/github-activity";

function HeroActions() {
  return (
    <div className="flex flex-row items-stretch gap-3 w-full lg:w-auto">
      <a
        href="/resume.pdf"
        download="Aarjav_Jain_Resume.pdf"
        className="grow lg:grow-0 flex items-center justify-center gap-2 px-5 py-2.5 border border-foreground text-foreground rounded-lg hover:bg-foreground hover:text-background transition font-semibold text-base"
      >
        <Download className="w-5 h-5" />
        <span>Resume</span>
      </a>
      <a
        href="https://github.com/BeanieMen"
        target="_blank"
        rel="noreferrer"
        className="grow lg:grow-0 flex items-center justify-center gap-2 px-5 py-2.5 border border-foreground text-foreground rounded-lg hover:bg-foreground hover:text-background transition font-semibold text-base"
        aria-label="Visit BeanieMen's GitHub profile"
      >
        <Icon icon="mdi:github" className="w-6 h-6" />
      </a>
    </div>
  );
}

export default async function Page() {
  const [latestPosts, githubActivity] = await Promise.all([
    getLatestBlogPosts(4),
    fetchGitHubActivity("BeanieMen"),
  ]);

  return (
    <div className="relative w-screen min-h-screen overflow-x-hidden bg-background text-foreground">
      <IntroCurtain />
      <Background />
      <div className="relative z-10 max-w-5xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 sm:pb-28 pt-8">
        <header id="about" className="flex flex-col items-start mb-16 lg:mb-20 max-w-xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3">Aarjav Jain</h1>
          <p className="text-text-muted text-lg sm:text-xl lg:text-2xl mb-2 font-light">I am currently finishing school alongside part time gigs to build up experience. Learning the guitar and sysdev in my spare time </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-text-muted text-base sm:text-lg mb-8 lg:mb-10">
            <span className="flex items-center gap-2">
              <MapPin className="w-5 h-5" /> Delhi, India
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="font-mono">
              <LocalClock />
            </span>
          </div>
          <HeroActions />
        </header>

        <section id="skills">
          <h2 className="text-xl sm:text-2xl lg:text-3xl mb-6 lg:mb-8 tracking-tight font-light">Tech stack</h2>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            {skills.map((skill) => (
              <SkillBadge key={skill.name} skill={skill} />
            ))}
          </div>
        </section>

        <section aria-labelledby="highlights-title" className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          <h2 id="highlights-title" className="sr-only">Dashboard highlights</h2>

          <GitHubActivityPanel data={githubActivity} />

          <article className="rounded-2xl border border-panel-border bg-panel/75 p-4 shadow-lg backdrop-blur-sm sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-2 text-sm">
              <h3 className="flex items-center gap-2 font-semibold text-foreground">
                <BookOpen className="h-4 w-4" />
                <span>Latest posts</span>
              </h3>
              <TransitionLink
                href="/blog"
                className="inline-flex items-center gap-1 text-xs font-medium text-text-muted transition hover:text-foreground"
              >
                All posts
                <ExternalLink className="h-3.5 w-3.5" />
              </TransitionLink>
            </div>

            {latestPosts.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {latestPosts.map((post) => {
                  return (
                    <li key={post.slug}>
                      <TransitionLink
                        href={`/blog/${post.slug}`}
                        className="flex min-w-0 items-center gap-2 text-text-muted transition hover:text-foreground"
                      >
                        <span className="min-w-0 flex-1 truncate">
                          <TransitionTitleText
                            slug={post.slug}
                            title={post.title}
                            titleMarkdown={post.titleMarkdown}
                          />
                        </span>
                        <span className="shrink-0 text-xs text-text-muted">{formatBlogDate(post.date)}</span>
                      </TransitionLink>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-text-muted italic">No posts yet.</p>
            )}
          </article>
        </section>

      </div>

      <div id="contact" className="relative z-10 mt-4 flex justify-center pb-10">
        <Footer />
      </div>
    </div>
  );
}
