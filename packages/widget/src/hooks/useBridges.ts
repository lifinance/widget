import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { LiFi } from '../lifi';

export const useBridges = () => {
  const { data } = useQuery(['bridges'], ({ signal }) =>
    LiFi.getPossibilities({ include: ['bridges'] }, { signal }),
  );
  const bridges = useMemo(() => {
    const bridges = data?.bridges
      ?.map((bridge: any) => bridge.tool)
      .map((bridegTool: string) => bridegTool.split('-')[0]);
    return Array.from(new Set(bridges));
  }, [data?.bridges]);
  return bridges;
};
