import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { LiFi } from '../config/lifi';
import { useWidgetConfig } from '../providers/WidgetProvider';

export const useChains = () => {
  const { disabledChains } = useWidgetConfig();
  const { data, ...other } = useQuery(['chains'], async () => {
    const chains = await LiFi.getChains();
    return chains.filter((chain) => !disabledChains?.includes(chain.id));
  });

  const getChainById = useCallback(
    (chainId: number) => {
      const chain = data?.find((chain) => chain.id === chainId);
      // if (!chain) {
      //   throw new Error('Chain not found or chainId is invalid.');
      // }
      return chain;
    },
    [data],
  );

  return { chains: data, getChainById, ...other };
};
