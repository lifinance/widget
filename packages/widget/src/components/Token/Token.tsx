/* eslint-disable react/no-array-index-key */
import type { LifiStep, TokenAmount } from '@lifi/sdk';
import type { BoxProps } from '@mui/material';
import { Box, Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useChain, useToken } from '../../hooks';
import { formatTokenAmount, formatTokenPrice } from '../../utils';
import { SmallAvatar } from '../SmallAvatar';
import { TextFitter } from '../TextFitter';
import { TokenAvatar } from '../TokenAvatar';
import { TextSecondary, TextSecondaryContainer } from './Token.style';

interface TokenProps {
  token?: TokenAmount;
  connected?: boolean;
  step?: LifiStep;
  disableDescription?: boolean;
  isLoading?: boolean;
}

export const Token: React.FC<TokenProps & BoxProps> = ({ token, ...other }) => {
  if (!token?.priceUSD || !token.logoURI) {
    return <TokenFallback token={token} {...other} />;
  }
  return <TokenBase token={token} {...other} />;
};

export const TokenFallback: React.FC<TokenProps & BoxProps> = ({
  token,
  isLoading,
  ...other
}) => {
  const { token: chainToken, isLoading: isLoadingToken } = useToken(
    token?.chainId,
    token?.address,
  );

  return (
    <TokenBase
      token={{ ...token, ...chainToken } as TokenAmount}
      isLoading={isLoading || isLoadingToken}
      {...other}
    />
  );
};

export const TokenBase: React.FC<TokenProps & BoxProps> = ({
  token,
  connected,
  step,
  disableDescription,
  isLoading,
  ...other
}) => {
  const { t } = useTranslation();
  const { chain } = useChain(token?.chainId);
  const formattedTokenAmount = formatTokenAmount(
    token?.amount,
    token?.decimals,
  );
  const formattedTokenPrice = formatTokenPrice(
    formattedTokenAmount,
    token?.priceUSD,
  );
  return (
    <Box flex={1} {...other}>
      <Box display="flex" flex={1} alignItems="center">
        <TokenAvatar
          token={token}
          chain={chain}
          isLoading={isLoading}
          sx={{ marginRight: 2 }}
        />
        {isLoading ? (
          <Skeleton width={112} height={32} variant="text" />
        ) : (
          <TextFitter
            height={30}
            textStyle={{
              fontWeight: 700,
            }}
          >
            {t('format.number', {
              value: formattedTokenAmount,
            })}
          </TextFitter>
        )}
      </Box>
      <TextSecondaryContainer connected={connected} component="span">
        {isLoading ? (
          <Skeleton
            width={48}
            height={12}
            variant="rounded"
            sx={{ marginTop: 0.5 }}
          />
        ) : (
          <TextSecondary connected={connected}>
            {t(`format.currency`, {
              value: formattedTokenPrice,
            })}
          </TextSecondary>
        )}
        {!disableDescription ? (
          <TextSecondary connected={connected} px={0.5} dot>
            &#x2022;
          </TextSecondary>
        ) : null}
        {!step && !disableDescription ? (
          isLoading ? (
            <Skeleton
              width={96}
              height={12}
              variant="rounded"
              sx={{ marginTop: 0.5 }}
            />
          ) : (
            <TextSecondary connected={connected}>
              {t(`main.tokenOnChain`, {
                tokenSymbol: token?.symbol,
                chainName: chain?.name,
              })}
            </TextSecondary>
          )
        ) : null}
        {step ? (
          <Box display="flex" alignItems="flex-end" height={12} mt={0.5}>
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
            <TextSecondary connected>{step.toolDetails.name}</TextSecondary>
          </Box>
        ) : null}
      </TextSecondaryContainer>
    </Box>
  );
};
