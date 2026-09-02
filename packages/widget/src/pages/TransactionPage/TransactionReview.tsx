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
import {
  calculateValueLossPercentage,
  getTokenValueLossThreshold,
  nextGate,
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
    flaggedTokenSheetRef.current?.close()
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

  type StartGate = 'flagged' | 'address' | 'value'

  const startGates: readonly (readonly [StartGate, boolean])[] = (() => {
    const { gasCostUSD, feeCostUSD } = getAccumulatedFeeCostsBreakdown(route)
    const fromAmountUSD = Number.parseFloat(route.fromAmountUSD)
    const toAmountUSD = Number.parseFloat(route.toAmountUSD)
    return [
      ['flagged', flaggedTokens.length > 0],
      [
        'address',
        Boolean(
          toAddress &&
            !hasActivity &&
            !isLoadingAddressActivity &&
            isActivityAddressFetched &&
            !hiddenUI?.lowAddressActivityConfirmation
        ),
      ],
      [
        'value',
        getTokenValueLossThreshold(
          fromAmountUSD,
          toAmountUSD,
          gasCostUSD,
          feeCostUSD
        ) && mode !== 'custom',
      ],
    ]
  })()

  // Opens the gate that follows the one the user cleared, so accepting a sheet
  // never skips the sheets behind it.
  const openNextGate = (after?: StartGate) => {
    switch (nextGate(startGates, after)) {
      case 'flagged':
        flaggedTokenSheetRef.current?.open()
        break
      case 'address':
        confirmToAddressSheetRef.current?.open()
        break
      case 'value':
        tokenValueBottomSheetRef.current?.open()
        break
      default:
        handleExecuteRoute()
    }
  }

  const handleStartClick = () => openNextGate()

  const handleFlaggedTokensContinue = () => {
    flaggedTokenSheetRef.current?.close()
    openNextGate('flagged')
  }

  const handleConfirmToAddressContinue = () => {
    confirmToAddressSheetRef.current?.close()
    openNextGate('address')
  }

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
