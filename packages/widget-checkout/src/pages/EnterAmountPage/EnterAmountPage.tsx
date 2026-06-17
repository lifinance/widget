import {
  MainWarningMessages,
  PageContainer,
  PoweredBy,
  useHeader,
  useWidgetConfig,
} from '@lifi/widget/shared'
import { Box } from '@mui/material'
import type { JSX, ReactNode } from 'react'
import { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckoutAmountInput } from '../../components/CheckoutAmountInput.js'
import { CheckoutFlowCtaButton } from '../../components/CheckoutFlowCtaButton.js'
import { CheckoutReceiveCard } from '../../components/CheckoutReceiveCard.js'
import { CheckoutRecipientCard } from '../../components/CheckoutRecipientCard.js'
import { FiatCurrencyChip } from '../../components/FiatCurrencyChip.js'
import { TermsDisclaimer } from '../../components/TermsDisclaimer.js'
import {
  INTENT_FACTORY_ONLY,
  useCheckoutExchangesOverride,
} from '../../hooks/useCheckoutExchangesOverride.js'
import { useIsWalletFundedFlow } from '../../hooks/useIsWalletFundedFlow.js'
import { useOnRampPreconnect } from '../../hooks/useOnRampPreconnect.js'
import { useCheckoutFlowStore } from '../../stores/useCheckoutFlowStore.js'

const headerKeyByFlow = {
  wallet: 'header.deposit',
  transfer: 'header.transferCrypto',
  exchange: 'header.connectExchange',
  cash: 'header.depositWithCash',
} as const

export const EnterAmountPage: React.FC = (): JSX.Element => {
  const { t } = useTranslation()
  const { hiddenUI } = useWidgetConfig()
  const fundingSource = useCheckoutFlowStore((s) => s.fundingSource) ?? 'wallet'
  const isWalletFunded = useIsWalletFundedFlow()
  useHeader(t(headerKeyByFlow[fundingSource]))
  const showPoweredBy = !hiddenUI?.poweredBy
  const overrideExchanges = useCheckoutExchangesOverride()
  useOnRampPreconnect()

  // Safety net: ensure the IF override is applied even when the user lands here
  // without going through the SelectSourcePage handlers (deep link / refresh).
  useLayoutEffect(() => {
    if (fundingSource !== 'wallet') {
      overrideExchanges([...INTENT_FACTORY_ONLY])
    }
  }, [fundingSource, overrideExchanges])

  let sendSlot: ReactNode | undefined
  if (fundingSource === 'cash') {
    sendSlot = <FiatCurrencyChip />
  }

  return (
    <PageContainer>
      <CheckoutAmountInput formType="from" sx={{ mb: 2 }} sendSlot={sendSlot} />
      <CheckoutReceiveCard />
      <Box sx={{ mt: 2 }}>
        <CheckoutRecipientCard />
      </Box>
      {/* Warnings cover wallet balance / gas — only show for wallet flow. */}
      {isWalletFunded ? <MainWarningMessages sx={{ mt: 2, mb: 2 }} /> : null}
      <Box sx={{ mt: 1.5, mb: showPoweredBy ? 1 : 3 }}>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <CheckoutFlowCtaButton />
        </Box>
        <TermsDisclaimer />
      </Box>
      {showPoweredBy ? <PoweredBy /> : null}
    </PageContainer>
  )
}
