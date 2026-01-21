import { useEffect, useState } from 'react';

export default function useCounter(target: number, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = target;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setValue(Math.floor(start));
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration]);

  return value;
}
