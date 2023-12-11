import { useEffect, useRef, useState } from 'react';
import { useFieldValues } from '../stores';

export const useDebouncedWatch = (name: any, delay: number) => {
  const watchedValue = useFieldValues(...name);
  const [debouncedValue, setDebouncedValue] = useState(watchedValue);
  const debouncedValueRef = useRef<any>();
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      const hasWatchedValue = watchedValue.some((value) => value);
      if (hasWatchedValue) {
        const handler = setTimeout(() => {
          setDebouncedValue(watchedValue);
        }, delay);
        return () => clearTimeout(handler);
      }
      debouncedValueRef.current = watchedValue;
      setDebouncedValue(watchedValue);
      return undefined;
    }
    isMounted.current = true;
    return undefined;
  }, [delay, watchedValue]);

  return debouncedValue;
};
