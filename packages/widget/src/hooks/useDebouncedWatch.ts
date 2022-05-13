import { useEffect, useRef, useState } from 'react';
import { useWatch } from 'react-hook-form';

export const useDebouncedWatch = (name: any, delay: number) => {
  const watchedValue = useWatch({
    name,
  });
  const [debouncedValue, setDebouncedValue] = useState(watchedValue);
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      const handler = setTimeout(() => {
        setDebouncedValue(watchedValue);
      }, delay);
      return () => clearTimeout(handler);
    }
    isMounted.current = true;
    return undefined;
  }, [delay, watchedValue]);

  return debouncedValue;
};
