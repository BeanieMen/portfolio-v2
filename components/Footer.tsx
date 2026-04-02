import Link from "next/link";
import { Icon } from "@iconify/react";
import { ArrowUpRight } from "lucide-react";

const exploreLinks = [
    { label: "Home", href: "/" },
    { label: "About Me", href: "#" },
    { label: "Contact", href: "#contact" },
];

const socialLinks = [
    { label: "Discord", href: "https://discord.com", icon: "mdi:discord" },
    { label: "Instagram", href: "https://instagram.com", icon: "mdi:instagram" },
    { label: "GitHub", href: "https://github.com/BeanieMen", icon: "mdi:github" },
];

function FooterAction({ title, subtitle, href }: { title: string; subtitle: string; href: string }) {
    return (
        <Link
            href={href}
            className="group flex items-center justify-between gap-3 border-b border-panel-border py-3 transition hover:border-foreground/40"
        >
            <div>
                <p className="text-lg font-semibold text-foreground transition group-hover:text-white">{title}</p>
                <p className="text-sm text-text-muted">{subtitle}</p>
            </div>
            <span className="rounded-full border-[1px] border-panel-border p-2 transition group-hover:rotate-0 group-hover:border-foreground/60 group-hover:text-white">
                <ArrowUpRight className="h-5 w-5 rotate-45 transition group-hover:rotate-0" />
            </span>
        </Link>
    );
}

export default function Footer() {
    return (
        <div className="mt-10 w-full mx-auto max-w-[98vw]">
            <footer id="contact" className="relative mt-10 w-full overflow-hidden rounded-2xl border-[1px] border-panel-border bg-background/75 px-4 py-[22.5rem] pt-10 backdrop-blur-sm sm:px-6 lg:px-10">
                <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 mt-5 md:gap-x-20 items-start">

                    <div>
                        <h4 className="text-center text-lg font-semibold text-foreground">Explore</h4>
                        <div className="mt-4 flex flex-col items-center gap-2">
                            {exploreLinks.map((link) => (
                                <Link key={link.label} href={link.href} className="text-base text-text-muted transition hover:text-foreground">
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-center text-lg font-semibold text-foreground">Follow Me</h4>
                        <div className="mt-4 flex flex-col items-center gap-3">
                            {socialLinks.map((social) => {
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-2 text-text-muted transition hover:text-foreground"
                                    >
                                        <span className="rounded-full border border-panel-border p-1.5">
                                            <Icon icon={social.icon} className="h-4 w-4" />
                                        </span>
                                        <span className="text-base">{social.label}</span>
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    <div className="w-full">
                        <div className="grid w-full max-w-xl ml-auto grid-cols-1 gap-3">
                            <FooterAction title="Contact Me" subtitle="Heya :3" href="#contact" />
                            <FooterAction title="My Projects" subtitle="Stuffz" href="https://github.com/BeanieMen" />
                        </div>
                    </div>
                </div>



                <div className="pointer-events-none absolute bottom-[-30%] left-1/2 z-0 w-full -translate-x-1/2 select-none px-4 text-center sm:px-6 lg:px-10">
                    <p className="whitespace-nowrap text-center text-[clamp(9.6rem,32vw,32rem)] font-semibold leading-none tracking-tight text-[#dddcc4] dark:text-[#d8d8bf]/95">
                        Beanie
                    </p>
                </div>

            </footer>
            <div className="relative left-1/2 z-10 mt-6 flex w-screen -translate-x-1/2 items-center justify-between px-3 sm:px-6 text-lg font-semibold text-foreground/90">
                <span>Built by Beanie</span>
                <span>Delhi, India</span>
            </div>
        </div>
    );
}
