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
  });
  return {
    tokens,
    isLoading,
    isFetching,
  };
};
