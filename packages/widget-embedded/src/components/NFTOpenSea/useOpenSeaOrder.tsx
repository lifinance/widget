import { useQuery } from '@tanstack/react-query';
import type { NFTNetwork, OrdersQueryResponse } from './types';
import { deserializeOrder } from './utils';

export const useOpenSeaOrder = (
  network: NFTNetwork,
  contractAddress: string,
  tokenId: string | number,
) => {
  return useQuery(
    ['opensea-order', network, contractAddress, tokenId],
    async ({ queryKey: [, network, contractAddress, tokenId] }) => {
      const ordersQueryResponse: OrdersQueryResponse = await fetch(
        `https://api.opensea.io/v2/orders/${network}/seaport/listings?asset_contract_address=${contractAddress}&token_ids=${tokenId}&order_by=created_date&order_direction=desc`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'X-API-KEY': import.meta.env.VITE_OPENSEA_API_KEY,
          },
        },
      ).then((response) => response.json());

      if (!ordersQueryResponse?.orders?.[0]) {
        return;
      }

      return deserializeOrder(ordersQueryResponse.orders[0]);
    },
    {
      enabled: Boolean(network) && Boolean(contractAddress),
    },
  );
};
