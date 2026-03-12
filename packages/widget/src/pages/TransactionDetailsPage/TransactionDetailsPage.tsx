import type { FullStatusData } from '@lifi/sdk'
import { Box } from '@mui/material'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '../../components/Card/Card.js'
import { ContractComponent } from '../../components/ContractComponent/ContractComponent.js'
import { DateLabel } from '../../components/DateLabel/DateLabel.js'
import { PageContainer } from '../../components/PageContainer.js'
import { RouteCardEssentials } from '../../components/RouteCard/RouteCardEssentials.js'
import { RouteTokens } from '../../components/Step/RouteTokens.js'
import { internalExplorerUrl } from '../../config/constants.js'
import { useExplorer } from '../../hooks/useExplorer.js'
import { useHeader } from '../../hooks/useHeader.js'
import { useTools } from '../../hooks/useTools.js'
import { useTransactionDetails } from '../../hooks/useTransactionDetails.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useRouteExecutionStore } from '../../stores/routes/RouteExecutionStore.js'
import { getSourceTxHash } from '../../stores/routes/utils.js'
import { buildRouteFromTxHistory } from '../../utils/converters.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import { Receipts } from '../TransactionPage/Receipts.js'
import { TransactionDetailsSkeleton } from './TransactionDetailsSkeleton.js'
import { TransferIdCard } from './TransferIdCard.js'

export const TransactionDetailsPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const {
    subvariant,
    subvariantOptions,
    contractSecondaryComponent,
    explorerUrls,
  } = useWidgetConfig()
  const { search }: any = useLocation()
  const { tools } = useTools()
  const { getTransactionLink } = useExplorer()
  const storedRouteExecution = useRouteExecutionStore(
    (store) => store.routes[search?.routeId]
  )
  const { transaction, isLoading } = useTransactionDetails(
    !storedRouteExecution && search?.transactionHash
  )

  const title =
    subvariant === 'custom'
      ? t(`header.${subvariantOptions?.custom ?? 'checkout'}Details`)
      : t('header.transactionDetails')
  useHeader(title)

  const routeExecution = useMemo(() => {
    if (storedRouteExecution) {
      return storedRouteExecution
    }
    if (isLoading) {
      return
    }
    if (transaction) {
      const routeExecution = buildRouteFromTxHistory(
        transaction as FullStatusData,
        tools
      )
      return routeExecution
    }
  }, [isLoading, storedRouteExecution, tools, transaction])

  useEffect(() => {
    if (!isLoading && !routeExecution) {
      navigate({ to: navigationRoutes.home })
    }
  }, [isLoading, navigate, routeExecution])

  const explorerUrl = explorerUrls?.internal?.[0]
  const url = typeof explorerUrl === 'string' ? explorerUrl : explorerUrl?.url

  const sourceTxHash = getSourceTxHash(routeExecution?.route)
  let supportId = sourceTxHash ?? routeExecution?.route.id ?? ''

  const internalTxLink =
    routeExecution?.route?.steps?.at(-1)?.execution?.internalTxLink
  const externalTxLink =
    routeExecution?.route?.steps?.at(-1)?.execution?.externalTxLink

  const txLink =
    (url
      ? internalTxLink?.replace(internalExplorerUrl, url)
      : internalTxLink) ||
    externalTxLink ||
    getTransactionLink({ txHash: supportId })

  if (process.env.NODE_ENV === 'development') {
    supportId += `_${routeExecution?.route.id}`
  }

  const startedAt = new Date(
    (routeExecution?.route.steps[0].execution?.startedAt ?? 0) *
      (storedRouteExecution ? 1 : 1000) // local and BE routes have different ms handling
  )

  if (isLoading && !storedRouteExecution) {
    return <TransactionDetailsSkeleton />
  }

  if (!routeExecution?.route) {
    return null
  }

  return (
    <PageContainer
      bottomGutters
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <Card type="default" indented>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <DateLabel date={startedAt} />
          <RouteTokens route={routeExecution.route} />
          <RouteCardEssentials
            route={routeExecution.route}
            showDuration={false}
          />
        </Box>
      </Card>
      <Receipts route={routeExecution.route} />
      {subvariant === 'custom' && contractSecondaryComponent ? (
        <ContractComponent>{contractSecondaryComponent}</ContractComponent>
      ) : null}
      {supportId ? (
        <TransferIdCard transferId={supportId} txLink={txLink} />
      ) : null}
    </PageContainer>
  )
}
