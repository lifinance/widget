import { useMemo } from 'react';
import { useSwapPossibilities } from './useSwapPossibilities';

export const useBridges = () => {
  const { data } = useSwapPossibilities('bridges');
  const bridges = useMemo(() => {
    const bridges = data?.bridges
      ?.map((bridge: any) => bridge.tool)
      .map((bridegTool: string) => bridegTool.split('-')[0]);
    return Array.from(new Set(bridges));
  }, [data?.bridges]);
  return bridges;
};
