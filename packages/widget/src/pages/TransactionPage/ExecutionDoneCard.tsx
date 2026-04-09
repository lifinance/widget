import type { RouteExtended } from '@lifi/sdk'
import { Box } from '@mui/material'
import type React from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '../../components/Card/Card'
import { CardTitle } from '../../components/Card/CardTitle'
import { Token } from '../../components/Token/Token'
import { RouteExecutionStatus } from '../../stores/routes/types'
import { hasEnumFlag } from '../../utils/enum'
import { getExecutionToToken } from '../../utils/token'

interface ExecutionDoneCardProps {
  route: RouteExtended
  status: RouteExecutionStatus
}

export const ExecutionDoneCard: React.FC<ExecutionDoneCardProps> = ({
  route,
  status,
}) => {
  const { t } = useTranslation()

  const toToken = getExecutionToToken(route)

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
