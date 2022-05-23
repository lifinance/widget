import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { LiFi } from '../lifi';

export const useExchanges = () => {
  const { data } = useQuery(['exchanges'], ({ signal }) =>
    LiFi.getPossibilities({ include: ['exchanges'] }, { signal }),
  );
  const exchanges = useMemo(() => {
    const exchanges = data?.exchanges
      ?.map((exchange: any) => exchange.tool)
      .map((exchangeTool: string) => exchangeTool.split('-')[0]);
    return Array.from(new Set(exchanges));
  }, [data?.exchanges]);
  return exchanges;
};
