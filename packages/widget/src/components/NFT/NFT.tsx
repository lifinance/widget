import type { BoxProps } from '@mui/material';
import { Box, Link, Skeleton, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FormKey } from '../../providers';
import { Token } from '../Token';
import { PreviewAvatar } from './NFT.style';
import type { NFTProps } from './types';

export const NFT: React.FC<BoxProps & NFTProps> = ({
  imageUrl,
  isLoading,
  collectionName,
  assetName,
  owner,
  token,
  contract,
  ...props
}) => {
  const { t } = useTranslation();
  const { setValue } = useFormContext();
  useEffect(() => {
    if (token) {
      setValue(FormKey.ToChain, token.chainId);
      setValue(FormKey.ToToken, token.address);
      setValue(FormKey.ToAmount, token.amount);
    }
    if (contract) {
      setValue(FormKey.ToContractAddress, contract.address);
      setValue(FormKey.ToContractCallData, contract.callData);
      setValue(FormKey.ToContractGasLimit, contract.gasLimit);
    }
  }, [contract, setValue, token]);
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
