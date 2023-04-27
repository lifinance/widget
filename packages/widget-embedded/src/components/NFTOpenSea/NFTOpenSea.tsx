import type { ChainId, TokenAmount } from '@lifi/sdk';
import type { WidgetContract } from '@lifi/widget';
import { NFT, useWallet } from '@lifi/widget';
import { Box, Typography } from '@mui/material';
import { Seaport } from '@opensea/seaport-js';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import type {
  FulfillmentDataResponse,
  NFTNetwork,
  NFTOpenSeaProps,
  OrdersQueryResponse,
} from './types';
import { ChainId as OpenSeaChainId } from './types';
import { deserializeOrder } from './utils';

export const NFTOpenSea: React.FC<NFTOpenSeaProps> = ({
  network,
  contractAddress,
  tokenId,
}) => {
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

      if (!ordersQueryResponse.orders[0]) {
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

      const order = deserializeOrder(ordersQueryResponse.orders[0]);
      order.protocolData = fulfillmentDataResponse.fulfillment_data.orders[0];

      const fulfillOrder = async () => {
        try {
          const seaport = new Seaport(account.signer as any);

          const { actions } = await seaport.fulfillOrder({
            order: order.protocolData,
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
      await fulfillOrder();

      const asset = order?.makerAssetBundle.assets[0];
      const owner = {
        name:
          order?.maker.user?.username ||
          order?.maker.address.substring(2, 8).toUpperCase(),
        url: `https://opensea.io/${
          order?.maker.user?.username || order?.maker.address
        }`,
      };
      const token: TokenAmount = {
        symbol: order?.takerAssetBundle.assets[0]?.assetContract?.tokenSymbol!,
        amount: order?.currentPrice!,
        decimals: order?.takerAssetBundle.assets[0].decimals!,
        address: order?.takerAssetBundle.assets[0].tokenAddress!,
        chainId: OpenSeaChainId[network as NFTNetwork] as number as ChainId,
        name: order?.takerAssetBundle.assets[0]?.assetContract.tokenSymbol!,
        priceUSD: '',
      };

      return {
        imageUrl: asset?.imageUrl,
        collectionName: asset?.collection.name,
        assetName: asset?.name,
        owner: owner,
        token: token,
        contract: contract,
      };
    },
    {
      enabled: Boolean(account.address),
    },
  );

  return !data && !isLoading ? (
    <Box
      p={2}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 192,
      }}
    >
      <Typography fontSize={18} fontWeight={600} p={2}>
        Oops, NFT listing not found
      </Typography>
      <Typography>
        NFT you are trying to buy doesn't have active listings.
      </Typography>
    </Box>
  ) : (
    <NFT
      isLoading={isLoading}
      imageUrl={data?.imageUrl}
      collectionName={data?.collectionName}
      assetName={data?.assetName}
      owner={data?.owner}
      token={data?.token}
      contract={contract}
    />
  );
};
