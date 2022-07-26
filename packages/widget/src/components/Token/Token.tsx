/* eslint-disable react/no-array-index-key */
import { TokenAmount } from '@lifi/sdk';
import { Box, BoxProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useChains } from '../../hooks';
import { formatTokenAmount } from '../../utils';
import { TextFitter } from '../TextFitter';
import { TokenAvatar } from '../TokenAvatar';
import { TextSecondary } from './Token.style';

export const Token: React.FC<
  { token: TokenAmount; connected?: boolean } & BoxProps
> = ({ token, connected, ...other }) => {
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
      <TextSecondary connected={connected}>
        {t(`swap.tokenOnChain`, {
          tokenSymbol: token.symbol,
          chainName: getChainById(token.chainId)?.name,
        })}
      </TextSecondary>
    </Box>
  );
};
