import { NFT } from '@lifi/widget';
import { Box, Typography } from '@mui/material';
import type { NFTOpenSeaProps } from './types';
import { useOpenSeaFulfillment } from './useOpenSeaFulfillment';

export const NFTOpenSea: React.FC<NFTOpenSeaProps> = ({
  network,
  contractAddress,
  tokenId,
}) => {
  const { data, order, isLoading, isOrderLoading } = useOpenSeaFulfillment(
    network,
    contractAddress,
    tokenId,
  );

  return !data && !order && !isLoading && !isOrderLoading ? (
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
        NFT you are trying to buy doesn't have active listings or we could not
        find them.
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
      contract={data?.contract}
    />
  );
};
