import type { RouteExtended } from '@lifi/sdk'
import { Box, Button } from '@mui/material'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { BottomSheetBase } from '../../components/BottomSheet/types.js'
import { useAddressActivity } from '../../hooks/useAddressActivity.js'
import { useNavigateBack } from '../../hooks/useNavigateBack.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { getAccumulatedFeeCostsBreakdown } from '../../utils/fees.js'
import { ConfirmToAddressSheet } from './ConfirmToAddressSheet.js'
import { StartTransactionButton } from './StartTransactionButton.js'
import { TokenValueBottomSheet } from './TokenValueBottomSheet.js'
import { getTokenValueLossThreshold } from './utils.js'

interface TransactionFailedButtonsProps {
  route: RouteExtended
  restartRoute: () => void
  deleteRoute: () => void
}

export const TransactionFailedButtons: React.FC<
  TransactionFailedButtonsProps
> = ({ route, restartRoute, deleteRoute }) => {
  const { t } = useTranslation()
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

  const handleRetryClick = () => {
    if (
      toAddress &&
      !hasActivity &&
      !isLoadingAddressActivity &&
      isActivityAddressFetched &&
      !hiddenUI?.lowAddressActivityConfirmation
    ) {
      confirmToAddressSheetRef.current?.open()
      return
    }

    const { gasCostUSD, feeCostUSD } = getAccumulatedFeeCostsBreakdown(route)
    const fromAmountUSD = Number.parseFloat(route.fromAmountUSD)
    const toAmountUSD = Number.parseFloat(route.toAmountUSD)
    const tokenValueLossThresholdExceeded = getTokenValueLossThreshold(
      fromAmountUSD,
      toAmountUSD,
      gasCostUSD,
      feeCostUSD
    )
    if (tokenValueLossThresholdExceeded && mode !== 'custom') {
      tokenValueBottomSheetRef.current?.open()
    } else {
      restartRoute()
    }
  }

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
          onContinue={restartRoute}
        />
      ) : null}
      {!hiddenUI?.lowAddressActivityConfirmation ? (
        <ConfirmToAddressSheet
          ref={confirmToAddressSheetRef}
          onContinue={restartRoute}
          toAddress={toAddress!}
          toChainId={route.toChainId!}
        />
      ) : null}
    </Box>
  )
}
