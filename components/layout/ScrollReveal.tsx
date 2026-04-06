"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Lightweight client wrapper that sets up IntersectionObserver
 * for .reveal-section elements. Extracted from layout to keep
 * the layout shell as a server component.
 */
export default function ScrollReveal() {
  const pathname = usePathname();

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
      if (initTimer !== null) clearTimeout(initTimer);
      window.removeEventListener("load", scheduleInit);
      io?.disconnect();
      mo?.disconnect();
    };
  }, [pathname]);

  return null;
}
