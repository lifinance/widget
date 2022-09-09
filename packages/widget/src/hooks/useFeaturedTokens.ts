import { useMemo } from 'react';
import { useWidgetConfig } from '../providers';

export const useFeaturedTokens = (selectedChainId?: number) => {
  const { featuredTokens, tokens } = useWidgetConfig();

  return useMemo(
    () =>
      [...(tokens?.featured ?? []), ...(featuredTokens ?? [])].filter(
        (token) => token.chainId === selectedChainId,
      ),
    [featuredTokens, selectedChainId, tokens?.featured],
  );
};
