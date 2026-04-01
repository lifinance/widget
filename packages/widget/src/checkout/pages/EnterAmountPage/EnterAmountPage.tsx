import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { AmountInput } from '../../../components/AmountInput/AmountInput.js'
import { PageContainer } from '../../../components/PageContainer.js'
import { PoweredBy } from '../../../components/PoweredBy/PoweredBy.js'
import { Routes } from '../../../components/Routes/Routes.js'
import { SelectChainAndToken } from '../../../components/SelectChainAndToken.js'
import { useHeader } from '../../../hooks/useHeader.js'
import { MainWarningMessages } from '../../../pages/MainPage/MainWarningMessages.js'
import { ReviewButton } from '../../../pages/MainPage/ReviewButton.js'
import { useWidgetConfig } from '../../../providers/WidgetProvider/WidgetProvider.js'
import { HiddenUI } from '../../../types/widget.js'

export const EnterAmountPage: React.FC = () => {
  const { t } = useTranslation()
  useHeader(t('header.deposit'))
  const { hiddenUI } = useWidgetConfig()
  const showPoweredBy = !hiddenUI?.includes(HiddenUI.PoweredBy)

  return (
    <PageContainer>
      <SelectChainAndToken mb={2} />
      <AmountInput formType="from" sx={{ mb: 2 }} />
      <Routes sx={{ mb: 2 }} />
      <MainWarningMessages mb={2} />
      <Box sx={{ display: 'flex', mb: showPoweredBy ? 1 : 3, gap: 1.5 }}>
        <ReviewButton />
      </Box>
      {showPoweredBy ? <PoweredBy /> : null}
    </PageContainer>
  )
}
