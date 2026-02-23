"use client";

import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoIosArrowForward } from "react-icons/io";
import { IoClose } from "react-icons/io5";

const LINKS = [
  { id: 0, title: "ABOUT US", path: "/about-us" },
  { id: 1, title: "PRODUCTS", path: "/#" },
  { id: 20, title: "CMS", path: "/cms" },
  { id: 21, title: "HOLOVUE", path: "/holovue" },
  { id: 2, title: "BLOG", path: "/blog" },
  { id: 3, title: "CONTACT", path: "/contact-us" },
];

const PRODUCTS = [
  { id: 10, title: "AI HUMANS", path: "/ai-humans" },
  { id: 11, title: "AI MICROSITE", path: "/ai-microsites" },
  { id: 12, title: "AI LAB", path: "/ai-lab" },
  { id: 13, title: "AI CHATBOT", path: "/ai-chatbot" },
];

function NavGradientButton({
  label,
  className = "",
  href,
}: {
  label: string;
  className?: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex h-[40px] min-w-[120px] rounded-[6px] ${className}`}
    >
      <div className="w-full h-full rounded-lg bg-gradient-to-r from-primary-500 via-primary-400 to-complementary-500 p-[1.5px]">
        <div className="h-full w-full bg-[#0a0e18] rounded-[6.5px] flex items-center justify-center hover:bg-[#0f1420] transition-colors">
          <span className="text-[12px] font-unitea text-white/90 uppercase tracking-wider">
            {label}
          </span>
        </div>
      </div>
    </Link>
  );
}

function DesktopNav() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [close]);

  return (
    <div className="hidden lg:flex items-center gap-1 text-white">
      <nav className="uppercase font-proDisplayRegular text-[11px] xl:text-[13px] flex items-center gap-0.5 tracking-wider">
        {LINKS.map((link) => (
          <div key={link.id}>
            {link.title === "PRODUCTS" ? (
              <div
                className="relative"
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={close}
                onFocusCapture={() => setOpen(true)}
                onBlurCapture={close}
              >
                <Link
                  href="/products"
                  className="block px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                  aria-haspopup="menu"
                  aria-expanded={open}
                >
                  Products
                </Link>
                <div
                  className={[
                    "absolute left-0 pt-1 w-52 transition-all duration-200",
                    open
                      ? "opacity-100 pointer-events-auto translate-y-0"
                      : "opacity-0 pointer-events-none -translate-y-1",
                  ].join(" ")}
                  role="menu"
                >
                  <div className="rounded-xl border border-white/[0.08] bg-[#0a0e18]/95 backdrop-blur-xl text-white py-1.5 shadow-2xl">
                    {PRODUCTS.map((p) => (
                      <Link
                        key={p.id}
                        href={p.path}
                        className="block px-4 py-2.5 text-[12px] text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        {p.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={link.id}
                href={link.path}
                className="px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
              >
                {link.title}
              </Link>
            )}
          </div>
        ))}
      </nav>

      <div className="ml-2">
        <NavGradientButton label="Request Demo" href="/request-demo" />
      </div>
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = useCallback(() => setMobileOpen((v) => !v), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && closeMobile();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [closeMobile]);

  return (
    <div className="fixed top-0 left-0 z-20 w-full">
      {/* Glass bar */}
      <div className="border-b border-white/[0.06] bg-[#050810]/60 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-[#050810]/40">
        <div className="w-full max-w-[1280px] 2xl:max-w-[1536px] mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="shrink-0 transition-opacity hover:opacity-80"
          >
            <img
              src="/creaive/Creaive Logo Final 06.png"
              alt="CREAiVE"
              className="w-[100px] xl:w-[110px]"
            />
          </Link>

          <DesktopNav />

          <button
            className="lg:hidden text-white/80 p-2 rounded-lg hover:bg-white/[0.06] transition-colors"
            onClick={toggleMobile}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            <RxHamburgerMenu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile full-screen menu */}
      <aside
        id="mobile-menu"
        className={[
          "fixed inset-0 z-40 lg:hidden",
          "bg-[#050810] text-white",
          "flex flex-col",
          "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-primary-500/[0.07] blur-[100px]" />
          <div className="absolute -bottom-40 -right-20 h-[360px] w-[360px] rounded-full bg-complementary-500/[0.06] blur-[100px]" />
        </div>

        <div className="relative z-10 flex items-center justify-between h-16 px-5 shrink-0">
          <Link href="/" onClick={closeMobile}>
            <img
              src="/creaive/Creaive Logo Final 06.png"
              alt="CREAiVE"
              className="w-[90px]"
            />
          </Link>
          <button
            className="p-2.5 rounded-full border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.12] transition-colors"
            onClick={closeMobile}
            aria-label="Close menu"
          >
            <IoClose size={20} />
          </button>
        </div>

        <nav className="relative z-10 flex-1 overflow-y-auto overscroll-contain px-5 pt-4 pb-10">
          <p className="text-[10px] font-semibold tracking-[0.3em] text-white/30 uppercase mb-4">
            Products
          </p>
          <div className="grid grid-cols-2 gap-3">
            {PRODUCTS.map((link, i) => (
              <Link
                key={link.id}
                href={link.path}
                onClick={closeMobile}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 active:scale-[0.96] transition-all duration-200"
                style={{
                  transitionDelay: mobileOpen ? `${80 + i * 40}ms` : "0ms",
                }}
              >
                <span className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-complementary-500/15 blur-2xl opacity-0 group-active:opacity-100 transition-opacity duration-300" />
                <span className="block text-[13px] font-semibold tracking-wide text-white/90 mb-1">
                  {link.title}
                </span>
                <IoIosArrowForward
                  size={14}
                  className="text-complementary-500/60 group-active:text-complementary-500 transition-colors"
                />
              </Link>
            ))}
          </div>

          <div className="my-7 flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
            <div className="h-1 w-1 rounded-full bg-complementary-500/40" />
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          </div>

          <p className="text-[10px] font-semibold tracking-[0.3em] text-white/30 uppercase mb-4">
            Navigation
          </p>
          <div className="space-y-1">
            {LINKS.filter((l) => l.title !== "PRODUCTS").map((link, i) => (
              <Link
                key={link.id}
                href={link.path}
                onClick={closeMobile}
                className="group flex items-center justify-between rounded-xl px-4 py-4 hover:bg-white/[0.04] active:bg-white/[0.06] transition-colors"
                style={{
                  transitionDelay: mobileOpen ? `${200 + i * 30}ms` : "0ms",
                }}
              >
                <span className="text-[15px] font-medium text-white/75 group-active:text-white transition-colors">
                  {link.title}
                </span>
                <IoIosArrowForward
                  size={16}
                  className="text-white/15 group-active:text-white/40 transition-colors"
                />
              </Link>
            ))}
          </div>
        </nav>

        <div className="relative z-10 shrink-0 border-t border-white/[0.06] bg-[#050810]/80 backdrop-blur-lg px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <NavGradientButton
            label="Request Demo"
            href="/request-demo"
            className="w-full"
          />
        </div>
      </aside>
    </div>
  );
}
