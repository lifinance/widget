import { Box } from '@mui/material'
import type { JSX, ReactNode } from 'react'
import { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PageContainer } from '../../../components/PageContainer.js'
import { PoweredBy } from '../../../components/PoweredBy/PoweredBy.js'
import { useHeader } from '../../../hooks/useHeader.js'
import { MainWarningMessages } from '../../../pages/MainPage/MainWarningMessages.js'
import { useWidgetConfig } from '../../../providers/WidgetProvider/WidgetProvider.js'
import { HiddenUI } from '../../../types/widget.js'
import { CheckoutAmountInput } from '../../components/CheckoutAmountInput.js'
import { CheckoutFlowCtaButton } from '../../components/CheckoutFlowCtaButton.js'
import { CheckoutReceiveCard } from '../../components/CheckoutReceiveCard.js'
import { FiatCurrencyChip } from '../../components/FiatCurrencyChip.js'
import {
  INTENT_FACTORY_ONLY,
  useCheckoutExchangesOverride,
} from '../../hooks/useCheckoutExchangesOverride.js'
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
  useHeader(t(headerKeyByFlow[fundingSource]))
  const showPoweredBy = !hiddenUI?.includes(HiddenUI.PoweredBy)
  const overrideExchanges = useCheckoutExchangesOverride()

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
      <MainWarningMessages sx={{ mt: 2, mb: 2 }} />
      <Box
        sx={{ display: 'flex', mt: 1.5, mb: showPoweredBy ? 1 : 3, gap: 1.5 }}
      >
        <CheckoutFlowCtaButton />
      </Box>
      {showPoweredBy ? <PoweredBy /> : null}
    </PageContainer>
  )
}
