import { useEffect, useState } from 'react';
import { useWatch } from 'react-hook-form';

export const useDebouncedWatch = (name: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState([]);
  const watchedValue = useWatch({
    name,
  });

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(watchedValue), delay);
    return () => clearTimeout(handler);
  }, [delay, watchedValue]);

  return debouncedValue;
};
