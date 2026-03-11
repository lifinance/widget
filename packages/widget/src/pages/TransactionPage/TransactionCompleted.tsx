import type { RouteExtended } from '@lifi/sdk'
import { Box } from '@mui/material'
import { Card } from '../../components/Card/Card.js'
import { DateLabel } from '../../components/DateLabel/DateLabel.js'
import { RouteCardEssentials } from '../../components/RouteCard/RouteCardEssentials.js'
import { RouteTokens } from '../../components/Step/RouteTokens.js'
import { TransferIdCard } from '../TransactionDetailsPage/TransferIdCard.js'
import { Receipts } from './Receipts.js'

interface TransactionCompletedProps {
  route: RouteExtended
  startedAt: Date
  transferId?: string
  txLink?: string
}

export const TransactionCompleted: React.FC<TransactionCompletedProps> = ({
  route,
  startedAt,
  transferId,
  txLink,
}) => {
  return (
    <>
      <Card type="default" sx={{ padding: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <DateLabel date={startedAt} />
          <RouteTokens route={route} />
          <RouteCardEssentials route={route} showDuration={false} />
        </Box>
      </Card>
      <Receipts route={route} />
      {transferId ? (
        <TransferIdCard transferId={transferId} txLink={txLink} />
      ) : null}
    </>
  )
}
