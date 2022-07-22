/* eslint-disable react/no-array-index-key */
import { TokenAmount } from '@lifi/sdk';
import { Box, BoxProps, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useChains } from '../hooks';
import { formatTokenAmount } from '../utils';
import { TextFitter } from './TextFitter';
import { TokenAvatar } from './TokenAvatar';

export const Token: React.FC<{ token: TokenAmount } & BoxProps> = ({
  token,
  ...other
}) => {
  const { t } = useTranslation();
  const { getChainById } = useChains();
  return (
    <Box flex={1} {...other}>
      <Box display="flex" flex={1}>
        <TokenAvatar token={token} sx={{ marginRight: 2 }} />
        <TextFitter
          height={32}
          textStyle={{
            fontWeight: 700,
          }}
        >
          {formatTokenAmount(token.amount, token.decimals)}
        </TextFitter>
      </Box>
      <Typography
        fontSize={12}
        lineHeight={1}
        fontWeight="500"
        color="text.secondary"
        ml={6}
      >
        {t(`swap.tokenOnChain`, {
          tokenSymbol: token.symbol,
          chainName: getChainById(token.chainId)?.name,
        })}
      </Typography>
    </Box>
  );
};
