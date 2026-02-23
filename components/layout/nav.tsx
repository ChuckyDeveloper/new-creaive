"use client";

import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoIosArrowForward } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import type { AppDispatch } from "@/lib/features";
import { selectAuth } from "@/lib/features/auth/selectors";
import { fetchMe, signOut } from "@/lib/features/auth/thunks";

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

const LINKS_SECONDARY = [
  // { id: 20, title: "CMS", path: "/cms" },
  // { id: 21, title: "HOLOVUE", path: "/holovue" },
];

type NavGradientButtonProps = {
  label: string;
  className?: string;
  href?: string;
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
};

function NavGradientButton({
  label,
  className = "",
  href,
  onClick,
  disabled = false,
}: NavGradientButtonProps) {
  const classes = [
    "inline-flex h-[40px] min-w-[120px] rounded-[6px]",
    disabled ? "opacity-60" : "",
    href && disabled ? "pointer-events-none" : "",
    !href && disabled ? "cursor-not-allowed" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <div className="w-full h-full rounded-[6px] bg-gradient-to-r from-primary-600 via-primary-400 to-complementary-500 p-[2px]">
      <div className="h-full w-full bg-[#121212] rounded-[6px] flex items-center justify-center">
        <span className="text-[14px] font-unitea text-white uppercase tracking-wide">
          {label}
        </span>
      </div>
    </div>
  );

  if (href) {
    const handleLinkClick = async (
      event: React.MouseEvent<HTMLAnchorElement>
    ) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      if (onClick) {
        await Promise.resolve(onClick());
      }
    };

    return (
      <Link
        href={href}
        onClick={handleLinkClick}
        aria-disabled={disabled}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
      >
        {inner}
      </Link>
    );
  }

  const handleButtonClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    if (onClick) {
      await Promise.resolve(onClick());
    }
  };

  return (
    <button
      type="button"
      onClick={handleButtonClick}
      disabled={disabled}
      className={classes}
    >
      {inner}
    </button>
  );
}

type DesktopNavProps = {
  isAuthed: boolean;
  authLoading: boolean;
  signingOut: boolean;
  onSignOut: () => void;
};

function DesktopNav({
  isAuthed,
  authLoading,
  signingOut,
  onSignOut,
}: DesktopNavProps) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [close]);

  return (
    <div className="hidden lg:flex items-center gap-6 text-white">
      <nav className="uppercase font-proDisplayRegular text-[12px] xl:text-[14px] flex items-center gap-4">
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
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div
                    className="hover:scale-105 transition uppercase"
                    aria-haspopup="menu"
                    aria-expanded={open}
                  >
                    Products
                  </div>
                </Link>
                <div
                  className={[
                    "absolute right-0 mt-0 py-2 w-56 rounded-lg shadow-lg transition",
                    open
                      ? "opacity-100 pointer-events-auto"
                      : "opacity-0 pointer-events-none",
                    "bg-black text-white",
                  ].join(" ")}
                  role="menu"
                >
                  {PRODUCTS.map((p) => (
                    <Link
                      key={p.id}
                      href={p.path}
                      className="block px-4 py-2 hover:bg-white/10"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {p.title}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={link.id}
                href={link.path}
                className="hover:scale-105 transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.title}
              </Link>
            )}
          </div>
        ))}

        {LINKS_SECONDARY.slice(0, 1).map((link) => (
          <Link
            key={link.id}
            href={link.path}
            className="px-2 py-1 hover:scale-105 transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.title}
          </Link>
        ))}
      </nav>

      {authLoading ? (
        <NavGradientButton label="Loading" disabled />
      ) : isAuthed ? (
        <div className="flex items-center gap-2">
          <NavGradientButton label="Dashboard" href="/dashboard" />
          <NavGradientButton
            label={signingOut ? "Signing..." : "Sign Out"}
            onClick={onSignOut}
            disabled={signingOut}
          />
        </div>
      ) : (
        <NavGradientButton label="Sign In" href="/sign-in" />
      )}
    </div>
  );
}

