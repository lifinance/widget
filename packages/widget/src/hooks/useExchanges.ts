import { useMemo } from 'react';
import { useSwapPossibilities } from './useSwapPossibilities';

export const useExchanges = () => {
  const { data } = useSwapPossibilities('exchanges');
  const exchanges = useMemo(() => {
    const exchanges = data?.exchanges
      ?.map((exchange: any) => exchange.tool)
      .map((exchangeTool: string) => exchangeTool.split('-')[0]);
    return Array.from(new Set(exchanges));
  }, [data?.exchanges]);
  return exchanges;
};
