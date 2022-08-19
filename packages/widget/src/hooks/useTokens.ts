import { useQuery } from '@tanstack/react-query';
import { LiFi } from '../config/lifi';
import type { Token } from '../types';
import { useFeaturedTokens } from './useFeaturedTokens';

export const useTokens = (selectedChainId: number) => {
  const featuredTokens = useFeaturedTokens(selectedChainId);
  const {
    data: tokens,
    isLoading,
    isFetching,
  } = useQuery(
    ['tokens', selectedChainId, featuredTokens?.length],
    async () => {
      const data = await LiFi.getTokens({ chains: [selectedChainId] });
      const featuredTokenAddresses = new Set(
        featuredTokens?.map((token) => token.address),
      );
      return [
        ...(featuredTokens?.map((token) => {
          (token as Token).featured = true;
          return token;
        }) ?? []),
        ...(data.tokens?.[selectedChainId].filter(
          (token) => !featuredTokenAddresses.has(token.address),
        ) ?? []),
      ] as Token[];
    },
  );
  return {
    tokens,
    isLoading,
    isFetching,
  };
};
