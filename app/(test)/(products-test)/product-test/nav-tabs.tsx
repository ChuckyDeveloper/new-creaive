"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
    { href: "/product-test/page1", label: "Showcase" },
    { href: "/product-test/page2", label: "AI Humans" },
    { href: "/product-test/page3", label: "AI Microsite" },
    { href: "/product-test/page3", label: "AI Labs" },
    { href: "/product-test/page3", label: "AI Chatbot" },
];

export default function NavTabs() {
    const pathname = usePathname();
    return (
        <div className="w-full items-center justify-around flex">
            {tabs.map(t => {
                const active = pathname?.startsWith(t.href);
                return (
                    <div className="inline-flex ">
                        <Link
                            key={t.href}
                            href={t.href}
                            className={[
                                "px-[1px] py-[1px] rounded-[4px] transition",
                                active
                                    ? "bg-gradient-to-r from-primary-600 via-primary-400 to-complementary-500 text-white"
                                    : "rounded bg-gradient-to-r from-primary-600 via-primary-400 to-complementary-500 text-slate-300 hover:bg-white/10"
                            ].join(" ")}
                            prefetch
                        >
                            <div className={["px-5 rounded-[3px] ", active ? "bg-gradient-to-r from-primary-600 via-primary-400 to-complementary-500 text-white": "bg-black"].join(" ")}>
                                {t.label}
                            </div>
                        </Link>
                    </div>
                );
            })}
        </div>
    );
}


{/* <div class="rounded-xl p-[2px] bg-gradient-to-r from-primary-600 via-primary-400 to-complementary-500">
  <div class="rounded-[inherit] bg-black/80 p-4">
    content…
  </div>
</div> */}
