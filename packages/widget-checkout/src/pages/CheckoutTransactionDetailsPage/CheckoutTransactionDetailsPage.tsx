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
import { useCheckoutToAddress } from '../../hooks/useCheckoutToAddress.js'
import { useCheckoutTransactionStatus } from '../../hooks/useCheckoutTransactionStatus.js'
import { CheckoutTransactionDetailsSkeleton } from './CheckoutTransactionDetailsSkeleton.js'
import { CheckoutTransferIdCard } from './CheckoutTransferIdCard.js'

interface DetailsSearch {
  transactionHash?: string
}

export const CheckoutTransactionDetailsPage: React.FC = (): JSX.Element => {
  const { t, i18n } = useTranslation()
  const { search } = useLocation() as { search: DetailsSearch }
  const transactionHash = search.transactionHash ?? null

  const navigate = useNavigate()
  const { tools } = useTools()
  const { status } = useCheckoutTransactionStatus({
    transactionHash,
  })

  useHeader(
    status?.substatus === 'REFUNDED'
      ? t('checkout.refund.title')
      : t('checkout.transactionStatus.detailsTitle')
  )
  const { getTransactionLink } = useExplorer()
  const recipientAddress = useCheckoutToAddress()

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
  const supportId = sourceTxHash ?? transactionHash ?? route.id ?? ''
  const txLink = supportId
    ? getTransactionLink({ txHash: supportId })
    : undefined
  const startedAtMs = route.steps[0]?.execution?.startedAt
  const startedAt = startedAtMs ? new Date(startedAtMs) : undefined

  return (
    <PageContainer
      bottomGutters
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <Card variant="elevation" indented>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {startedAt ? (
            <DateLabelContainer>
              <DateLabelText color="text.secondary">
                {startedAt.toLocaleString(i18n.language, { dateStyle: 'long' })}
              </DateLabelText>
              <DateLabelText color="text.secondary">
                {startedAt.toLocaleString(i18n.language, {
                  timeStyle: 'short',
                })}
              </DateLabelText>
            </DateLabelContainer>
          ) : null}
          <RouteTokens route={route} />
        </Box>
        <Box sx={{ mt: 2 }}>
          <StepActionsList
            route={route}
            toAddress={recipientAddress ?? route.toAddress}
          />
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
