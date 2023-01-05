import { useMemo } from 'react';
import { useTokens } from './useTokens';
import { useTokenSearch } from './useTokenSearch';

export const useToken = (chainId?: number, tokenAddress?: string) => {
  const { tokens, isLoading } = useTokens(chainId);

  const token = useMemo(() => {
    const token = tokens?.find(
      (token) => token.address === tokenAddress && token.chainId === chainId,
    );
    return token;
  }, [chainId, tokenAddress, tokens]);

  const tokenSearchEnabled = !isLoading && !token;
  const { token: searchedToken, isLoading: isSearchedTokenLoading } =
    useTokenSearch(chainId, tokenAddress, tokenSearchEnabled);

  return {
    token: token ?? searchedToken,
    isLoading: isLoading || (tokenSearchEnabled && isSearchedTokenLoading),
  };
};
