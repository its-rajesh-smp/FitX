"use client";

import { useEffect, useState } from "react";

/** Reveals `text` one character at a time while `active` is true. */
export function useTypewriter(text: string, active: boolean, speed = 32) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => {
      setCount((current) => Math.min(current + 1, text.length));
    }, speed);
    return () => {
      clearInterval(timer);
      setCount(0);
    };
  }, [active, speed, text]);

  return active ? text.slice(0, count) : "";
}
