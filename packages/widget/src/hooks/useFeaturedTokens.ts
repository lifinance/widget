import { useMemo } from 'react';
import { useWidgetConfig } from '../providers';

export const useFeaturedTokens = (selectedChainId: number) => {
  const { featuredTokens } = useWidgetConfig();

  return useMemo(
    () => featuredTokens?.filter((token) => token.chainId === selectedChainId),
    [featuredTokens, selectedChainId],
  );
};
