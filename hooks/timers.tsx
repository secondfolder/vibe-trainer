// based on https://overreacted.io/making-setinterval-declarative-with-react-hooks/

import { useEffect, useRef } from 'react';

export function useInterval(
  callback: () => void,
  delay: number | null
) {
  return useTimer(callback, delay, true)
}

export function useTimeout(
  callback: () => void,
  delay: number | null
) {
  return useTimer(callback, delay, false)
}

export function useTimer(
  callback: () => void,
  delay: number | null,
  repeat: boolean
) {
  const savedCallback = useRef(callback);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = repeat ? setInterval(tick, delay) : setTimeout(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}