import type { ChainId, TokenAmount } from '@lifi/sdk';
import type { NFTProps } from '@lifi/widget';
import { FormKey, useWallet, useWatch } from '@lifi/widget';
import { Seaport } from '@opensea/seaport-js';
import { useQuery } from '@tanstack/react-query';
import type { FulfillmentDataResponse, NFTNetwork } from './types';
import { ChainId as OpenSeaChainId } from './types';
import { useOpenSeaOrder } from './useOpenSeaOrder';

export const useOpenSeaFulfillment = (
  network: NFTNetwork,
  contractAddress: string,
  tokenId: string | number,
) => {
  const { account, switchChain } = useWallet();
  const recipientAddress = useWatch({
    name: FormKey.ToAddress,
  });
  const { data: order, isLoading: isOrderLoading } = useOpenSeaOrder(
    network,
    contractAddress,
    tokenId,
  );
  const { data, isLoading } = useQuery(
    [
      'opensea-fulfillment',
      order?.orderHash,
      recipientAddress,
      account.address,
    ],
    async ({ queryKey: [, orderHash, recipientAddress, accountAddress] }) => {
      if (!order) {
        return;
      }

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
              hash: orderHash,
              chain: network,
              protocol_address: order.protocolAddress,
            },
            fulfiller: {
              address: accountAddress,
            },
          }),
        },
      ).then((response) => response.json());

      const orderV2 = { ...order };
      orderV2.protocolData = fulfillmentDataResponse.fulfillment_data.orders[0];

      const fulfillOrder = async () => {
        try {
          const seaport = new Seaport(account.signer as any, {
            seaportVersion: '1.5',
          });

          const { actions } = await seaport.fulfillOrder({
            order: orderV2.protocolData,
            accountAddress: account.address,
            recipientAddress: recipientAddress || account.address,
          });

          const transaction =
            await actions[0].transactionMethods.buildTransaction();
          const estimatedGas =
            await actions[0].transactionMethods.estimateGas();

          return {
            address: transaction.to,
            callData: transaction.data,
            gasLimit: estimatedGas.toString(),
          };
        } catch (error: any) {
          if (error.code === 'CALL_EXCEPTION') {
            const switched = await switchChain(
              OpenSeaChainId[network as NFTNetwork],
            );
            if (switched) {
              await fulfillOrder();
            } else {
              throw error;
            }
          } else {
            throw error;
          }
        }
      };
      const contract = await fulfillOrder();

      const asset = orderV2?.makerAssetBundle.assets[0];
      const owner = {
        name:
          orderV2?.maker.user?.username ||
          orderV2?.maker.address.substring(2, 8).toUpperCase(),
        url: `https://opensea.io/${
          orderV2?.maker.user?.username || orderV2?.maker.address
        }`,
      };
      const token: TokenAmount = {
        symbol:
          orderV2?.takerAssetBundle.assets[0]?.assetContract?.tokenSymbol!,
        amount: orderV2?.currentPrice!,
        decimals: orderV2?.takerAssetBundle.assets[0].decimals!,
        address: orderV2?.takerAssetBundle.assets[0].tokenAddress!,
        chainId: OpenSeaChainId[network as NFTNetwork] as number as ChainId,
        name: orderV2?.takerAssetBundle.assets[0]?.assetContract.tokenSymbol!,
        priceUSD: '',
      };

      const result: NFTProps = {
        imageUrl: asset?.imageUrl,
        collectionName: asset?.collection.name,
        assetName: asset?.name,
        owner: owner,
        token: token,
        contract: contract,
      };

      return result;
    },
    {
      enabled: Boolean(account.address) && Boolean(order),
    },
  );

  return {
    data,
    isLoading,
    order,
    isOrderLoading,
  };
};
