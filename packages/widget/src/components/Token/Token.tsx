/* eslint-disable react/no-array-index-key */
import type { LiFiStep, TokenAmount } from '@lifi/sdk';
import type { BoxProps } from '@mui/material';
import { Box, Grow, Skeleton } from '@mui/material';
import type { FC, PropsWithChildren, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useChain } from '../../hooks/useChain.js';
import { useToken } from '../../hooks/useToken.js';
import { formatTokenAmount, formatTokenPrice } from '../../utils/format.js';
import { AvatarBadgedSkeleton } from '../Avatar/Avatar.js';
import { TokenAvatar } from '../Avatar/TokenAvatar.js';
import { SmallAvatar } from '../SmallAvatar.js';
import { TextFitter } from '../TextFitter/TextFitter.js';
import { TextSecondary, TextSecondaryContainer } from './Token.style.js';

interface TokenProps {
  token: TokenAmount;
  step?: LiFiStep;
  stepVisible?: boolean;
  disableDescription?: boolean;
  isLoading?: boolean;
}

export const Token: FC<TokenProps & BoxProps> = ({ token, ...other }) => {
  if (!token.priceUSD || !token.logoURI) {
    return <TokenFallback token={token} {...other} />;
  }
  return <TokenBase token={token} {...other} />;
};

export const TokenFallback: FC<TokenProps & BoxProps> = ({
  token,
  isLoading,
  ...other
}) => {
  const { token: chainToken, isLoading: isLoadingToken } = useToken(
    token.chainId,
    token.address,
  );

  return (
    <TokenBase
      token={{ ...token, ...chainToken } as TokenAmount}
      isLoading={isLoading || isLoadingToken}
      {...other}
    />
  );
};

export const TokenBase: FC<TokenProps & BoxProps> = ({
  token,
  step,
  stepVisible,
  disableDescription,
  isLoading,
  ...other
}) => {
  const { t } = useTranslation();
  const { chain } = useChain(token?.chainId);

  if (isLoading) {
    return (
      <TokenSkeleton
        token={token}
        step={step}
        disableDescription={disableDescription}
        {...other}
      />
    );
  }

  const formattedTokenAmount = formatTokenAmount(token.amount, token.decimals);
  const formattedTokenPrice = formatTokenPrice(
    formattedTokenAmount,
    token.priceUSD,
  );

  const tokenOnChain = !disableDescription ? (
    <TextSecondary>
      {t(`main.tokenOnChain`, {
        tokenSymbol: token.symbol,
        chainName: chain?.name,
      })}
    </TextSecondary>
  ) : null;

  return (
    <Box flex={1} display="flex" alignItems="center" {...other}>
      <TokenAvatar
        token={token}
        chain={chain}
        isLoading={isLoading}
        sx={{ marginRight: 2 }}
      />
      <Box flex={1}>
        <Box mb={0.5} height={24} display="flex" alignItems="center">
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
        </Box>
        <TextSecondaryContainer component="span">
          <TextSecondary>
            {t(`format.currency`, {
              value: formattedTokenPrice,
            })}
          </TextSecondary>
          {!disableDescription ? (
            <TextSecondary px={0.5} dot>
              &#x2022;
            </TextSecondary>
          ) : null}
          {step ? (
            <TokenStep
              step={step}
              stepVisible={stepVisible}
              disableDescription={disableDescription}
            >
              {tokenOnChain}
            </TokenStep>
          ) : (
            tokenOnChain
          )}
        </TextSecondaryContainer>
      </Box>
    </Box>
  );
};

const TokenStep: FC<PropsWithChildren<Partial<TokenProps>>> = ({
  step,
  stepVisible,
  disableDescription,
  children,
}) => {
  return (
    <Box flex={1} position="relative" overflow="hidden" height={16}>
      <Grow
        in={!stepVisible && !disableDescription}
        style={{
          position: 'absolute',
        }}
        appear={false}
        timeout={225}
      >
        <Box display="flex" alignItems="center" height={16}>
          {children as ReactElement}
        </Box>
      </Grow>
      <Grow
        in={stepVisible}
        style={{
          position: 'absolute',
        }}
        appear={false}
        timeout={225}
      >
        <Box display="flex" alignItems="center" height={16}>
          <Box mr={0.75} height={16}>
            <SmallAvatar
              src={step?.toolDetails.logoURI}
              alt={step?.toolDetails.name}
            >
              {step?.toolDetails.name[0]}
            </SmallAvatar>
          </Box>
          <TextSecondary>{step?.toolDetails.name}</TextSecondary>
        </Box>
      </Grow>
    </Box>
  );
};

export const TokenSkeleton: FC<Partial<TokenProps> & BoxProps> = ({
  step,
  disableDescription,
  ...other
}) => {
  return (
    <Box flex={1} {...other}>
      <Box display="flex" flex={1} alignItems="center">
        <AvatarBadgedSkeleton sx={{ marginRight: 2 }} />
        <Box flex={1}>
          <Skeleton width={112} height={24} variant="text" />
          <TextSecondaryContainer component="span">
            <Skeleton
              width={48}
              height={12}
              variant="rounded"
              sx={{ marginTop: 0.5 }}
            />
            {!step && !disableDescription ? (
              <Skeleton
                width={96}
                height={12}
                variant="rounded"
                sx={{ marginTop: 0.5, marginLeft: 1.5 }}
              />
            ) : null}
          </TextSecondaryContainer>
        </Box>
      </Box>
    </Box>
  );
};
