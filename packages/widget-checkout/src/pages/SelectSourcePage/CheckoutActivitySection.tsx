'use client'
import { formatTokenAmount, useChain } from '@lifi/widget/shared'
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded'
import CloseRounded from '@mui/icons-material/CloseRounded'
import ErrorRounded from '@mui/icons-material/ErrorRounded'
import { Box, CircularProgress, IconButton, Stack } from '@mui/material'
import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import {
  type PendingActivityItem,
  type PendingActivityState,
  useCheckoutPendingRecords,
} from '../../hooks/useCheckoutPendingRecords.js'
import { useResumeCheckout } from '../../hooks/useResumeCheckout.js'
import { usePendingCheckoutStore } from '../../stores/usePendingCheckoutStore.js'
import {
  FundingOptionCard,
  FundingOptionRow,
  FundingOptionSubtitle,
  FundingOptionTitle,
  FundingSectionLabel,
  FundingSectionStack,
  OptionTextCell,
} from './SelectSourceFundingOptions.style.js'

function inProgressLabelKey(state: PendingActivityState): string {
  return state === 'refund'
    ? 'checkout.activity.refundInProgress'
    : 'checkout.activity.depositInProgress'
}

interface ActivityStatusIconProps {
  failed: boolean
  /** Outer box dimension and the glyph/spinner sizing (card vs compact badge). */
  box: number
  errorSize: number
  spinnerSize: number
  spinnerThickness: number
}

function ActivityStatusIcon({
  failed,
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
      ) : (
        <CircularProgress size={spinnerSize} thickness={spinnerThickness} />
      )}
    </Box>
  )
}

interface ActivityCardProps {
  item: PendingActivityItem
  onResume: (item: PendingActivityItem) => void
  onDismiss: (key: string) => void
}

function ActivityCard({
  item,
  onResume,
  onDismiss,
}: ActivityCardProps): JSX.Element {
  const { t } = useTranslation()
  const { record, state } = item
  const { chain } = useChain(record.fromChain)
  const failed = state === 'failed'

  const title =
    record.fromAmount &&
    record.tokenDecimals !== undefined &&
    record.tokenSymbol
      ? t('checkout.activity.amountOnChain', {
          amount: formatTokenAmount(
            BigInt(record.fromAmount),
            record.tokenDecimals
          ),
          symbol: record.tokenSymbol,
          chain: chain?.name ?? '',
        })
      : t('checkout.activity.deposit')

  return (
    <FundingOptionCard elevation={0} onClick={() => onResume(item)}>
      <FundingOptionRow>
        <ActivityStatusIcon
          failed={failed}
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
              : t(inProgressLabelKey(state))}
          </FundingOptionSubtitle>
        </OptionTextCell>
        <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          {failed ? (
            <IconButton
              size="small"
              aria-label={t('checkout.activity.dismiss')}
              sx={{ padding: '2px', color: 'text.secondary' }}
              onClick={(e) => {
                e.stopPropagation()
                onDismiss(item.key)
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
  const items = useCheckoutPendingRecords()
  const resume = useResumeCheckout()
  const clearForKey = usePendingCheckoutStore((s) => s.clearForKey)

  if (items.length === 0) {
    return null
  }

  const onResume = (item: PendingActivityItem): void =>
    resume(item.record, item.depositDetected)
  const onDismiss = (key: string): void => clearForKey(key)

  // Single live deposit → compact one-line badge (Figma "activity" badge variant).
  if (items.length === 1) {
    const item = items[0]
    if (!item) {
      return null
    }
    const failed = item.state === 'failed'
    return (
      <FundingOptionCard elevation={0} onClick={() => onResume(item)}>
        <FundingOptionRow>
          <ActivityStatusIcon
            failed={failed}
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
                : t(inProgressLabelKey(item.state))}
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
            key={item.key}
            item={item}
            onResume={onResume}
            onDismiss={onDismiss}
          />
        ))}
      </Stack>
    </FundingSectionStack>
  )
}
