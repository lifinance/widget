import type { ChainId, TokenAmount } from '@lifi/sdk';
import { NFTBase } from '@lifi/widget';
import type { NFTNetwork, NFTOpenSeaProps } from './types';
import { ChainId as OpenSeaChainId } from './types';
import { useOpenSeaOrder } from './useOpenSeaOrder';

export const NFTOpenSeaSecondary: React.FC<NFTOpenSeaProps> = ({
  network,
  contractAddress,
  tokenId,
}) => {
  const { data: order, isLoading: isOrderLoading } = useOpenSeaOrder(
    network,
    contractAddress,
    tokenId,
  );

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

  return (
    <NFTBase
      isLoading={isOrderLoading}
      imageUrl={asset?.imageUrl}
      collectionName={asset?.collection.name}
      assetName={asset?.name}
      owner={owner}
      token={token}
    />
  );
};
