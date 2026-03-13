import type { RouteExtended } from '@lifi/sdk'
import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Card } from '../../components/Card/Card'
import { CardTitle } from '../../components/Card/CardTitle'
import { Token } from '../../components/Token/Token'
import { RouteExecutionStatus } from '../../stores/routes/types'
import { hasEnumFlag } from '../../utils/enum'

interface ExecutionDoneCardProps {
  route: RouteExtended
  status: RouteExecutionStatus
}

export const ExecutionDoneCard = ({
  route,
  status,
}: ExecutionDoneCardProps) => {
  const { t } = useTranslation()

  const toToken = {
    ...(route.steps.at(-1)?.execution?.toToken ?? route.toToken),
    amount: BigInt(
      route.steps.at(-1)?.execution?.toAmount ??
        route.steps.at(-1)?.estimate.toAmount ??
        route.toAmount
    ),
  }

  return (
    <Card type="default" indented>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <CardTitle sx={{ padding: 0, mb: 2 }}>
          {hasEnumFlag(status, RouteExecutionStatus.Refunded)
            ? t('header.refunded')
            : t('header.received')}
        </CardTitle>
      </Box>
      <Token token={toToken} disableDescription={false} />
    </Card>
  )
}
