import type { RouteExtended } from '@lifi/sdk'
import { Box, Button } from '@mui/material'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { BottomSheetBase } from '../../components/BottomSheet/types.js'
import { useAddressActivity } from '../../hooks/useAddressActivity.js'
import { useNavigateBack } from '../../hooks/useNavigateBack.js'
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { WidgetEvent } from '../../types/events.js'
import { getAccumulatedFeeCostsBreakdown } from '../../utils/fees.js'
import { ConfirmToAddressSheet } from './ConfirmToAddressSheet.js'
import { StartTransactionButton } from './StartTransactionButton.js'
import { TokenValueBottomSheet } from './TokenValueBottomSheet.js'
import type { RetryGate } from './utils.js'
import {
  calculateValueLossPercentage,
  getRetryGates,
  getTokenValueLossThreshold,
  openNextGate,
} from './utils.js'

interface TransactionFailedButtonsProps {
  route: RouteExtended
  restartRoute: () => void
  deleteRoute: () => void
}

export const TransactionFailedButtons: React.FC<
  TransactionFailedButtonsProps
> = ({ route, restartRoute, deleteRoute }) => {
  const { t } = useTranslation()
  const emitter = useWidgetEvents()
  const navigateBack = useNavigateBack()
  const { mode, hiddenUI } = useWidgetConfig()

  const tokenValueBottomSheetRef = useRef<BottomSheetBase>(null)
  const confirmToAddressSheetRef = useRef<BottomSheetBase>(null)

  const {
    toAddress,
    hasActivity,
    isLoading: isLoadingAddressActivity,
    isFetched: isActivityAddressFetched,
  } = useAddressActivity(route.toChainId)

  const handleRemoveRoute = () => {
    navigateBack()
    deleteRoute()
  }

  const retryGates = (() => {
    const { gasCostUSD, feeCostUSD } = getAccumulatedFeeCostsBreakdown(route)
    return getRetryGates({
      toAddress,
      hasActivity,
      isLoadingAddressActivity,
      isActivityAddressFetched,
      confirmationHidden: Boolean(hiddenUI?.lowAddressActivityConfirmation),
      valueLossExceeded: getTokenValueLossThreshold(
        Number.parseFloat(route.fromAmountUSD),
        Number.parseFloat(route.toAmountUSD),
        gasCostUSD,
        feeCostUSD
      ),
      isCustomMode: mode === 'custom',
    })
  })()

  const openGate = (after?: RetryGate) =>
    openNextGate(
      retryGates,
      {
        address: () => confirmToAddressSheetRef.current?.open(),
        value: () => tokenValueBottomSheetRef.current?.open(),
      },
      handleRestartRoute,
      after
    )

  const handleRestartRoute = () => {
    if (tokenValueBottomSheetRef.current?.isOpen()) {
      const { gasCostUSD, feeCostUSD } = getAccumulatedFeeCostsBreakdown(route)
      const fromAmountUSD = Number.parseFloat(route.fromAmountUSD)
      const toAmountUSD = Number.parseFloat(route.toAmountUSD)
      emitter.emit(WidgetEvent.RouteHighValueLoss, {
        fromAmountUSD,
        toAmountUSD,
        gasCostUSD,
        feeCostUSD,
        valueLoss: calculateValueLossPercentage(
          fromAmountUSD,
          toAmountUSD,
          gasCostUSD,
          feeCostUSD
        ),
      })
    }
    tokenValueBottomSheetRef.current?.close()
    restartRoute()
  }

  const handleRetryClick = () => openGate()

  const handleConfirmToAddressContinue = () => openGate('address')

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Box sx={{ flex: 1 }}>
          <Button onClick={handleRemoveRoute} fullWidth>
            {t('button.delete')}
          </Button>
        </Box>
        <Box sx={{ flex: 1 }}>
          <StartTransactionButton
            text={t('button.tryAgain')}
            onClick={handleRetryClick}
            route={route}
            loading={isLoadingAddressActivity}
          />
        </Box>
      </Box>
      {mode !== 'custom' ? (
        <TokenValueBottomSheet
          route={route}
          ref={tokenValueBottomSheetRef}
          onContinue={handleRestartRoute}
        />
      ) : null}
      {!hiddenUI?.lowAddressActivityConfirmation ? (
        <ConfirmToAddressSheet
          ref={confirmToAddressSheetRef}
          onContinue={handleConfirmToAddressContinue}
          toAddress={toAddress!}
          toChainId={route.toChainId!}
        />
      ) : null}
    </Box>
  )
}
