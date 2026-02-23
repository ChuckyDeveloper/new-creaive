"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";

const tabs = [
    { href: "/products/showcase", label: "Showcase" },
    { href: "/products/brands", label: "Brands" },
    { href: "/products/ai-humans", label: "AI Humans" },
    { href: "/products/ai-microsites", label: "AI Microsite" },
    { href: "/products/ai-lab", label: "AI Labs" },
    { href: "/products/ai-chatbot", label: "AI Chatbot" },
    { href: "/products/holovue", label: "Holovue" },
];

export default function NavTabs() {
    const pathname = usePathname();
    const rowRef = useRef<HTMLDivElement | null>(null);

    const onKeyScroll = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!rowRef.current) return;
        if (e.key === "ArrowRight") {
            e.preventDefault();
            rowRef.current.scrollBy({ left: 120, behavior: "smooth" });
        } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            rowRef.current.scrollBy({ left: -120, behavior: "smooth" });
        }
    };

    return (
        <nav aria-label="Products navigation" className="w-full pt-10">
            <div
                ref={rowRef}
                onKeyDown={onKeyScroll}
                tabIndex={0}
                className="
                    relative flex w-full gap-2
                    overflow-x-auto no-scrollbar
                    whitespace-nowrap
                    px-3 py-2
                    md:justify-center md:gap-3 md:px-0
                    outline-none focus:ring-0
                 "
            >
                {/* subtle edge fades on mobile */}
                <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-black to-transparent md:hidden" />
                <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-black to-transparent md:hidden" />

                {tabs.map((t) => {
                    const active = pathname?.startsWith(t.href);
                    return (
                        <div key={t.href} className="inline-flex">
                            <Link
                                href={t.href}
                                prefetch
                                aria-current={active ? "page" : undefined}
                                className={[
                                    "rounded-[4px] px-[1px] py-[1px] transition",
                                    active
                                        ? "bg-gradient-to-r from-primary-600 via-primary-400 to-complementary-500 text-white"
                                        : "bg-gradient-to-r from-primary-600 via-primary-400 to-complementary-500 text-slate-300 hover:opacity-95",
                                ].join(" ")}
                            >
                                <span
                                    className={[
                                        "rounded-[3px] px-4 py-1.5 text-sm md:text-base",
                                        "outline-none focus-visible:ring-2 focus-visible:ring-primary-400/60",
                                        active
                                            ? "bg-gradient-to-r from-primary-600 via-primary-400 to-complementary-500 text-white"
                                            : "bg-[#121212]",
                                    ].join(" ")}
                                >
                                    {t.label}
                                </span>
                            </Link>
                        </div>
                    );
                })}
            </div>

            {/* hide scrollbar utility (scoped) */}
            <style jsx>{`
                .no-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
                }
                .no-scrollbar::-webkit-scrollbar {
                display: none;
                }
            `}</style>
        </nav>
    );
}
