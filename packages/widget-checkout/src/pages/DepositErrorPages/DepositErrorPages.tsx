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

const PLACEHOLDER = '—'

function useDepositErrorActions(): {
  goHome: () => void
  retryTransfer: () => void
  closeModal: () => void
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
    { label: t('checkout.transferDeposit.table.required'), value: PLACEHOLDER },
    { label: t('checkout.transferDeposit.table.received'), value: PLACEHOLDER },
    {
      label: t('checkout.transferDeposit.table.minRefundable'),
      value: PLACEHOLDER,
    },
    {
      label: t('checkout.transferDeposit.table.timeRemaining'),
      value: PLACEHOLDER,
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
  const { retryTransfer, closeModal } = useDepositErrorActions()
  const rows: DepositAmountRow[] = [
    { label: t('checkout.transferDeposit.table.required'), value: PLACEHOLDER },
    { label: t('checkout.transferDeposit.table.received'), value: PLACEHOLDER },
    {
      label: t('checkout.transferDeposit.table.remaining'),
      value: PLACEHOLDER,
    },
    {
      label: t('checkout.transferDeposit.table.timeRemaining'),
      value: PLACEHOLDER,
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
          onClick: closeModal,
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
  const { closeModal } = useDepositErrorActions()
  const rows: DepositAmountRow[] = [
    { label: t('checkout.transferDeposit.table.required'), value: PLACEHOLDER },
    { label: t('checkout.transferDeposit.table.received'), value: PLACEHOLDER },
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
          onClick: closeModal,
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
  const { closeModal } = useDepositErrorActions()
  const rows: DepositAmountRow[] = [
    { label: t('checkout.transferDeposit.table.required'), value: PLACEHOLDER },
    { label: t('checkout.transferDeposit.table.received'), value: PLACEHOLDER },
    { label: t('checkout.transferDeposit.table.excess'), value: PLACEHOLDER },
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
          onClick: closeModal,
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

export function DepositRefundingPage(): JSX.Element {
  useDepositHeader()
  const { t } = useTranslation()
  const { goHome, closeModal } = useDepositErrorActions()
  return (
    <PageContainer bottomGutters>
      <DepositStatusScreen
        variant="error"
        title={t('checkout.transferDeposit.errors.refunding.title')}
        description={t('checkout.transferDeposit.errors.refunding.description')}
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
  | 'refunding'

export const depositErrorPages: Record<DepositErrorKind, () => JSX.Element> = {
  unexpected: DepositUnexpectedPage,
  'amount-low-threshold': DepositAmountLowBelowThresholdPage,
  'amount-low-top-up': DepositAmountLowTopUpPage,
  'amount-low-expired': DepositAmountLowExpiredPage,
  'excess-held': DepositExcessHeldPage,
  'late-arrival': DepositLateArrivalPage,
  'address-expired': DepositAddressExpiredPage,
  'market-moved': DepositMarketMovedPage,
  refunding: DepositRefundingPage,
}
