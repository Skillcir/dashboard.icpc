"use client";

import { useEffect, useRef, useState } from "react";

const DURATION_MS = 900;

export function useCountUp(target: number) {
  const [value, setValue] = useState(target);
  const prevTarget = useRef(target);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion || target === prevTarget.current) {
      setValue(target);
      prevTarget.current = target;
      return;
    }

    const from = prevTarget.current;
    const start = performance.now();
    let frame: number;

    function tick(now: number) {
      const t = Math.min(1, (now - start) / DURATION_MS);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    prevTarget.current = target;
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return value;
}
