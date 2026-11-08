import { useCallback, useState } from "react";

export function useToggleSet<T>(initial: readonly T[] = []) {
  const [selected, setSelected] = useState<ReadonlySet<T>>(() => new Set(initial));

  const toggle = useCallback((item: T) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  }, []);

  const reset = useCallback((items: readonly T[] = []) => setSelected(new Set(items)), []);

  return { selected, toggle, reset };
}
