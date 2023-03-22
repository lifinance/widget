import { isAddress } from '@ethersproject/address';
import type { Provider } from '@ethersproject/providers';
import type { Token, TokenAmount } from '@lifi/sdk';
import { useCallback } from 'react';
import { useLiFi } from '../providers';

export const useGetTokenBalancesWithRetry = (provider?: Provider) => {
  const lifi = useLiFi();

  const getTokenBalancesWithRetry = useCallback(
    async (
      accountAddress: string,
      tokens: Token[],
      depth = 0,
    ): Promise<TokenAmount[] | undefined> => {
      try {
        const walletAddress = isAddress(accountAddress)
          ? accountAddress
          : await provider?.resolveName(accountAddress);

        const tokenBalances = await lifi.getTokenBalances(
          walletAddress as string,
          tokens,
        );
        if (!tokenBalances.every((token) => token.blockNumber)) {
          if (depth > 10) {
            console.warn('Token balance backoff depth exceeded.');
            return undefined;
          }
          await new Promise((resolve) => {
            setTimeout(resolve, 1.5 ** depth * 100);
          });
          return getTokenBalancesWithRetry(accountAddress, tokens, depth + 1);
        }
        return tokenBalances;
      } catch (error) {
        //
      }
    },
    [lifi, provider],
  );

  return getTokenBalancesWithRetry;
};
