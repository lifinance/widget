import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { ActiveTransactions } from '../../components/ActiveTransactions/ActiveTransactions.js'
import { AmountInput } from '../../components/AmountInput/AmountInput.js'
import { ContractComponent } from '../../components/ContractComponent/ContractComponent.js'
import { GasRefuelMessage } from '../../components/Messages/GasRefuelMessage.js'
import { PageContainer } from '../../components/PageContainer.js'
import { PoweredBy } from '../../components/PoweredBy/PoweredBy.js'
import { Routes } from '../../components/Routes/Routes.js'
import { SelectChainAndToken } from '../../components/SelectChainAndToken.js'
import { SendToWalletButton } from '../../components/SendToWallet/SendToWalletButton.js'
import { SendToWalletExpandButton } from '../../components/SendToWallet/SendToWalletExpandButton.js'
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

  const marginSx = { marginBottom: 2 }

  return (
    <PageContainer>
      <ActiveTransactions sx={marginSx} />
      {custom ? (
        <ContractComponent sx={marginSx}>{contractComponent}</ContractComponent>
      ) : null}
      <SelectChainAndToken mb={2} />
      {!custom || subvariantOptions?.custom === 'deposit' ? (
        <AmountInput formType="from" sx={marginSx} />
      ) : null}
      {!wideVariant ? <Routes sx={marginSx} /> : null}
      <SendToWalletButton sx={marginSx} />
      <GasRefuelMessage mb={2} />
      <MainWarningMessages mb={2} />
      <Box
        sx={{
          display: 'flex',
          mb: showPoweredBy ? 1 : 3,
          gap: 1.5,
        }}
      >
        <ReviewButton />
        <SendToWalletExpandButton />
      </Box>
      {showPoweredBy ? <PoweredBy /> : null}
    </PageContainer>
  )
}
