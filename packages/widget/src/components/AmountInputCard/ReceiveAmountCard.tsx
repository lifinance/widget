import SwapVertIcon from '@mui/icons-material/SwapVert'
import type { CardProps } from '@mui/material'
import { ButtonBase, Skeleton, styled } from '@mui/material'
import type React from 'react'
import { type JSX, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRoutes } from '../../hooks/useRoutes.js'
import { formatTokenAmount, formatTokenPrice } from '../../utils/format.js'
import { fitInputText } from '../../utils/input.js'
import { CardTitle } from '../Card/CardTitle.js'
import { InputCard } from '../Card/InputCard.js'
import { TokenPillButton } from '../TokenPillButton/TokenPillButton.js'
import {
  AmountDisplay,
  CardBodyRow,
  CardFooterRow,
  CardHeaderRow,
  FooterText,
  maxInputFontSize,
  minInputFontSize,
} from './AmountInputCard.style.js'

const ReceiveToggleButton: React.FC<
  React.ComponentProps<typeof ButtonBase> & { clickable?: boolean }
> = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'clickable',
})<{ clickable?: boolean }>(({ theme, clickable }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.25),
  borderRadius: `calc(${theme.vars.shape.borderRadius} * 2)`,
  padding: theme.spacing(0.25, 0.5),
  backgroundColor: 'transparent',
  ...(clickable
    ? {
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 4%, transparent)`,
        },
      }
    : {
        cursor: 'default',
        pointerEvents: 'none',
      }),
}))

export const ReceiveAmountCard: React.FC<CardProps> = (props): JSX.Element => {
  const { t } = useTranslation()
  const amountRef = useRef<HTMLSpanElement>(null)
  const [showFiat, setShowFiat] = useState(false)
  const formType = 'to' as const
  const { routes, isFetching } = useRoutes()

  const route = routes?.[0]
  const receiveAmount =
    route && route.toAmount
      ? formatTokenAmount(BigInt(route.toAmount), route.toToken.decimals)
      : undefined

  const fiatValue =
    receiveAmount && route?.toToken.priceUSD
      ? formatTokenPrice(receiveAmount, route.toToken.priceUSD)
      : 0

  const canToggle = !!receiveAmount && !!route?.toToken.priceUSD

  const mainDisplay = showFiat
    ? t('format.currency', { value: fiatValue })
    : receiveAmount || '0'

  const footerDisplay = showFiat
    ? t('format.tokenAmount', { value: receiveAmount || '0' })
    : t('format.currency', { value: fiatValue })

  // biome-ignore lint/correctness/useExhaustiveDependencies: effect must run on value change
  useLayoutEffect(() => {
    if (amountRef.current) {
      fitInputText(maxInputFontSize, minInputFontSize, amountRef.current)
    }
  }, [mainDisplay])

  return (
    <InputCard {...props} sx={{ padding: 2, ...props.sx }}>
      <CardHeaderRow>
        <CardTitle
          sx={{ padding: 0, display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          {t('header.receive')}
        </CardTitle>
      </CardHeaderRow>
      <CardBodyRow>
        {isFetching ? (
          <Skeleton variant="text" width={120} height={32} sx={{ flex: 1 }} />
        ) : (
          <AmountDisplay
            ref={amountRef}
            sx={{
              color: receiveAmount ? 'text.primary' : 'text.secondary',
            }}
          >
            {mainDisplay}
          </AmountDisplay>
        )}
        <TokenPillButton formType={formType} />
      </CardBodyRow>
      <CardFooterRow>
        <ReceiveToggleButton
          clickable={canToggle}
          onClick={canToggle ? () => setShowFiat((v) => !v) : undefined}
        >
          <FooterText>{footerDisplay}</FooterText>
          {canToggle ? (
            <SwapVertIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
          ) : null}
        </ReceiveToggleButton>
      </CardFooterRow>
    </InputCard>
  )
}
