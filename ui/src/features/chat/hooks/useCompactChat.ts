import { useEffect, useRef, useState } from "react";

export function useCompactChat(isLoading: boolean) {
  const contentRef = useRef<HTMLElement>(null);
  const [isCompact, setIsCompact] = useState(() => window.innerWidth < 640);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const observer = new ResizeObserver(([entry]) => {
      setIsCompact(entry.contentRect.width < 480);
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, [isLoading]);

  return { contentRef, isCompact };
}

