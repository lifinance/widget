import { useEffect, useMemo, useRef, useState } from 'react';
import { useFieldValues } from '../stores';

export const useDebouncedWatch = (name: any, delay: number) => {
  const [watchedValue] = useFieldValues(...name);
  const [debouncedValue, setDebouncedValue] = useState(watchedValue);
  const debouncedValueRef = useRef<any>();
  const isMounted = useRef(false);

  const memoisedWatchedValue = useMemo(() => watchedValue, [watchedValue]);

  useEffect(() => {
    if (isMounted.current) {
      const hasWatchedValue = Boolean(memoisedWatchedValue);
      if (hasWatchedValue) {
        const handler = setTimeout(() => {
          setDebouncedValue(memoisedWatchedValue);
        }, delay);
        return () => clearTimeout(handler);
      }
      debouncedValueRef.current = memoisedWatchedValue;
      setDebouncedValue(memoisedWatchedValue);
      return undefined;
    }
    isMounted.current = true;
    return undefined;
  }, [delay, memoisedWatchedValue]);

  return debouncedValue;
};
