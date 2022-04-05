import LiFi from '@lifinance/sdk';
import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { useWidgetConfig } from '../providers/WidgetProvider';

export const useChains = () => {
  const { enabledChains } = useWidgetConfig();
  const { data, isLoading } = useQuery(['chains'], async () => {
    const possibilities = await LiFi.getPossibilities({ include: ['chains'] });
    return possibilities?.chains?.filter((chain) =>
      enabledChains.includes(chain.id),
    );
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

  return { chains: data, isLoading, getChainById };
};
