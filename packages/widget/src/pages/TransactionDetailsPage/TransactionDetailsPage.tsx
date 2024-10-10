import type { FullStatusData } from '@lifi/sdk'
import { Box, Typography } from '@mui/material'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { ContractComponent } from '../../components/ContractComponent/ContractComponent.js'
import { PageContainer } from '../../components/PageContainer.js'
import { getStepList } from '../../components/Step/StepList.js'
import { TransactionDetails } from '../../components/TransactionDetails.js'
import { useHeader } from '../../hooks/useHeader.js'
import { useNavigateBack } from '../../hooks/useNavigateBack.js'
import { useTools } from '../../hooks/useTools.js'
import { useTransactionDetails } from '../../hooks/useTransactionDetails.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useRouteExecutionStore } from '../../stores/routes/RouteExecutionStore.js'
import { getSourceTxHash } from '../../stores/routes/utils.js'
import { buildRouteFromTxHistory } from '../../utils/converters.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import { ContactSupportButton } from './ContactSupportButton.js'
import { TransactionDetailsSkeleton } from './TransactionDetailsSkeleton.js'
import { TransferIdCard } from './TransferIdCard.js'

export const TransactionDetailsPage: React.FC = () => {
  const { t, i18n } = useTranslation()
  const { navigate } = useNavigateBack()
  const { subvariant, subvariantOptions, contractSecondaryComponent } =
    useWidgetConfig()
  const { state }: any = useLocation()
  const { tools } = useTools()
  const storedRouteExecution = useRouteExecutionStore(
    (store) => store.routes[state?.routeId]
  )

  const { transaction, isLoading } = useTransactionDetails(
    !storedRouteExecution && state?.transactionHash
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
      navigate(navigationRoutes.home)
    }
  }, [isLoading, navigate, routeExecution])

  const sourceTxHash = getSourceTxHash(routeExecution?.route)

  let supportId = sourceTxHash ?? routeExecution?.route.id ?? ''

  if (process.env.NODE_ENV === 'development') {
    supportId += `_${routeExecution?.route.id}`
  }

  const startedAt = new Date(
    (routeExecution?.route.steps[0].execution?.process[0].startedAt ?? 0) *
      (storedRouteExecution ? 1 : 1000) // local and BE routes have different ms handling
  )

  return isLoading && !storedRouteExecution ? (
    <TransactionDetailsSkeleton />
  ) : (
    <PageContainer bottomGutters>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
        pb={1}
      >
        <Typography fontSize={12}>
          {startedAt.toLocaleString(i18n.language, {
            dateStyle: 'long',
          })}
        </Typography>
        <Typography fontSize={12}>
          {startedAt.toLocaleString(i18n.language, {
            timeStyle: 'short',
          })}
        </Typography>
      </Box>
      {getStepList(routeExecution?.route, subvariant)}
      {subvariant === 'custom' && contractSecondaryComponent ? (
        <ContractComponent sx={{ marginTop: 2 }}>
          {contractSecondaryComponent}
        </ContractComponent>
      ) : null}
      {routeExecution?.route ? (
        <TransactionDetails
          route={routeExecution?.route}
          sx={{ marginTop: 2 }}
        />
      ) : null}
      <TransferIdCard transferId={supportId} />
      <Box mt={2}>
        <ContactSupportButton supportId={supportId} />
      </Box>
    </PageContainer>
  )
}
