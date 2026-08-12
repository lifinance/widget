'use client'
import type { FundingOrder } from '@lifi/sdk'
import { convertQuoteToRoute } from '@lifi/sdk'
import { formatTokenAmount, useChain } from '@lifi/widget/shared'
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded'
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded'
import CloseRounded from '@mui/icons-material/CloseRounded'
import ErrorRounded from '@mui/icons-material/ErrorRounded'
import { Box, CircularProgress, IconButton, Stack } from '@mui/material'
import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import {
  type ActivityItem,
  useCheckoutActivity,
} from '../../hooks/useCheckoutActivity.js'
import { useResumeCheckout } from '../../hooks/useResumeCheckout.js'
import { useFundingOrderStore } from '../../stores/useFundingOrderStore.js'
import {
  FundingOptionCard,
  FundingOptionRow,
  FundingOptionSubtitle,
  FundingOptionTitle,
  FundingSectionLabel,
  FundingSectionStack,
  OptionTextCell,
} from './SelectSourceFundingOptions.style.js'

function isRefunding(order: FundingOrder | undefined): boolean {
  return order?.substatus === 'REFUND_IN_PROGRESS'
}

// A terminal order stays listed until `acknowledge` retires it, so the card has
// to read honestly rather than keep claiming progress.
function statusLabelKey(item: ActivityItem): string {
  if (item.phase === 'done') {
    return item.order?.substatus === 'REFUNDED'
      ? 'checkout.activity.refundComplete'
      : 'checkout.activity.depositComplete'
  }
  return isRefunding(item.order)
    ? 'checkout.activity.refundInProgress'
    : 'checkout.activity.depositInProgress'
}

// convertOrderToRoute stamps `fundingOrderId` for execution — never used
// here, the activity card only ever displays. SMART_DEPOSIT/ONRAMP orders
// reuse the lower-level quote converter; a malformed quote or a quote-less
// order (e.g. DIRECT onramp) falls back to the generic label below.
function displayRoute(order: FundingOrder | undefined) {
  if (!order?.quote) {
    return undefined
  }
  try {
    const route = convertQuoteToRoute(order.quote)
    route.id = order.orderId
    return route
  } catch {
    return undefined
  }
}

interface ActivityStatusIconProps {
  failed: boolean
  done: boolean
  /** Outer box dimension and the glyph/spinner sizing (card vs compact badge). */
  box: number
  errorSize: number
  spinnerSize: number
  spinnerThickness: number
}

function ActivityStatusIcon({
  failed,
  done,
  box,
  errorSize,
  spinnerSize,
  spinnerThickness,
}: ActivityStatusIconProps): JSX.Element {
  return (
    <Box
      sx={{
        display: 'flex',
        width: box,
        height: box,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {failed ? (
        <ErrorRounded sx={{ color: 'error.main', fontSize: errorSize }} />
      ) : done ? (
        <CheckCircleRounded
          sx={{ color: 'success.main', fontSize: errorSize }}
        />
      ) : (
        <CircularProgress size={spinnerSize} thickness={spinnerThickness} />
      )}
    </Box>
  )
}

interface ActivityCardProps {
  item: ActivityItem
  onResume: (item: ActivityItem) => void
  onDismiss: (orderId: string) => void
}

function ActivityCard({
  item,
  onResume,
  onDismiss,
}: ActivityCardProps): JSX.Element {
  const { t } = useTranslation()
  const failed = item.phase === 'failed'
  const done = item.phase === 'done'
  const route = displayRoute(item.order)
  const { chain } = useChain(route?.fromChainId)

  const title = route
    ? t('checkout.activity.amountOnChain', {
        amount: formatTokenAmount(
          BigInt(route.fromAmount),
          route.fromToken.decimals
        ),
        symbol: route.fromToken.symbol,
        chain: chain?.name ?? '',
      })
    : t('checkout.activity.deposit')

  return (
    <FundingOptionCard elevation={0} onClick={() => onResume(item)}>
      <FundingOptionRow>
        <ActivityStatusIcon
          failed={failed}
          done={done}
          box={40}
          errorSize={32}
          spinnerSize={28}
          spinnerThickness={4}
        />
        <OptionTextCell>
          <FundingOptionTitle>{title}</FundingOptionTitle>
          <FundingOptionSubtitle
            sx={failed ? { color: 'error.main' } : undefined}
          >
            {failed
              ? t('checkout.activity.couldNotComplete')
              : t(statusLabelKey(item))}
          </FundingOptionSubtitle>
        </OptionTextCell>
        <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          {failed || done ? (
            <IconButton
              size="small"
              aria-label={t('checkout.activity.dismiss')}
              sx={{ padding: '2px', color: 'text.secondary' }}
              onClick={(e) => {
                e.stopPropagation()
                onDismiss(item.orderId)
              }}
            >
              <CloseRounded sx={{ fontSize: '1.125rem' }} />
            </IconButton>
          ) : null}
          <ChevronRightRounded sx={{ color: 'text.secondary' }} />
        </Box>
      </FundingOptionRow>
    </FundingOptionCard>
  )
}

export function CheckoutActivitySection(): JSX.Element | null {
  const { t } = useTranslation()
  const items = useCheckoutActivity()
  const resume = useResumeCheckout()
  const acknowledge = useFundingOrderStore((s) => s.acknowledge)

  if (items.length === 0) {
    return null
  }

  const onResume = (item: ActivityItem): void => resume(item)
  const onDismiss = (orderId: string): void => acknowledge(orderId)

  // Single live deposit → compact one-line badge (Figma "activity" badge variant).
  if (items.length === 1) {
    const item = items[0]
    if (!item) {
      return null
    }
    const failed = item.phase === 'failed'
    const done = item.phase === 'done'
    return (
      <FundingOptionCard elevation={0} onClick={() => onResume(item)}>
        <FundingOptionRow>
          <ActivityStatusIcon
            failed={failed}
            done={done}
            box={24}
            errorSize={20}
            spinnerSize={18}
            spinnerThickness={5}
          />
          <OptionTextCell>
            <FundingOptionSubtitle
              sx={failed ? { color: 'error.main' } : undefined}
            >
              {failed
                ? t('checkout.activity.singleFailed')
                : t(statusLabelKey(item))}
            </FundingOptionSubtitle>
          </OptionTextCell>
          <ChevronRightRounded
            sx={{ color: 'text.secondary', flexShrink: 0 }}
          />
        </FundingOptionRow>
      </FundingOptionCard>
    )
  }

  return (
    <FundingSectionStack>
      <FundingSectionLabel>{t('checkout.activity.title')}</FundingSectionLabel>
      <Stack spacing={1.5} sx={{ width: '100%' }}>
        {items.map((item) => (
          <ActivityCard
            key={item.orderId}
            item={item}
            onResume={onResume}
            onDismiss={onDismiss}
          />
        ))}
      </Stack>
    </FundingSectionStack>
  )
}
