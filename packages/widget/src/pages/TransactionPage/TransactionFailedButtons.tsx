import type { RouteExtended } from '@lifi/sdk'
import { Box, Button } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { BottomSheetBase } from '../../components/BottomSheet/types.js'
import { useAddressActivity } from '../../hooks/useAddressActivity.js'
import { useNavigateBack } from '../../hooks/useNavigateBack.js'
import { useSwapOnly } from '../../hooks/useSwapOnly.js'
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useBookmarkActions } from '../../stores/bookmarks/useBookmarkActions.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { WidgetEvent } from '../../types/events.js'
import { getAccumulatedFeeCostsBreakdown } from '../../utils/fees.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import { ConfirmToAddressSheet } from './ConfirmToAddressSheet.js'
import { StartTransactionButton } from './StartTransactionButton.js'
import { TokenValueBottomSheet } from './TokenValueBottomSheet.js'
import type { RetryGate } from './utils.js'
import {
  calculateValueLossPercentage,
  canStartNewSwap,
  getNewSwapFormValues,
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
  const navigate = useNavigate()
  const { mode, hiddenUI, disabledUI } = useWidgetConfig()
  const swapOnly = useSwapOnly()
  const { setFieldValue } = useFieldActions()
  const { setSelectedBookmark } = useBookmarkActions()

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

  const showStartNewSwap = canStartNewSwap({ route, mode, swapOnly })

  // Home, not back: after a reload, the route is opened from Activities.
  const handleStartNewSwap = () => {
    const keepReceiver = Boolean(disabledUI?.toAddress || hiddenUI?.toAddress)
    const values = getNewSwapFormValues(route, { keepReceiver })
    // This page clears the amounts of a failed route on unmount, so fill after it.
    navigate({ to: navigationRoutes.home, replace: true }).then(() => {
      for (const fieldName of Object.keys(values) as (keyof typeof values)[]) {
        setFieldValue(fieldName, values[fieldName], {
          isDirty: true,
          isTouched: true,
        })
      }
      // A bookmark name from an earlier receiver must not label this one.
      if (!keepReceiver) {
        setSelectedBookmark()
      }
    })
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
          {showStartNewSwap ? (
            <Button onClick={handleStartNewSwap} fullWidth>
              {t('button.startNewSwap')}
            </Button>
          ) : (
            <Button onClick={handleRemoveRoute} fullWidth>
              {t('button.delete')}
            </Button>
          )}
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
