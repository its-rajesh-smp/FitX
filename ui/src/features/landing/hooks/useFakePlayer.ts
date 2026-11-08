import { useEffect, useState } from "react";

/** A pretend video player: counts seconds while playing and stops at the end. */
export function useFakePlayer(duration: number) {
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setElapsed((current) => {
        if (current + 1 >= duration) {
          setPlaying(false);
          return duration;
        }
        return current + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [duration, playing]);

  const toggle = () => {
    if (!playing && elapsed >= duration) setElapsed(0);
    setPlaying((current) => !current);
  };

  return { playing, elapsed, progress: elapsed / duration, toggle };
}
