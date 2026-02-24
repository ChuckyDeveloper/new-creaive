"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Footer from "../../components/layout/footer";
import Nav from "../../components/layout/nav";
import Codee from "@/components/Codee";

const CODEE = dynamic(() => import("@/components/Codee"), {
  ssr: false,
});

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showAssistant, setShowAssistant] = useState(true);
  const pathname = usePathname();

  /* ── Scroll-reveal observer — re-runs on every route change ── */
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    let io: IntersectionObserver | null = null;
    let mo: MutationObserver | null = null;
    let initTimer: number | null = null;

    const initRevealObserver = () => {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("is-visible");
              io?.unobserve(e.target);
            }
          });
        },
        { rootMargin: "0px 0px -80px 0px", threshold: 0.05 },
      );

      document
        .querySelectorAll(".reveal-section:not(.is-visible)")
        .forEach((el) => io?.observe(el));

      // Also pick up lazily-mounted sections (dynamic imports)
      mo = new MutationObserver((mutations) => {
        for (const m of mutations) {
          m.addedNodes.forEach((node) => {
            if (!(node instanceof HTMLElement)) return;
            if (
              node.classList.contains("reveal-section") &&
              !node.classList.contains("is-visible")
            ) {
              io?.observe(node);
            }
            node
              .querySelectorAll(".reveal-section:not(.is-visible)")
              .forEach((el) => io?.observe(el));
          });
        }
      });
      mo.observe(document.body, { childList: true, subtree: true });
    };

    // Delay observer setup until well after hydration is complete
    // to prevent classList mutations that cause server/client mismatch.
    const scheduleInit = () => {
      initTimer = window.setTimeout(() => {
        requestAnimationFrame(initRevealObserver);
      }, 100);
    };

    if (document.readyState === "complete") {
      scheduleInit();
    } else {
      window.addEventListener("load", scheduleInit, { once: true });
    }

    return () => {
      if (initTimer !== null) {
        clearTimeout(initTimer);
      }
      window.removeEventListener("load", scheduleInit);
      io?.disconnect();
      mo?.disconnect();
    };
  }, [pathname]);

  return (
    <div className="relative min-h-screen">
      <Nav />
      {children}
      <Footer />
      <Codee />
    </div>
  );
}
