"use client";

import { useEffect } from "react";

const TARGETS = 'a, button, summary, [role="button"], label, select, input[type="checkbox"], input[type="radio"]';

/** Draws a small ring where a button or link is clicked or tapped, so every click gives feedback. Look in effects.css. */
export default function ClickPulse() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onDown = (e: PointerEvent) => {
      const el = e.target instanceof Element ? e.target.closest(TARGETS) : null;
      if (!el || (el as HTMLButtonElement).disabled) return;
      const ring = document.createElement("span");
      ring.className = "click-pulse";
      ring.style.left = `${e.clientX}px`;
      ring.style.top = `${e.clientY}px`;
      ring.setAttribute("aria-hidden", "true");
      document.body.appendChild(ring);
      ring.addEventListener("animationend", () => ring.remove(), { once: true });
      setTimeout(() => ring.remove(), 800); // safety net
    };
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);
  return null;
}
