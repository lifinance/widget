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
  isCallBundleNotFound,
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
  const { mode, hiddenUI, disabledUI, requiredUI } = useWidgetConfig()
  const swapOnly = useSwapOnly()
  const { setFieldValue, getFieldValues } = useFieldActions()
  const { setSelectedBookmark, getSelectedBookmark } = useBookmarkActions()

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
  // Try again would only wait for the same bundle again.
  const showRetry = !isCallBundleNotFound(route)

  // Home, not back: after a reload, the route is opened from Activities.
  const handleStartNewSwap = () => {
    // An empty hidden or locked field still needs the route's receiver.
    const [formReceiver] = getFieldValues('toAddress')
    const keepReceiver = Boolean(
      (disabledUI?.toAddress || hiddenUI?.toAddress) && formReceiver
    )
    const values = getNewSwapFormValues(route, {
      keepReceiver,
      receiverRequired: requiredUI?.toAddress,
    })
    const receiver = keepReceiver ? formReceiver : values.toAddress
    // Fill after navigate resolves: this page's unmount cleanup has run by then,
    // as TransactionFailedButtons.test.tsx checks.
    navigate({ to: navigationRoutes.home, replace: true })
      .then(() => {
        for (const fieldName of Object.keys(
          values
        ) as (keyof typeof values)[]) {
          setFieldValue(fieldName, values[fieldName], {
            isDirty: true,
            isTouched: true,
          })
        }
        // A bookmark name from an earlier receiver must not label this one.
        if (
          getSelectedBookmark()?.address.toLowerCase() !==
          receiver?.toLowerCase()
        ) {
          setSelectedBookmark()
        }
      })
      .catch(() => {
        // A host form listener or the bookmark storage threw; keep it handled.
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
          <Button onClick={handleRemoveRoute} fullWidth>
            {t('button.delete')}
          </Button>
        </Box>
        {showStartNewSwap ? (
          <Box sx={{ flex: 1 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleStartNewSwap}
              fullWidth
            >
              {t('button.startNewSwap')}
            </Button>
          </Box>
        ) : null}
        {showRetry ? (
          <Box sx={{ flex: 1 }}>
            <StartTransactionButton
              text={t('button.tryAgain')}
              onClick={handleRetryClick}
              route={route}
              loading={isLoadingAddressActivity}
            />
          </Box>
        ) : null}
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
