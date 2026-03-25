import {
  AmountInput,
  HiddenUI,
  MainWarningMessages,
  PageContainer,
  PoweredBy,
  ReviewButton,
  Routes,
  SelectChainAndToken,
  useHeader,
  useWidgetConfig,
} from '@lifi/widget'
import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'

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
