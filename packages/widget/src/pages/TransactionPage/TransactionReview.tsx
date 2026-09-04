import type { RouteExtended } from '@lifi/sdk'
import { Box } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { BottomSheetBase } from '../../components/BottomSheet/types.js'
import { Card } from '../../components/Card/Card.js'
import { WarningMessages } from '../../components/Messages/WarningMessages.js'
import { RouteTokens } from '../../components/RouteCard/RouteTokens.js'
import { useAddressActivity } from '../../hooks/useAddressActivity.js'
import { useFlaggedTokenGuard } from '../../hooks/useFlaggedTokenGuard.js'
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { useHeaderStore } from '../../stores/header/useHeaderStore.js'
import { WidgetEvent } from '../../types/events.js'
import { getAccumulatedFeeCostsBreakdown } from '../../utils/fees.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import { ConfirmToAddressSheet } from './ConfirmToAddressSheet.js'
import { StartTransactionButton } from './StartTransactionButton.js'
import { TokenValueBottomSheet } from './TokenValueBottomSheet.js'
import { TokenVerificationBottomSheet } from './TokenVerificationBottomSheet.js'
import type { StartGate } from './utils.js'
import {
  calculateValueLossPercentage,
  getStartGates,
  getTokenValueLossThreshold,
  openNextGate,
} from './utils.js'

interface TransactionReviewProps {
  route: RouteExtended
  executeRoute: () => void
  routeRefreshing: boolean
}

export const TransactionReview: React.FC<TransactionReviewProps> = ({
  route,
  executeRoute,
  routeRefreshing,
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setFieldValue } = useFieldActions()
  const emitter = useWidgetEvents()
  const setBackAction = useHeaderStore((state) => state.setBackAction)
  const { mode, modeOptions, hiddenUI, defaultUI } = useWidgetConfig()

  const tokenValueBottomSheetRef = useRef<BottomSheetBase>(null)
  const confirmToAddressSheetRef = useRef<BottomSheetBase>(null)

  const { flaggedTokens, flaggedTokenSheetRef } = useFlaggedTokenGuard(route)

  const {
    toAddress,
    hasActivity,
    isLoading: isLoadingAddressActivity,
    isFetched: isActivityAddressFetched,
  } = useAddressActivity(route.toChainId)

  const handleExecuteRoute = () => {
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
    executeRoute()
    setFieldValue('fromAmount', '')
    if (mode === 'custom') {
      setFieldValue('fromToken', '')
      setFieldValue('toToken', '')
    }
    setBackAction(() => {
      navigate({ to: navigationRoutes.home, replace: true })
    })
  }

  const startGates = (() => {
    const { gasCostUSD, feeCostUSD } = getAccumulatedFeeCostsBreakdown(route)
    return getStartGates({
      flaggedTokenCount: flaggedTokens.length,
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

  const openGate = (after?: StartGate) =>
    openNextGate(
      startGates,
      {
        flagged: () => flaggedTokenSheetRef.current?.open(),
        address: () => confirmToAddressSheetRef.current?.open(),
        value: () => tokenValueBottomSheetRef.current?.open(),
      },
      handleExecuteRoute,
      after
    )

  const handleStartClick = () => openGate()

  const handleFlaggedTokensContinue = () => {
    flaggedTokenSheetRef.current?.close()
    openGate('flagged')
  }

  const handleConfirmToAddressContinue = () => openGate('address')

  const getButtonText = (): string => {
    switch (mode) {
      case 'custom':
        return modeOptions?.custom?.type === 'deposit'
          ? t('button.deposit')
          : t('button.buy')
      case 'refuel':
        return t('button.startBridging')
      default: {
        const transactionType =
          route.fromChainId === route.toChainId ? 'Swapping' : 'Bridging'
        return t(`button.start${transactionType}`)
      }
    }
  }

  return (
    <>
      <Card type="default" indented>
        <RouteTokens
          route={route}
          showEssentials
          defaultExpanded={defaultUI?.transactionDetailsExpanded}
        />
      </Card>
      <WarningMessages sx={{ mt: 2 }} route={route} allowInteraction />
      <Box sx={{ flex: 1 }}>
        <StartTransactionButton
          text={getButtonText()}
          onClick={handleStartClick}
          route={route}
          loading={routeRefreshing || isLoadingAddressActivity}
        />
      </Box>
      {mode !== 'custom' ? (
        <TokenValueBottomSheet
          route={route}
          ref={tokenValueBottomSheetRef}
          onContinue={handleExecuteRoute}
        />
      ) : null}
      {flaggedTokens.length ? (
        <TokenVerificationBottomSheet
          ref={flaggedTokenSheetRef}
          tokens={flaggedTokens}
          onContinue={handleFlaggedTokensContinue}
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
    </>
  )
}
