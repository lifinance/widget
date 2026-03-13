import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { AmountInput } from '../../components/AmountInput/AmountInput.js'
import { ContractComponent } from '../../components/ContractComponent/ContractComponent.js'
import { GasRefuelMessage } from '../../components/Messages/GasRefuelMessage.js'
import { PageContainer } from '../../components/PageContainer.js'
import { PoweredBy } from '../../components/PoweredBy/PoweredBy.js'
import { Routes } from '../../components/Routes/Routes.js'
import { SelectChainAndToken } from '../../components/SelectChainAndToken.js'
import { useHeader } from '../../hooks/useHeader.js'
import { useWideVariant } from '../../hooks/useWideVariant.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { HiddenUI } from '../../types/widget.js'
import { MainWarningMessages } from './MainWarningMessages.js'
import { ReviewButton } from './ReviewButton.js'

export const MainPage: React.FC = () => {
  const { t } = useTranslation()
  const wideVariant = useWideVariant()
  const { subvariant, subvariantOptions, contractComponent, hiddenUI } =
    useWidgetConfig()
  const custom = subvariant === 'custom'
  const showPoweredBy = !hiddenUI?.includes(HiddenUI.PoweredBy)
  const showGasRefuelMessage = !hiddenUI?.includes(HiddenUI.GasRefuelMessage)

  const splitTitle =
    subvariantOptions?.split === 'bridge'
      ? t('header.bridge')
      : subvariantOptions?.split === 'swap'
        ? t('header.swap')
        : undefined
  const title =
    subvariant === 'custom'
      ? t(`header.${subvariantOptions?.custom ?? 'checkout'}`)
      : subvariant === 'refuel'
        ? t('header.gas')
        : subvariant === 'split' && splitTitle
          ? splitTitle
          : t('header.exchange')

  useHeader(title)

  return (
    <PageContainer>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
        {custom ? (
          <ContractComponent>{contractComponent}</ContractComponent>
        ) : null}
        <SelectChainAndToken />
        {!custom || subvariantOptions?.custom === 'deposit' ? (
          <AmountInput formType="from" />
        ) : null}
        {!wideVariant ? <Routes /> : null}
        {showGasRefuelMessage ? <GasRefuelMessage /> : null}
        <MainWarningMessages />
      </Box>
      <Box
        sx={{
          display: 'flex',
          mb: showPoweredBy ? 1 : 3,
          gap: 1.5,
        }}
      >
        <ReviewButton />
      </Box>
      {showPoweredBy ? <PoweredBy /> : null}
    </PageContainer>
  )
}
