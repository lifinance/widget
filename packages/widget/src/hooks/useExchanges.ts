import LiFi from '@lifinance/sdk';
import { useMemo } from 'react';
import { useQuery } from 'react-query';

export const useExchanges = () => {
  const { data } = useQuery(['exchanges'], () =>
    LiFi.getPossibilities({ include: ['exchanges'] }),
  );
  const exchanges = useMemo(() => {
    const exchanges = data?.exchanges
      ?.map((exchange: any) => exchange.tool)
      .map((exchangeTool: string) => exchangeTool.split('-')[0]);
    return Array.from(new Set(exchanges));
  }, [data?.exchanges]);
  return exchanges;
};
