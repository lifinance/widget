import type { FullStatusData } from '@lifi/sdk'
import {
  buildRouteFromTxHistory,
  Card,
  DateLabelContainer,
  DateLabelText,
  getSourceTxHash,
  navigationRoutes,
  PageContainer,
  RouteTokens,
  StepActionsList,
  useExplorer,
  useHeader,
  useTools,
} from '@lifi/widget/shared'
import { Box, Button } from '@mui/material'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { type JSX, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useCheckoutTransactionStatus } from '../../hooks/useCheckoutTransactionStatus.js'
import { isTransactionStatusSimulationKind } from '../../utils/transactionStatusSimulation.js'
import { CheckoutTransactionDetailsSkeleton } from './CheckoutTransactionDetailsSkeleton.js'
import { CheckoutTransferIdCard } from './CheckoutTransferIdCard.js'

interface DetailsSearch {
  transactionHash?: string
  simulateTransactionStatus?: string
}

export const CheckoutTransactionDetailsPage: React.FC = (): JSX.Element => {
  const { t, i18n } = useTranslation()
  const { search } = useLocation() as { search: DetailsSearch }
  const transactionHash = search.transactionHash ?? null
  const simulate = isTransactionStatusSimulationKind(
    search.simulateTransactionStatus
  )
    ? search.simulateTransactionStatus
    : null

  useHeader(t('checkout.transactionStatus.detailsTitle'))

  const navigate = useNavigate()
  const { tools } = useTools()
  const { status } = useCheckoutTransactionStatus({
    transactionHash,
    simulate,
  })
  const { getTransactionLink } = useExplorer()

  const route = useMemo(() => {
    if (!status || !tools) {
      return undefined
    }
    return buildRouteFromTxHistory(status as FullStatusData, tools)?.route
  }, [status, tools])

  const goHome = () => {
    navigate({ to: navigationRoutes.home })
  }

  if (!route) {
    return (
      <PageContainer
        bottomGutters
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <CheckoutTransactionDetailsSkeleton />
      </PageContainer>
    )
  }

  const sourceTxHash = getSourceTxHash(route)
  const supportId = sourceTxHash ?? route.id ?? ''
  const txLink = supportId
    ? getTransactionLink({ txHash: supportId })
    : undefined
  const startedAt = new Date(route.steps[0].execution?.startedAt ?? 0)

  return (
    <PageContainer
      bottomGutters
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <Card variant="elevation" indented>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <DateLabelContainer>
            <DateLabelText color="text.secondary">
              {startedAt.toLocaleString(i18n.language, { dateStyle: 'long' })}
            </DateLabelText>
            <DateLabelText color="text.secondary">
              {startedAt.toLocaleString(i18n.language, { timeStyle: 'short' })}
            </DateLabelText>
          </DateLabelContainer>
          <RouteTokens route={route} />
        </Box>
        <Box sx={{ mt: 2 }}>
          <StepActionsList route={route} toAddress={route.toAddress} />
        </Box>
      </Card>
      {supportId ? (
        <CheckoutTransferIdCard transferId={supportId} txLink={txLink} />
      ) : null}
      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={goHome}
        sx={{ mt: 1.5 }}
      >
        {t('button.done')}
      </Button>
    </PageContainer>
  )
}
