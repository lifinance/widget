import type { ExchangeRateUpdateParams } from '@lifi/sdk'
import { useLocation } from '@tanstack/react-router'
import { type JSX, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ContractComponent } from '../../components/ContractComponent/ContractComponent.js'
import { PageContainer } from '../../components/PageContainer.js'
import { useHeader } from '../../hooks/useHeader.js'
import { usePacedRouteExecution } from '../../hooks/usePacedRouteExecution.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useClearAmountFields } from '../../stores/form/useClearAmountFields.js'
import { RouteExecutionStatus } from '../../stores/routes/types.js'
import type { ExchangeRateBottomSheetBase } from './ExchangeRateBottomSheet.js'
import { ExchangeRateBottomSheet } from './ExchangeRateBottomSheet.js'
import { RouteTracker } from './RouteTracker.js'
import { TransactionContent } from './TransactionContent.js'

export const TransactionPage = (): JSX.Element | null => {
  const { t } = useTranslation()
  const { mode, modeOptions, contractSecondaryComponent } = useWidgetConfig()
  const { search }: any = useLocation()
  const stateRouteId = search?.routeId
  const [routeId, setRouteId] = useState<string>(stateRouteId)
  const [routeRefreshing, setRouteRefreshing] = useState(false)
  const clearAmountFields = useClearAmountFields()

  const exchangeRateBottomSheetRef = useRef<ExchangeRateBottomSheetBase>(null)

  const onAcceptExchangeRateUpdate = (
    resolver: (value: boolean) => void,
    data: ExchangeRateUpdateParams
  ) => {
    exchangeRateBottomSheetRef.current?.open(resolver, data)
  }

  const { route, status, executeRoute, restartRoute, deleteRoute } =
    usePacedRouteExecution({
      routeId: routeId,
      onAcceptExchangeRateUpdate,
    })

  const statusRef = useRef(status)
  statusRef.current = status

  const getHeaderTitle = () => {
    if (mode === 'custom') {
      return t(`header.${modeOptions?.custom?.type ?? 'checkout'}`)
    }
    if (route) {
      const transactionType =
        route.fromChainId === route.toChainId ? 'swap' : 'bridge'
      return status === RouteExecutionStatus.Idle
        ? t(`button.${transactionType}Review`)
        : t(`header.${transactionType}`)
    }

    return t('header.exchange')
  }

  const headerAction = useMemo(
    () =>
      status === RouteExecutionStatus.Idle ? (
        <RouteTracker
          observableRouteId={stateRouteId}
          onChange={setRouteId}
          onFetching={setRouteRefreshing}
        />
      ) : undefined,
    [stateRouteId, status]
  )

  useHeader(getHeaderTitle(), headerAction)

  // biome-ignore lint/correctness/useExhaustiveDependencies: cleanup only on unmount
  useEffect(() => {
    return () => {
      if (statusRef.current !== RouteExecutionStatus.Idle) {
        clearAmountFields()
      }
    }
  }, [])

  if (!route || !status) {
    return null
  }

  return (
    <PageContainer
      bottomGutters
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <TransactionContent
        route={route}
        status={status}
        executeRoute={executeRoute}
        restartRoute={restartRoute}
        deleteRoute={deleteRoute}
        routeRefreshing={routeRefreshing}
      />
      {mode === 'custom' && contractSecondaryComponent ? (
        <ContractComponent>{contractSecondaryComponent}</ContractComponent>
      ) : null}
      <ExchangeRateBottomSheet ref={exchangeRateBottomSheetRef} />
    </PageContainer>
  )
}
