import LiFi from '@lifinance/sdk';
import { useMemo } from 'react';
import { useQuery } from 'react-query';

export const useBridges = () => {
  const { data } = useQuery(['bridges'], () =>
    LiFi.getPossibilities({ include: ['bridges'] }),
  );
  const bridges = useMemo(() => {
    const bridges = data?.bridges
      ?.map((bridge: any) => bridge.tool)
      .map((bridegTool: string) => bridegTool.split('-')[0]);
    return Array.from(new Set(bridges));
  }, [data?.bridges]);
  return bridges;
};
