import { Box, Link, Skeleton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Token } from '../Token';
import { PreviewAvatar } from './NFT.style';
import type { NFTProps } from './types';

export const NFTBase: React.FC<NFTProps> = ({
  imageUrl,
  isLoading,
  collectionName,
  assetName,
  owner,
  token,
}) => {
  const { t } = useTranslation();
  return (
    <Box p={2}>
      <Box display="flex">
        {isLoading ? (
          <Skeleton
            width={96}
            height={96}
            variant="rectangular"
            sx={{ borderRadius: 1 }}
          />
        ) : (
          <PreviewAvatar src={imageUrl} />
        )}
        <Box ml={2}>
          {isLoading ? (
            <Skeleton width={144} height={21} variant="text" />
          ) : (
            <Typography fontSize={14} color="text.secondary">
              {collectionName}
            </Typography>
          )}
          {isLoading ? (
            <Skeleton width={112} height={27} variant="text" />
          ) : (
            <Typography fontSize={18} fontWeight={600}>
              {assetName}
            </Typography>
          )}
          {isLoading ? (
            <Skeleton width={128} height={21} variant="text" />
          ) : owner ? (
            <Typography fontSize={14} color="text.secondary">
              {t('main.ownedBy')}{' '}
              <Link
                href={owner.url}
                target="_blank"
                underline="none"
                color="primary"
              >
                {owner.name}
              </Link>
            </Typography>
          ) : null}
        </Box>
      </Box>
      <Token token={token} isLoading={isLoading} mt={2} />
    </Box>
  );
};
