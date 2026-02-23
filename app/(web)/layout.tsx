"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Footer from "../../components/layout/footer";
import Nav from "../../components/layout/nav";

const CODEE = dynamic(() => import("@/components/Codee"), {
  ssr: false,
});

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showAssistant, setShowAssistant] = useState(false);
  const pathname = usePathname();

  /* ── Delay chatbot widget load ── */
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowAssistant(true);
    }, 3500);
    return () => window.clearTimeout(timer);
  }, []);

  /* ── Scroll-reveal observer — re-runs on every route change ── */
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -80px 0px", threshold: 0.05 },
    );

    // Wait one frame so dynamic components are in the DOM
    const raf = requestAnimationFrame(() => {
      document
        .querySelectorAll(".reveal-section:not(.is-visible)")
        .forEach((el) => io.observe(el));
    });

    // Also pick up lazily-mounted sections (dynamic imports)
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (
            node.classList.contains("reveal-section") &&
            !node.classList.contains("is-visible")
          ) {
            io.observe(node);
          }
          node
            .querySelectorAll(".reveal-section:not(.is-visible)")
            .forEach((el) => io.observe(el));
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return (
    <div className="relative min-h-screen">
      <Nav />
      {children}
      <Footer />
      {showAssistant ? <CODEE /> : null}
    </div>
  );
}
