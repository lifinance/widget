import { useEffect, useRef, useState } from 'react';
import type { FormFieldNames } from '../stores';
import { useFieldValues } from '../stores';

export const useDebouncedWatch = <T extends FormFieldNames[]>(
  delay: number,
  ...name: T
) => {
  const watchedValue = useFieldValues(...name);
  const [debouncedValue, setDebouncedValue] = useState(watchedValue);
  const debouncedValueRef = useRef<typeof watchedValue>();
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
