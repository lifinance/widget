import { useEffect, useState } from 'react';
import { useWatch } from 'react-hook-form';

export const useDebouncedWatch = (name: any, delay: number) => {
  const watchedValue = useWatch({
    name,
  });
  const [debouncedValue, setDebouncedValue] = useState(watchedValue);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(watchedValue), delay);
    return () => clearTimeout(handler);
  }, [delay, watchedValue]);

  return debouncedValue;
};
