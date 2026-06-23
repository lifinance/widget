import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { AmountInput } from '../../components/AmountInput/AmountInput.js'
import { AmountInputCardPair } from '../../components/AmountInputCard/AmountInputCardPair.js'
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
import { MainWarningMessages } from './MainWarningMessages.js'
import { ReviewButton } from './ReviewButton.js'

export const MainPage: React.FC = () => {
  const { t } = useTranslation()
  const wideVariant = useWideVariant()
  const { mode, modeOptions, contractComponent, hiddenUI, defaultUI } =
    useWidgetConfig()
  const custom = mode === 'custom'
  const showSendReceiveCards = !!defaultUI?.cardLayout
  const showPoweredBy = !hiddenUI?.poweredBy
  const showGasRefuelMessage = !hiddenUI?.gasRefuelMessage

  const splitTitle =
    modeOptions?.split === 'bridge'
      ? t('header.bridge')
      : modeOptions?.split === 'swap'
        ? t('header.swap')
        : undefined
  const title =
    mode === 'custom'
      ? t(`header.${modeOptions?.custom?.type ?? 'checkout'}`)
      : mode === 'refuel'
        ? t('header.gas')
        : mode === 'split' && splitTitle
          ? splitTitle
          : t('header.exchange')

  useHeader(title)

  const marginSx = { marginBottom: 2 }

  return (
    <PageContainer topGutters>
      {custom ? (
        <ContractComponent sx={marginSx}>{contractComponent}</ContractComponent>
      ) : null}
      {showSendReceiveCards ? (
        <AmountInputCardPair sx={marginSx} />
      ) : (
        <>
          <SelectChainAndToken sx={marginSx} />
          {!custom || modeOptions?.custom?.type === 'deposit' ? (
            <AmountInput formType="from" sx={marginSx} />
          ) : null}
        </>
      )}
      {!wideVariant ? <Routes sx={marginSx} /> : null}
      <SendToWalletButton sx={marginSx} />
      {showGasRefuelMessage ? <GasRefuelMessage sx={marginSx} /> : null}
      <MainWarningMessages sx={marginSx} />
      <Box
        sx={{
          display: 'flex',
          mb: showPoweredBy ? 1 : 3,
        }}
      >
        <ReviewButton />
        <SendToWalletExpandButton />
      </Box>
      {showPoweredBy ? <PoweredBy /> : null}
    </PageContainer>
  )
}
