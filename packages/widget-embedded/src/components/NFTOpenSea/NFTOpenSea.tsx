import { switchChain } from '@lifi/wallet-management';
import type { WidgetContract } from '@lifi/widget';
import { NFT, useWallet } from '@lifi/widget';
import { Seaport } from '@opensea/seaport-js';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import type { NFTNetwork, NFTOpenSeaProps, OrdersQueryResponse } from './types';
import { ChainId } from './types';
import { deserializeOrder } from './utils';

export const NFTOpenSea: React.FC<NFTOpenSeaProps> = ({
  network,
  contractAddress,
  tokenId,
}) => {
  const { account } = useWallet();
  const [contract, setContract] = useState<WidgetContract>();
  const { data, isLoading } = useQuery(
    ['nft', network, contractAddress, tokenId],
    async ({ queryKey: [, network, contractAddress, tokenId] }) => {
      const response: OrdersQueryResponse = await fetch(
        `https://api.opensea.io/v2/orders/${network}/seaport/listings?asset_contract_address=${contractAddress}&token_ids=${tokenId}&order_by=created_date&order_direction=desc`,
        // `https://testnets-api.opensea.io/v2/orders/${network}/seaport/listings?limit=5`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            // 'X-API-KEY': '',
          },
        },
      ).then((response) => response.json());

      const deserializedOrder = deserializeOrder(response.orders[0]);
      return deserializedOrder;
    },
  );

  useEffect(() => {
    if (data && account.signer) {
      const fulfillOrder = async () => {
        try {
          const seaport = new Seaport(account.signer as any);
          const { actions } = await seaport.fulfillOrder({
            order: data?.protocolData,
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
  }, [data, network]);

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

  return (
    <NFT
      isLoading={isLoading}
      imageUrl={asset?.imageUrl}
      collectonName={asset?.collection.name}
      assetName={asset?.name}
      owner={owner}
      token={token}
      contract={contract}
    />
  );
};
