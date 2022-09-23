/* eslint-disable react/no-array-index-key */
import type { Step, TokenAmount } from '@lifi/sdk';
import type { BoxProps } from '@mui/material';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useChains } from '../../hooks';
import { formatTokenAmount } from '../../utils';
import { SmallAvatar } from '../SmallAvatar';
import { TextFitter } from '../TextFitter';
import { TokenAvatar } from '../TokenAvatar';
import { TextSecondary } from './Token.style';

export const Token: React.FC<
  { token: TokenAmount; connected?: boolean; step?: Step } & BoxProps
> = ({ token, connected, step, ...other }) => {
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
      <Box display="flex">
        <TextSecondary connected={connected}>
          {t(`swap.tokenOnChain`, {
            tokenSymbol: token.symbol,
            chainName: getChainById(token.chainId)?.name,
          })}
        </TextSecondary>
        {step ? (
          <Box display="flex" alignItems="flex-end" height={12} mt={0.5}>
            <Typography
              fontSize={12}
              lineHeight={1}
              fontWeight={500}
              color="text.secondary"
              px={1}
            >
              &#x2022;
            </Typography>
            <Box pr={0.75}>
              <SmallAvatar
                src={step.toolDetails.logoURI}
                alt={step.toolDetails.name}
                sx={{
                  border: 0,
                  marginBottom: -0.25,
                }}
              >
                {step.toolDetails.name[0]}
              </SmallAvatar>
            </Box>
            <Typography
              fontSize={12}
              lineHeight={1}
              fontWeight={500}
              color="text.secondary"
            >
              {step.toolDetails.name}
            </Typography>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};
