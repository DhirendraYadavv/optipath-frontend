"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** How long the closing animation runs. Keep in step with the 0.22s closing animations in effects.css. */
export const EXIT_MS = 220;

/**
 * For a pop-up whose open/closed state lives in the parent: keep it on screen while it plays its closing animation.
 *   const box = useExit(showBox);   {box.mounted && <div data-closing={box.closing} role="dialog" ...>}
 */
export function useExit(open: boolean, ms: number = EXIT_MS): { mounted: boolean; closing: boolean } {
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);
  const [prev, setPrev] = useState(open);

  // React's "adjust state while rendering" pattern, so no effect is needed to notice the change.
  if (open !== prev) {
    setPrev(open);
    if (open) {
      setMounted(true);
      setClosing(false);
    } else {
      setClosing(true);
    }
  }

  useEffect(() => {
    if (!closing) return;
    const timer = setTimeout(() => {
      setMounted(false);
      setClosing(false);
    }, ms);
    return () => clearTimeout(timer);
  }, [closing, ms]);

  return { mounted, closing };
}

/**
 * For a pop-up that is shown by its parent and closes itself through an onClose prop: play the animation, then call onClose.
 *   const { closing, close } = useCloseDelay(onClose);
 */
export function useCloseDelay(onClose: () => void, ms: number = EXIT_MS): { closing: boolean; close: () => void } {
  const [closing, setClosing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const close = useCallback(() => {
    if (closing) return;
    setClosing(true);
    timer.current = setTimeout(onClose, ms);
  }, [closing, onClose, ms]);

  return { closing, close };
}