export default function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const { status, loading } = useSelector(selectAuth);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const isAuthed = status === "authenticated";
  const authLoading = status === "unknown" || loading;

  useEffect(() => {
    if (status === "unknown" && !loading) {
      dispatch(fetchMe());
    }
  }, [dispatch, status, loading]);

  // Sync auth state across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Detect sign-out from another tab
      if (e.key === "auth_signout" && e.newValue) {
        dispatch(fetchMe());
      }
      // Detect sign-in from another tab
      if (e.key === "auth_signin" && e.newValue) {
        dispatch(fetchMe());
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Tab became visible, refresh auth state
        dispatch(fetchMe());
      }
    };

    // Poll auth state every 30 seconds to detect session expiry
    const intervalId = setInterval(() => {
      if (isAuthed) {
        dispatch(fetchMe());
      }
    }, 30000);

    window.addEventListener("storage", handleStorageChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(intervalId);
    };
  }, [dispatch, isAuthed]);

  const toggleMobile = useCallback(() => setMobileOpen((v) => !v), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const handleSignOut = useCallback(async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await dispatch(signOut()).unwrap();
    } catch (err) {
      console.error("Sign out failed", err);
    } finally {
      setSigningOut(false);
    }
  }, [dispatch, signingOut]);

  const handleMobileSignOut = useCallback(async () => {
    await handleSignOut();
    closeMobile();
  }, [handleSignOut, closeMobile]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && closeMobile();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [closeMobile]);

  return (
    <div className="fixed top-0 left-0 z-20 w-full bg-[#121212]/20 supports-[backdrop-filter]:bg-[#121212]/30">
      <div className="w-full max-w-[1280px] 2xl:max-w-[1650px] mx-auto flex items-center justify-between h-16 px-3">
        {/* Logo */}
        <Link
          href="/"
          className="shrink-0"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/creaive/Creaive Logo Final 06.png"
            alt="CREAiVE"
            className="w-[100px] xl:w-[120px]"
          />
        </Link>

        {/* Desktop */}
        <DesktopNav
          isAuthed={isAuthed}
          authLoading={authLoading}
          signingOut={signingOut}
          onSignOut={handleSignOut}
        />

        {/* Mobile hamburger */}
        <button
          className="lg:hidden text-white p-2 rounded-md hover:bg-white/10"
          onClick={toggleMobile}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
        >
          <RxHamburgerMenu size={26} />
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={[
          "fixed inset-0 z-40 lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
      >
        {/* Overlay */}
        <div
          className={[
            "absolute inset-0 bg-black/90 transition-opacity",
            mobileOpen ? "opacity-100" : "opacity-0",
          ].join(" ")}
          onClick={closeMobile}
          aria-hidden
        />

        {/* Panel */}
        <aside
          id="mobile-menu"
          className={[
            "absolute right-0 top-0 h-full w-full max-w-screen",
            "bg-[#0f1115] text-white shadow-xl border-l border-white/10",
            "transform transition-transform duration-200 ease-out",
            mobileOpen ? "translate-x-0" : "translate-x-full",
          ].join(" ")}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="flex z-50 items-center justify-between h-16 px-4 border-b w-full border-white/10">
            <Link
              href="/"
              onClick={closeMobile}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/creaive/Creaive Logo Final 06.png"
                alt="CREAiVE"
                className="w-[100px]"
              />
            </Link>
            <button
              className="p-2 rounded-md hover:bg-white/10"
              onClick={closeMobile}
              aria-label="Close menu"
            >
              <IoClose size={22} />
            </button>
          </div>

          <nav className="px-3 py-4 space-y-1 overflow-y-auto w-screen h-screen bg-[#18181B]">
            {/* Products group */}
            <div className="px-2 py-2 text-xs font-semibold tracking-wide text-slate-300/80 uppercase">
              Products
            </div>
            <div className="grid gap-1">
              {PRODUCTS.map((link) => (
                <Link
                  key={link.id}
                  href={link.path}
                  onClick={closeMobile}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 active:bg-white/15"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IoIosArrowForward
                    size={18}
                    className="text-complementary-500"
                  />
                  <span className="text-sm">{link.title}</span>
                </Link>
              ))}
            </div>

            {/* Primary */}
            <div className="px-2 pt-5 pb-2 text-xs font-semibold tracking-wide text-slate-300/80 uppercase">
              Navigation
            </div>
            <div className="grid gap-1">
              {LINKS.map((link) => (
                <Link
                  key={link.id}
                  href={link.path}
                  onClick={closeMobile}
                  className="px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 active:bg-white/15"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="text-sm">{link.title}</span>
                </Link>
              ))}
            </div>

            {/* Secondary */}
            <div className="px-2 pt-5 pb-2 text-xs font-semibold tracking-wide text-slate-300/80 uppercase">
              More
            </div>
            <div className="grid gap-1 mb-4">
              {LINKS_SECONDARY.map((link) => (
                <Link
                  key={`${link.title}-${link.path}`}
                  href={link.path}
                  onClick={closeMobile}
                  className="px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 active:bg-white/15"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="text-sm">{link.title}</span>
                </Link>
              ))}
            </div>

            <div className="px-4 pt-2 pb-10">
              {authLoading ? (
                <NavGradientButton
                  label="Loading"
                  className="w-full"
                  disabled
                />
              ) : isAuthed ? (
                <div className="grid gap-2">
                  <NavGradientButton
                    label="Dashboard"
                    href="/dashboard"
                    className="w-full"
                    onClick={closeMobile}
                  />
                  <NavGradientButton
                    label={signingOut ? "Signing..." : "Sign Out"}
                    className="w-full"
                    onClick={handleMobileSignOut}
                    disabled={signingOut}
                  />
                </div>
              ) : (
                <NavGradientButton
                  label="Sign In"
                  href="/sign-in"
                  className="w-full"
                  onClick={closeMobile}
                />
              )}
            </div>
          </nav>
        </aside>
      </div>
    </div>
  );
}
