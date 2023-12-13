/* eslint-disable react/no-array-index-key */
import type { LiFiStep, TokenAmount } from '@lifi/sdk';
import type { BoxProps } from '@mui/material';
import { Box, Skeleton, Slide } from '@mui/material';
import { FC, PropsWithChildren, ReactElement, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useChain, useToken } from '../../hooks';
import { formatTokenAmount, formatTokenPrice } from '../../utils';
import { SmallAvatar } from '../SmallAvatar';
import { TextFitter } from '../TextFitter';
import { TokenAvatar } from '../TokenAvatar';
import { TextSecondary, TextSecondaryContainer } from './Token.style';

interface TokenProps {
  token: TokenAmount;
  connected?: boolean;
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
  connected,
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
        connected={connected}
        step={step}
        disableDescription={disableDescription}
      />
    );
  }

  const formattedTokenAmount = formatTokenAmount(token.amount, token.decimals);
  const formattedTokenPrice = formatTokenPrice(
    formattedTokenAmount,
    token.priceUSD,
  );

  const tokenOnChain = !disableDescription ? (
    <TextSecondary connected={connected}>
      {t(`main.tokenOnChain`, {
        tokenSymbol: token.symbol,
        chainName: chain?.name,
      })}
    </TextSecondary>
  ) : null;

  return (
    <Box flex={1} {...other}>
      <Box display="flex" flex={1} alignItems="center">
        <TokenAvatar
          token={token}
          chain={chain}
          isLoading={isLoading}
          sx={{ marginRight: 2 }}
        />
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
      <TextSecondaryContainer connected={connected} component="span">
        <TextSecondary connected={connected}>
          {t(`format.currency`, {
            value: formattedTokenPrice,
          })}
        </TextSecondary>
        {!disableDescription ? (
          <TextSecondary connected={connected} px={0.5} dot>
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
  );
};

const TokenStep: FC<PropsWithChildren<Partial<TokenProps>>> = ({
  step,
  stepVisible,
  disableDescription,
  children,
}) => {
  const container = useRef(null);

  return (
    <Box
      position="relative"
      width="50%"
      overflow="hidden"
      height={16}
      ref={container}
    >
      <Slide
        direction="down"
        in={!stepVisible && !disableDescription}
        container={container.current}
        style={{
          position: 'absolute',
        }}
        appear={false}
      >
        {children as ReactElement}
      </Slide>
      <Slide
        direction="up"
        in={stepVisible}
        container={container.current}
        style={{
          position: 'absolute',
        }}
        appear={false}
        mountOnEnter
      >
        <Box display="flex" alignItems="flex-end" height={16} pt={0.5}>
          <Box pr={0.75}>
            <SmallAvatar
              src={step?.toolDetails.logoURI}
              alt={step?.toolDetails.name}
              sx={{
                border: 0,
                marginBottom: -0.25,
              }}
            >
              {step?.toolDetails.name[0]}
            </SmallAvatar>
          </Box>
          <TextSecondary connected>{step?.toolDetails.name}</TextSecondary>
        </Box>
      </Slide>
    </Box>
  );
};

export const TokenSkeleton: FC<TokenProps & BoxProps> = ({
  token,
  connected,
  step,
  disableDescription,
  ...other
}) => {
  return (
    <Box flex={1} {...other}>
      <Box display="flex" flex={1} alignItems="center">
        <TokenAvatar token={token} sx={{ marginRight: 2 }} isLoading />
        {<Skeleton width={112} height={32} variant="text" />}
      </Box>
      <TextSecondaryContainer connected={connected} component="span">
        <Skeleton
          width={48}
          height={12}
          variant="rounded"
          sx={{ marginTop: 0.5 }}
        />
        {!disableDescription ? (
          <TextSecondary connected={connected} px={0.5} dot>
            &#x2022;
          </TextSecondary>
        ) : null}
        {!step && !disableDescription ? (
          <Skeleton
            width={96}
            height={12}
            variant="rounded"
            sx={{ marginTop: 0.5 }}
          />
        ) : null}
      </TextSecondaryContainer>
    </Box>
  );
};
