import { useQuery } from '@tanstack/react-query';
import { isItemAllowed, useLiFi, useWidgetConfig } from '../providers';
import type { Token } from '../types';
import { useChains } from './useChains';
import { useFeaturedTokens } from './useFeaturedTokens';

export const useTokens = (selectedChainId?: number) => {
  const lifi = useLiFi();
  const { getChainById, isLoading: isSupportedChainsLoading } = useChains();
  const featuredTokens = useFeaturedTokens(selectedChainId);
  const { tokens, chains, disabledChains } = useWidgetConfig();
  const { data, isLoading } = useQuery(
    [
      'tokens',
      selectedChainId,
      featuredTokens?.length,
      tokens?.allow?.length,
      tokens?.deny?.length,
      chains?.allow?.length,
      chains?.deny?.length,
    ],
    async () => {
      const chainAllowed =
        selectedChainId &&
        getChainById(selectedChainId) &&
        isItemAllowed(selectedChainId, chains, disabledChains);
      if (!chainAllowed) {
        return [];
      }
      let filteredTokens = tokens?.allow?.filter(
        (token) => token.chainId === selectedChainId,
      );
      if (!filteredTokens?.length) {
        const data = await lifi.getTokens({ chains: [selectedChainId] });
        filteredTokens = data.tokens?.[selectedChainId];
      }
      const deniedTokenAddresses = tokens?.deny
        ?.filter((token) => token.chainId === selectedChainId)
        .map((token) => token.address);
      if (deniedTokenAddresses?.length) {
        filteredTokens = filteredTokens?.filter(
          (token) => !deniedTokenAddresses.includes(token.address),
        );
      }
      const featuredTokenAddresses = new Set(
        featuredTokens?.map((token) => token.address),
      );
      return [
        ...(featuredTokens?.map((token) => {
          (token as Token).featured = true;
          return token;
        }) ?? []),
        ...(filteredTokens?.filter(
          (token) => !featuredTokenAddresses.has(token.address),
        ) ?? []),
      ] as Token[];
    },
    {
      enabled: !isSupportedChainsLoading,
    },
  );
  return {
    tokens: data,
    isLoading,
  };
};
