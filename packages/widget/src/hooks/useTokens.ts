import { useQuery } from 'react-query';
import { LiFi } from '../lifi';

export const useTokens = (selectedChainId: number) => {
  const {
    data: tokens,
    isLoading,
    isFetching,
  } = useQuery(['tokens', selectedChainId], async () => {
    const data = await LiFi.getPossibilities({ include: ['tokens'] });
    return data.tokens?.filter((token) => token.chainId === selectedChainId);
    // .sort((a, b) => (a.symbol > b.symbol ? 1 : -1));
  });
  return {
    tokens,
    isLoading,
    isFetching,
  };
};
