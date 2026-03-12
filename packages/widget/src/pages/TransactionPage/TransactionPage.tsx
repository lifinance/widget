import type { ExchangeRateUpdateParams } from '@lifi/sdk'
import { useLocation } from '@tanstack/react-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ContractComponent } from '../../components/ContractComponent/ContractComponent.js'
import { PageContainer } from '../../components/PageContainer.js'
import { useHeader } from '../../hooks/useHeader.js'
import { useRouteExecution } from '../../hooks/useRouteExecution.js'
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { RouteExecutionStatus } from '../../stores/routes/types.js'
import { WidgetEvent } from '../../types/events.js'
import type { ExchangeRateBottomSheetBase } from './ExchangeRateBottomSheet.js'
import { ExchangeRateBottomSheet } from './ExchangeRateBottomSheet.js'
import { RouteTracker } from './RouteTracker.js'
import { TransactionContent } from './TransactionContent.js'

export const TransactionPage = () => {
  const { t } = useTranslation()
  const emitter = useWidgetEvents()
  const { subvariant, subvariantOptions, contractSecondaryComponent } =
    useWidgetConfig()
  const { search }: any = useLocation()
  const stateRouteId = search?.routeId
  const [routeId, setRouteId] = useState<string>(stateRouteId)
  const [routeRefreshing, setRouteRefreshing] = useState(false)

  const exchangeRateBottomSheetRef = useRef<ExchangeRateBottomSheetBase>(null)

  const onAcceptExchangeRateUpdate = (
    resolver: (value: boolean) => void,
    data: ExchangeRateUpdateParams
  ) => {
    exchangeRateBottomSheetRef.current?.open(resolver, data)
  }

  const { route, status, executeRoute, restartRoute, deleteRoute } =
    useRouteExecution({
      routeId: routeId,
      onAcceptExchangeRateUpdate,
    })

  const getHeaderTitle = () => {
    if (subvariant === 'custom') {
      return t(`header.${subvariantOptions?.custom ?? 'checkout'}`)
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: We want to emit event only when the page is mounted
  useEffect(() => {
    if (status === RouteExecutionStatus.Idle) {
      emitter.emit(WidgetEvent.ReviewTransactionPageEntered, route)
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
      {subvariant === 'custom' && contractSecondaryComponent ? (
        <ContractComponent sx={{ marginTop: 2 }}>
          {contractSecondaryComponent}
        </ContractComponent>
      ) : null}
      <ExchangeRateBottomSheet ref={exchangeRateBottomSheetRef} />
    </PageContainer>
  )
}
