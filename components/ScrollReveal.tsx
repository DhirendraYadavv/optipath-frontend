"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Fades and lifts every element marked data-reveal as it scrolls into view, once. Mount it once in the layout. */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (typeof IntersectionObserver === "undefined") return; // old browser: leave everything visible
    root.classList.add("reveal-ready");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    document.querySelectorAll("[data-reveal]:not(.in-view)").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
