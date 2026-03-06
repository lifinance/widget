import type { ExtendedChain, LiFiStep, TokenAmount } from '@lifi/sdk'
import type { BoxProps } from '@mui/material'
import { Box, Grow, Skeleton, Tooltip } from '@mui/material'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useChain } from '../../hooks/useChain.js'
import { useToken } from '../../hooks/useToken.js'
import { formatTokenAmount, formatTokenPrice } from '../../utils/format.js'
import { getPriceImpact } from '../../utils/getPriceImpact.js'
import { AvatarBadgedSkeleton } from '../Avatar/Avatar.js'
import { SmallAvatar } from '../Avatar/SmallAvatar.js'
import { TokenAvatar } from '../Avatar/TokenAvatar.js'
import { TextFitter } from '../TextFitter/TextFitter.js'
import { TextSecondary, TextSecondaryContainer } from './Token.style.js'

interface TokenProps {
  token: TokenAmount
  impactToken?: TokenAmount
  enableImpactTokenTooltip?: boolean
  step?: LiFiStep
  stepVisible?: boolean
  disableDescription?: boolean
  isLoading?: boolean
}

export const Token: FC<TokenProps & BoxProps> = ({ token, ...other }) => {
  if (!token.priceUSD || !token.logoURI) {
    return <TokenFallback token={token} {...other} />
  }
  return <TokenBase token={token} {...other} />
}

const TokenFallback: FC<TokenProps & BoxProps> = ({
  token,
  isLoading,
  ...other
}) => {
  const { token: chainToken, isLoading: isLoadingToken } = useToken(
    token.chainId,
    token.address
  )

  return (
    <TokenBase
      token={{ ...token, ...chainToken } as TokenAmount}
      isLoading={isLoading || isLoadingToken}
      {...other}
    />
  )
}

const TokenBase: FC<TokenProps & BoxProps> = ({
  token,
  impactToken,
  enableImpactTokenTooltip,
  step,
  stepVisible,
  disableDescription,
  isLoading,
  ...other
}) => {
  const { t, i18n } = useTranslation()
  const { chain } = useChain(token?.chainId)

  if (isLoading) {
    return (
      <TokenSkeleton
        token={token}
        step={step}
        disableDescription={disableDescription}
        {...other}
      />
    )
  }

  const tokenAmount = formatTokenAmount(token.amount, token.decimals)
  const tokenPrice = formatTokenPrice(
    token.amount,
    token.priceUSD,
    token.decimals
  )

  let priceImpact: number | undefined
  let priceImpactPercent: number | undefined
  if (impactToken) {
    priceImpact = getPriceImpact({
      fromToken: impactToken,
      fromAmount: impactToken.amount,
      toToken: token,
      toAmount: token.amount,
    })
    priceImpactPercent = priceImpact * 100
  }

  return (
    <Box
      {...other}
      sx={[
        {
          flex: 1,
          display: 'flex',
          alignItems: 'center',
        },
        ...(Array.isArray(other.sx) ? other.sx : [other.sx]),
      ]}
    >
      <TokenAvatar
        token={token}
        chain={chain}
        isLoading={isLoading}
        sx={{ marginRight: 2 }}
      />
      <Box
        sx={{
          flex: 1,
        }}
      >
        <Box
          sx={{
            mb: 0.5,
            height: 24,
            display: 'flex',
            alignItems: 'center',
          }}
          title={tokenAmount}
        >
          <TextFitter
            height={30}
            textStyle={{
              fontWeight: 700,
            }}
          >
            {t('format.tokenAmount', {
              value: tokenAmount,
            })}
          </TextFitter>
        </Box>
        <TextSecondaryContainer as="span">
          <TextSecondary>
            {t('format.currency', {
              value: tokenPrice,
            })}
          </TextSecondary>
          {impactToken ? (
            <TextSecondary px={0.5} dot>
              &#x2022;
            </TextSecondary>
          ) : null}
          {impactToken ? (
            enableImpactTokenTooltip ? (
              <Tooltip title={t('tooltip.priceImpact')} sx={{ cursor: 'help' }}>
                <TextSecondary>
                  {t('format.percent', {
                    value: priceImpact,
                    usePlusSign: true,
                  })}
                </TextSecondary>
              </Tooltip>
            ) : (
              <TextSecondary
                title={priceImpactPercent?.toLocaleString(i18n.language, {
                  maximumFractionDigits: 9,
                })}
              >
                {t('format.percent', { value: priceImpact, usePlusSign: true })}
              </TextSecondary>
            )
          ) : null}
          {!disableDescription ? (
            <TextSecondary px={0.5} dot>
              &#x2022;
            </TextSecondary>
          ) : null}
          {!disableDescription ? (
            <TokenStep step={step} stepVisible={stepVisible} chain={chain} />
          ) : null}
        </TextSecondaryContainer>
      </Box>
    </Box>
  )
}

const IconLabel: FC<{ src?: string; name?: string }> = ({ src, name }) => (
  <>
    <Box sx={{ mr: 0.75, height: 16 }}>
      <SmallAvatar src={src} alt={name} size={16}>
        {name?.[0]}
      </SmallAvatar>
    </Box>
    <TextSecondary>{name}</TextSecondary>
  </>
)

interface TokenStepProps extends Partial<TokenProps> {
  chain?: ExtendedChain
}

const TokenStep: FC<TokenStepProps> = ({ step, stepVisible, chain }) => {
  return (
    <Box
      sx={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        height: 16,
      }}
    >
      <Grow
        in={!stepVisible}
        style={{ position: 'absolute' }}
        appear={false}
        timeout={225}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', height: 16 }}>
          <IconLabel src={chain?.logoURI} name={chain?.name} />
        </Box>
      </Grow>
      <Grow
        in={stepVisible}
        style={{ position: 'absolute' }}
        appear={false}
        timeout={225}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', height: 16 }}>
          <IconLabel
            src={step?.toolDetails.logoURI}
            name={step?.toolDetails.name}
          />
        </Box>
      </Grow>
    </Box>
  )
}

export const TokenSkeleton: FC<Partial<TokenProps> & BoxProps> = ({
  step,
  disableDescription,
  ...other
}) => {
  return (
    <Box
      {...other}
      sx={[
        {
          flex: 1,
        },
        ...(Array.isArray(other.sx) ? other.sx : [other.sx]),
      ]}
    >
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          alignItems: 'center',
        }}
      >
        <AvatarBadgedSkeleton sx={{ marginRight: 2 }} />
        <Box
          sx={{
            flex: 1,
          }}
        >
          <Skeleton width={112} height={24} variant="text" />
          <TextSecondaryContainer as="span">
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
  )
}
