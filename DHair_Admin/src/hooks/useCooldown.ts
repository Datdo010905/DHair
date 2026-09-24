import { useCallback, useEffect, useState } from "react";

export default function useCooldown(seconds = 60) {
  const [endsAt, setEndsAt] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const startCooldown = useCallback(() => {
    setEndsAt(Date.now() + seconds * 1000);
    setRemainingSeconds(seconds);
  }, [seconds]);

  useEffect(() => {
    if (!endsAt) return;

    const timer = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      setRemainingSeconds(remaining);
      if (remaining === 0) {
        window.clearInterval(timer);
        setEndsAt(0);
      }
    }, 250);

    return () => window.clearInterval(timer);
  }, [endsAt]);

  return { remainingSeconds, startCooldown };
}
