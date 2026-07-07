import { PageContainer, useHeader } from '@lifi/widget/shared'
import { useNavigate } from '@tanstack/react-router'
import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useCheckoutModal } from '../../CheckoutModal.js'
import { useFrozenQuote } from '../../hooks/useFrozenQuote.js'
import { checkoutNavigationRoutes } from '../../utils/navigationRoutes.js'
import type { DepositAmountRow } from './DepositAmountTable.js'
import { DepositAmountTable } from './DepositAmountTable.js'
import { DepositStatusScreen } from './DepositStatusScreen.js'

// Mock values used while these pages aren't wired to real session data yet.
// They give designers / QA a realistic preview when reached via the dev
// simulation panel. The kinds that render them are dev-gated in
// DepositErrorRoutePage so the fabricated amounts never reach production.
const MOCK = {
  required: '100 USDT',
  receivedLow: '5 USDT',
  receivedNearlyEnough: '70 USDT',
  receivedExcess: '120 USDT',
  minRefundable: '10 USDT',
  remainingToTopUp: '30 USDT',
  excess: '20 USDT',
  timeRemaining: '8m 32s',
} as const

function useDepositErrorActions(): {
  goHome: () => void
  retryTransfer: () => void
  closeModal: () => void
  requestRefund: () => void
} {
  const navigate = useNavigate()
  const { clear } = useFrozenQuote()
  const modalContext = useCheckoutModal()
  return {
    goHome: () => {
      clear()
      navigate({ to: checkoutNavigationRoutes.home })
    },
    retryTransfer: () => {
      clear()
      navigate({ to: checkoutNavigationRoutes.enterAmount })
    },
    closeModal: () => modalContext?.closeModal(),
    requestRefund: () => {
      clear()
      navigate({ to: checkoutNavigationRoutes.home })
    },
  }
}

function useDepositHeader(): void {
  const { t } = useTranslation()
  useHeader(t('header.deposit'))
}

export function DepositUnexpectedPage(): JSX.Element {
  useDepositHeader()
  const { t } = useTranslation()
  const { closeModal } = useDepositErrorActions()
  return (
    <PageContainer bottomGutters>
      <DepositStatusScreen
        variant="error"
        title={t('checkout.transferDeposit.errors.unexpected.title')}
        description={t(
          'checkout.transferDeposit.errors.unexpected.description'
        )}
        primaryAction={{
          label: t('button.contactSupport'),
          onClick: closeModal,
        }}
      />
    </PageContainer>
  )
}

export function DepositAmountLowBelowThresholdPage(): JSX.Element {
  useDepositHeader()
  const { t } = useTranslation()
  const { retryTransfer } = useDepositErrorActions()
  const rows: DepositAmountRow[] = [
    {
      label: t('checkout.transferDeposit.table.required'),
      value: MOCK.required,
    },
    {
      label: t('checkout.transferDeposit.table.received'),
      value: MOCK.receivedLow,
    },
    {
      label: t('checkout.transferDeposit.table.minRefundable'),
      value: MOCK.minRefundable,
    },
    {
      label: t('checkout.transferDeposit.table.timeRemaining'),
      value: MOCK.timeRemaining,
      emphasize: true,
    },
  ]
  return (
    <PageContainer bottomGutters>
      <DepositStatusScreen
        variant="warning"
        title={t('checkout.transferDeposit.errors.amountLowThreshold.title')}
        description={t(
          'checkout.transferDeposit.errors.amountLowThreshold.description'
        )}
        primaryAction={{
          label: t('button.topUp'),
          onClick: retryTransfer,
        }}
      >
        <DepositAmountTable rows={rows} />
      </DepositStatusScreen>
    </PageContainer>
  )
}

export function DepositAmountLowTopUpPage(): JSX.Element {
  useDepositHeader()
  const { t } = useTranslation()
  const { retryTransfer, requestRefund } = useDepositErrorActions()
  const rows: DepositAmountRow[] = [
    {
      label: t('checkout.transferDeposit.table.required'),
      value: MOCK.required,
    },
    {
      label: t('checkout.transferDeposit.table.received'),
      value: MOCK.receivedNearlyEnough,
    },
    {
      label: t('checkout.transferDeposit.table.remaining'),
      value: MOCK.remainingToTopUp,
    },
    {
      label: t('checkout.transferDeposit.table.timeRemaining'),
      value: MOCK.timeRemaining,
      emphasize: true,
    },
  ]
  return (
    <PageContainer bottomGutters>
      <DepositStatusScreen
        variant="warning"
        title={t('checkout.transferDeposit.errors.amountLowTopUp.title')}
        description={t(
          'checkout.transferDeposit.errors.amountLowTopUp.description'
        )}
        primaryAction={{
          label: t('button.topUp'),
          onClick: retryTransfer,
        }}
        secondaryAction={{
          label: t('button.requestRefund'),
          onClick: requestRefund,
        }}
      >
        <DepositAmountTable rows={rows} />
      </DepositStatusScreen>
    </PageContainer>
  )
}

