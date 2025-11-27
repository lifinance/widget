import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { ActiveTransactions } from '../../components/ActiveTransactions/ActiveTransactions'
import { AmountInput } from '../../components/AmountInput/AmountInput'
import { ContractComponent } from '../../components/ContractComponent/ContractComponent'
import { GasRefuelMessage } from '../../components/Messages/GasRefuelMessage'
import { PageContainer } from '../../components/PageContainer'
import { PoweredBy } from '../../components/PoweredBy/PoweredBy'
import { Routes } from '../../components/Routes/Routes'
import { SelectChainAndToken } from '../../components/SelectChainAndToken'
import { SendToWalletButton } from '../../components/SendToWallet/SendToWalletButton'
import { SendToWalletExpandButton } from '../../components/SendToWallet/SendToWalletExpandButton'
import { useHeader } from '../../hooks/useHeader'
import { useWideVariant } from '../../hooks/useWideVariant'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider'
import { HiddenUI } from '../../types/widget'
import { MainWarningMessages } from './MainWarningMessages'
import { ReviewButton } from './ReviewButton'

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
      {showGasRefuelMessage ? <GasRefuelMessage mb={2} /> : null}
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
