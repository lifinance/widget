import { ChainType, getTokens } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js';
import type { TokenAmount } from '../types/token.js';
import { useChains } from './useChains.js';

export const useTokens = (selectedChainId?: number) => {
  const { tokens: configTokens } = useWidgetConfig();
  const { data, isLoading } = useQuery({
    queryKey: ['tokens'],
    queryFn: () => getTokens({ chainTypes: [ChainType.EVM, ChainType.SVM] }),
    refetchInterval: 3_600_000,
  });
  const {
    chains,
    isLoading: isSupportedChainsLoading,
    getChainById,
  } = useChains();

  const filteredData = useMemo(() => {
    if (isSupportedChainsLoading || !data) {
      return;
    }
    const chain = getChainById(selectedChainId, chains);
    const chainAllowed = selectedChainId && chain;
    if (!chainAllowed) {
      return;
    }
    let filteredTokens = data.tokens?.[selectedChainId] || [];
    const includedTokens = configTokens?.include?.filter(
      (token) => token.chainId === selectedChainId,
    );
    if (includedTokens?.length) {
      filteredTokens = [...includedTokens, ...filteredTokens];
    }

    if (configTokens?.allow?.length || configTokens?.deny?.length) {
      const allowedTokensSet = new Set(
        configTokens?.allow
          ?.filter((token) => token.chainId === selectedChainId)
          .map((token) => token.address),
      );

      const deniedTokenAddressesSet = new Set(
        configTokens?.deny
          ?.filter((token) => token.chainId === selectedChainId)
          .map((token) => token.address),
      );

      if (allowedTokensSet.size || deniedTokenAddressesSet.size) {
        filteredTokens = filteredTokens.filter(
          (token) =>
            (!allowedTokensSet.size || allowedTokensSet.has(token.address)) &&
            !deniedTokenAddressesSet.has(token.address),
        );
      }
    }
    const filteredTokensMap = new Map(
      filteredTokens.map((token) => [token.address, token]),
    );

    const [popularTokens, featuredTokens] = (
      ['popular', 'featured'] as ('popular' | 'featured')[]
    ).map((tokenType) => {
      const typedConfigTokens = configTokens?.[tokenType]?.filter(
        (token) => token.chainId === selectedChainId,
      );

      const populatedConfigTokens = typedConfigTokens?.map((token) => {
        // Mark token as popular
        (token as TokenAmount)[tokenType] = true;
        // Check if this token exists in the filteredTokensMap and add priceUSD if it does
        const matchingFilteredToken = filteredTokensMap.get(token.address);
        if (matchingFilteredToken?.priceUSD) {
          (token as TokenAmount).priceUSD = matchingFilteredToken.priceUSD;
        }
        if (!token.logoURI && matchingFilteredToken) {
          (token as TokenAmount).logoURI = matchingFilteredToken.logoURI;
        }
        return token;
      }) as TokenAmount[];

      if (populatedConfigTokens?.length) {
        const configTokenAddresses = new Set(
          populatedConfigTokens?.map((token) => token.address),
        );
        filteredTokens = filteredTokens.filter(
          (token) => !configTokenAddresses.has(token.address),
        );
        populatedConfigTokens.push(...filteredTokens);
        filteredTokens = populatedConfigTokens;
      }

      return populatedConfigTokens;
    });

    return {
      tokens: filteredTokens,
      featuredTokens,
      popularTokens,
      chain,
    };
  }, [
    chains,
    configTokens,
    data,
    getChainById,
    isSupportedChainsLoading,
    selectedChainId,
  ]);

  return {
    tokens: filteredData?.tokens,
    featuredTokens: filteredData?.featuredTokens,
    popularTokens: filteredData?.popularTokens,
    chain: filteredData?.chain,
    isLoading,
  };
};
