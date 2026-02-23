"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
    { href: "/product-test/page1", label: "Page 1" },
    { href: "/product-test/page2", label: "Page 2" },
    { href: "/product-test/page3", label: "Page 3" },
];

export default function NavTabs() {
    const pathname = usePathname();
    return (
        <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
            {tabs.map(t => {
                const active = pathname?.startsWith(t.href);
                return (
                    <Link
                        key={t.href}
                        href={t.href}
                        className={[
                            "px-4 py-2 rounded-lg text-sm transition",
                            active ? "bg-fuchsia-600 text-white" : "text-slate-300 hover:bg-white/10"
                        ].join(" ")}
                        prefetch
                    >
                        {t.label}
                    </Link>
                );
            })}
        </div>
    );
}
