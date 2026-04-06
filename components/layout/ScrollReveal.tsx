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
    if (!("IntersectionObserver" in window)) {
      // Fallback: make everything visible immediately
      document
        .querySelectorAll(".reveal-section")
        .forEach((el) => el.classList.add("is-visible"));
      return;
    }

    let io: IntersectionObserver | null = null;
    let mo: MutationObserver | null = null;

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
        { rootMargin: "0px 0px -40px 0px", threshold: 0.01 },
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

    // Run immediately — no delay needed
    requestAnimationFrame(initRevealObserver);

    return () => {
      io?.disconnect();
      mo?.disconnect();
    };
  }, [pathname]);

  return null;
}
