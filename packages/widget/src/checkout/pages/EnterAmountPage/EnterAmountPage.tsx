import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { PageContainer } from '../../../components/PageContainer.js'
import { PoweredBy } from '../../../components/PoweredBy/PoweredBy.js'
import { useHeader } from '../../../hooks/useHeader.js'
import { MainWarningMessages } from '../../../pages/MainPage/MainWarningMessages.js'
import { useWidgetConfig } from '../../../providers/WidgetProvider/WidgetProvider.js'
import { HiddenUI } from '../../../types/widget.js'
import { CheckoutAmountInput } from '../../components/CheckoutAmountInput.js'
import { CheckoutDepositButton } from '../../components/CheckoutDepositButton.js'
import { CheckoutReceiveCard } from '../../components/CheckoutReceiveCard.js'

export const EnterAmountPage: React.FC = () => {
  const { t } = useTranslation()
  useHeader(t('header.deposit'))
  const { hiddenUI } = useWidgetConfig()
  const showPoweredBy = !hiddenUI?.includes(HiddenUI.PoweredBy)

  return (
    <PageContainer topGutters>
      <CheckoutAmountInput formType="from" sx={{ mb: 2 }} />
      <CheckoutReceiveCard />
      <MainWarningMessages sx={{ mt: 2, mb: 2 }} />
      <Box sx={{ display: 'flex', mb: showPoweredBy ? 1 : 3, gap: 1.5 }}>
        <CheckoutDepositButton />
      </Box>
      {showPoweredBy ? <PoweredBy /> : null}
    </PageContainer>
  )
}
