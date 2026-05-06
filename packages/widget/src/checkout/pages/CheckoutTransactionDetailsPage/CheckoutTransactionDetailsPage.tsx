import type { FullStatusData } from '@lifi/sdk'
import { Box } from '@mui/material'
import { useLocation } from '@tanstack/react-router'
import { type JSX, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '../../../components/Card/Card.js'
import { PageContainer } from '../../../components/PageContainer.js'
import { RouteTokens } from '../../../components/RouteCard/RouteTokens.js'
import {
  DateLabelContainer,
  DateLabelText,
} from '../../../components/TransactionCard/TransactionCard.style.js'
import { useExplorer } from '../../../hooks/useExplorer.js'
import { useHeader } from '../../../hooks/useHeader.js'
import { useTools } from '../../../hooks/useTools.js'
import { StepActionsList } from '../../../pages/TransactionDetailsPage/StepActionsList.js'
import { getSourceTxHash } from '../../../stores/routes/utils.js'
import { buildRouteFromTxHistory } from '../../../utils/converters.js'
import { useCheckoutTransactionStatus } from '../../hooks/useCheckoutTransactionStatus.js'
import { isTransactionStatusSimulationKind } from '../../utils/transactionStatusSimulation.js'
import { CheckoutTransferIdCard } from './CheckoutTransferIdCard.js'

interface DetailsSearch {
  transactionHash?: string
  simulateTransactionStatus?: string
}

/**
 * Checkout-specific success view. Single combined card with date +
 * sending → receiving + step pills, plus a Transfer ID card. Both use
 * `variant="elevation"` to drop the outlined border in favor of the
 * theme's drop-shadow.
 */
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

  const { tools } = useTools()
  const { status } = useCheckoutTransactionStatus(transactionHash, simulate)
  const { getTransactionLink } = useExplorer()

  const route = useMemo(() => {
    if (!status || !tools) {
      return undefined
    }
    return buildRouteFromTxHistory(status as FullStatusData, tools)?.route
  }, [status, tools])

  if (!route) {
    return <PageContainer bottomGutters />
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
    </PageContainer>
  )
}
