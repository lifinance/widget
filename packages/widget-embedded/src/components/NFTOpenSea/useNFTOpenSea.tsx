import type { WidgetContract } from '@lifi/widget';
import { Seaport } from '@opensea/seaport-js';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useWallet } from '../../providers/WalletProvider';
import type {
  FulfillmentDataResponse,
  NFTNetwork,
  NFTOpenSeaProps,
  OrdersQueryResponse,
} from './types';
import { ChainId } from './types';
import { deserializeOrder } from './utils';

export const useNFTOpenSea = ({
  network,
  contractAddress,
  tokenId,
}: NFTOpenSeaProps) => {
  const { account, switchChain } = useWallet();
  const [contract, setContract] = useState<WidgetContract>();
  const { data, isLoading } = useQuery(
    ['nft', network, contractAddress, tokenId, account.address],
    async ({
      queryKey: [, network, contractAddress, tokenId, accountAddress],
    }) => {
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

      const fulfillmentDataResponse: FulfillmentDataResponse = await fetch(
        `https://api.opensea.io/v2/listings/fulfillment_data`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'X-API-KEY': import.meta.env.VITE_OPENSEA_API_KEY,
          },
          body: JSON.stringify({
            listing: {
              hash: ordersQueryResponse.orders[0].order_hash,
              chain: network,
              protocol_address: '0x00000000000001ad428e4906aE43D8F9852d0dD6',
            },
            fulfiller: {
              address: accountAddress,
            },
          }),
        },
      ).then((response) => response.json());

      const deserializedOrder = deserializeOrder(ordersQueryResponse.orders[0]);
      deserializedOrder.protocolData =
        fulfillmentDataResponse.fulfillment_data.orders[0];
      return deserializedOrder;
    },
    {
      enabled: Boolean(account.isActive),
    },
  );

  console.log(account);

  useEffect(() => {
    if (data && account.signer) {
      const fulfillOrder = async () => {
        try {
          const seaport = new Seaport(account.signer as any);

          const { actions } = await seaport.fulfillOrder({
            order: data.protocolData,
            accountAddress: account.address,
            recipientAddress: account.address,
          });

          const transaction =
            await actions[0].transactionMethods.buildTransaction();
          const estimatedGas =
            await actions[0].transactionMethods.estimateGas();

          setContract({
            address: transaction.to,
            callData: transaction.data,
            gasLimit: estimatedGas.toString(),
          });
        } catch (error: any) {
          if (error.code === 'CALL_EXCEPTION') {
            const switched = await switchChain(ChainId[network as NFTNetwork]);
            if (switched) {
              fulfillOrder();
            }
          } else {
            console.warn(error);
          }
        }
      };
      fulfillOrder();
    }
  }, [account.address, account.signer, data, network, switchChain]);

  const asset = data?.makerAssetBundle.assets[0];
  const owner = {
    name:
      data?.maker.user?.username ||
      data?.maker.address.substring(2, 8).toUpperCase(),
    url: `https://opensea.io/${
      data?.maker.user?.username || data?.maker.address
    }`,
  };
  const token = {
    symbol: data?.takerAssetBundle.assets[0]?.assetContract?.tokenSymbol!,
    amount: data?.currentPrice!,
    decimals: data?.takerAssetBundle.assets[0].decimals!,
    address: data?.takerAssetBundle.assets[0].tokenAddress!,
    chainId: ChainId[network],
    name: data?.takerAssetBundle.assets[0]?.assetContract.tokenSymbol!,
  };

  return {
    isLoading: isLoading,
    imageUrl: asset?.imageUrl,
    collectonName: asset?.collection.name,
    assetName: asset?.name,
    owner: owner,
    token: token,
    contract: contract,
  };
};