export function DepositAmountLowExpiredPage(): JSX.Element {
  useDepositHeader()
  const { t } = useTranslation()
  const { requestRefund } = useDepositErrorActions()
  const rows: DepositAmountRow[] = [
    {
      label: t('checkout.transferDeposit.table.required'),
      value: MOCK.required,
    },
    {
      label: t('checkout.transferDeposit.table.received'),
      value: MOCK.receivedNearlyEnough,
    },
  ]
  return (
    <PageContainer bottomGutters>
      <DepositStatusScreen
        variant="warning"
        title={t('checkout.transferDeposit.errors.amountLowExpired.title')}
        description={t(
          'checkout.transferDeposit.errors.amountLowExpired.description'
        )}
        primaryAction={{
          label: t('button.requestRefund'),
          onClick: requestRefund,
        }}
      >
        <DepositAmountTable rows={rows} />
      </DepositStatusScreen>
    </PageContainer>
  )
}

export function DepositExcessHeldPage(): JSX.Element {
  useDepositHeader()
  const { t } = useTranslation()
  const { requestRefund } = useDepositErrorActions()
  const rows: DepositAmountRow[] = [
    {
      label: t('checkout.transferDeposit.table.required'),
      value: MOCK.required,
    },
    {
      label: t('checkout.transferDeposit.table.received'),
      value: MOCK.receivedExcess,
    },
    { label: t('checkout.transferDeposit.table.excess'), value: MOCK.excess },
  ]
  return (
    <PageContainer bottomGutters>
      <DepositStatusScreen
        variant="info"
        title={t('checkout.transferDeposit.errors.excessHeld.title')}
        description={t(
          'checkout.transferDeposit.errors.excessHeld.description'
        )}
        primaryAction={{
          label: t('button.requestRefund'),
          onClick: requestRefund,
        }}
      >
        <DepositAmountTable rows={rows} />
      </DepositStatusScreen>
    </PageContainer>
  )
}

export function DepositLateArrivalPage(): JSX.Element {
  useDepositHeader()
  const { t } = useTranslation()
  const { retryTransfer } = useDepositErrorActions()
  return (
    <PageContainer bottomGutters>
      <DepositStatusScreen
        variant="warning"
        title={t('checkout.transferDeposit.errors.lateArrival.title')}
        description={t(
          'checkout.transferDeposit.errors.lateArrival.description'
        )}
        primaryAction={{
          label: t('button.resumeTransaction'),
          onClick: retryTransfer,
        }}
      />
    </PageContainer>
  )
}

export function DepositAddressExpiredPage(): JSX.Element {
  useDepositHeader()
  const { t } = useTranslation()
  const { retryTransfer } = useDepositErrorActions()
  return (
    <PageContainer bottomGutters>
      <DepositStatusScreen
        variant="error"
        title={t('checkout.transferDeposit.errors.addressExpired.title')}
        description={t(
          'checkout.transferDeposit.errors.addressExpired.description'
        )}
        primaryAction={{
          label: t('button.tryAgain'),
          onClick: retryTransfer,
        }}
      />
    </PageContainer>
  )
}

export function DepositMarketMovedPage(): JSX.Element {
  useDepositHeader()
  const { t } = useTranslation()
  const { goHome, closeModal } = useDepositErrorActions()
  return (
    <PageContainer bottomGutters>
      <DepositStatusScreen
        variant="error"
        title={t('checkout.transferDeposit.errors.marketMoved.title')}
        description={t(
          'checkout.transferDeposit.errors.marketMoved.description'
        )}
        primaryAction={{
          label: t('button.viewRefundStatus'),
          onClick: goHome,
        }}
        secondaryAction={{
          label: t('button.contactSupport'),
          onClick: closeModal,
        }}
      />
    </PageContainer>
  )
}

export type DepositErrorKind =
  | 'unexpected'
  | 'amount-low-threshold'
  | 'amount-low-top-up'
  | 'amount-low-expired'
  | 'excess-held'
  | 'late-arrival'
  | 'address-expired'
  | 'market-moved'

export const depositErrorPages: Record<DepositErrorKind, () => JSX.Element> = {
  unexpected: DepositUnexpectedPage,
  'amount-low-threshold': DepositAmountLowBelowThresholdPage,
  'amount-low-top-up': DepositAmountLowTopUpPage,
  'amount-low-expired': DepositAmountLowExpiredPage,
  'excess-held': DepositExcessHeldPage,
  'late-arrival': DepositLateArrivalPage,
  'address-expired': DepositAddressExpiredPage,
  'market-moved': DepositMarketMovedPage,
}

/**
 * Kinds the live status poll actually navigates to (see
 * `resolveDepositErrorKind`). Every other kind is a design/QA preview that
 * renders mocked amounts, so it is only reachable by URL in development.
 */
export const PRODUCTION_DEPOSIT_ERROR_KINDS: ReadonlySet<DepositErrorKind> =
  new Set(['unexpected', 'address-expired'])
