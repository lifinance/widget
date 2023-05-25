import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { isItemAllowed, useLiFi, useWidgetConfig } from '../providers';
import type { TokenAmount } from '../types';
import { useChains } from './useChains';
import { useFeaturedTokens } from './useFeaturedTokens';

export const useTokens = (selectedChainId?: number) => {
  const lifi = useLiFi();
  const { data, isLoading } = useQuery(['tokens'], () => lifi.getTokens(), {
    refetchInterval: 3_600_000,
  });
  const { getChainById, isLoading: isSupportedChainsLoading } = useChains();
  const featuredTokens = useFeaturedTokens(selectedChainId);
  const { tokens: configTokens, chains: configChains } = useWidgetConfig();

  const tokens = useMemo(() => {
    if (isSupportedChainsLoading) {
      return [];
    }
    const chainAllowed =
      selectedChainId &&
      getChainById(selectedChainId) &&
      isItemAllowed(selectedChainId, configChains);
    if (!chainAllowed) {
      return [];
    }
    let filteredTokens = data?.tokens[selectedChainId];
    const includedTokens = configTokens?.include?.filter(
      (token) => token.chainId === selectedChainId,
    );
    if (includedTokens?.length) {
      filteredTokens = filteredTokens
        ? [...includedTokens, ...filteredTokens]
        : includedTokens;
    }
    const allowedTokens = configTokens?.allow
      ?.filter((token) => token.chainId === selectedChainId)
      .map((token) => token.address);
    if (allowedTokens?.length) {
      filteredTokens = filteredTokens?.filter((token) =>
        allowedTokens.includes(token.address),
      );
    }
    const deniedTokenAddresses = configTokens?.deny
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
    const tokens = [
      ...(featuredTokens?.map((token) => {
        (token as TokenAmount).featured = true;
        return token;
      }) ?? []),
      ...(filteredTokens?.filter(
        (token) => !featuredTokenAddresses.has(token.address),
      ) ?? []),
    ] as TokenAmount[];

    return tokens;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    configChains,
    configTokens?.allow,
    configTokens?.deny,
    configTokens?.include,
    data?.tokens,
    data,
    featuredTokens,
    getChainById,
    isSupportedChainsLoading,
    selectedChainId,
  ]);

  return {
    tokens,
    isLoading,
  };
};
