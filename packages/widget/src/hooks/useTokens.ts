import { useQuery } from 'react-query';
import { LiFi } from '../lifi';

export const useTokens = (selectedChainId: number) => {
  const {
    data: tokens,
    isLoading,
    isFetching,
  } = useQuery(['tokens', selectedChainId], async () => {
    const data = await LiFi.getTokens({ chains: [selectedChainId] });
    return data.tokens?.[selectedChainId];
    // .sort((a, b) => (a.symbol > b.symbol ? 1 : -1));
  });
  return {
    tokens,
    isLoading,
    isFetching,
  };
};
