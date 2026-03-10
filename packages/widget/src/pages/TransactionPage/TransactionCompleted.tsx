import type { RouteExtended } from '@lifi/sdk'
import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Card } from '../../components/Card/Card.js'
import { RouteCardEssentials } from '../../components/RouteCard/RouteCardEssentials.js'
import { RouteTokens } from '../../components/Step/RouteTokens.js'
import { RouteTransactions } from '../../components/Step/RouteTransactions.js'
import { TransferIdCard } from '../TransactionDetailsPage/TransferIdCard.js'

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
  const { t, i18n } = useTranslation()

  return (
    <>
      <Card type="default" sx={{ padding: 3 }}>
        <Typography
          sx={{
            pb: 1.5,
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 12,
          }}
          component="div"
        >
          <span>
            {startedAt.toLocaleString(i18n.language, {
              dateStyle: 'long',
            })}
          </span>
          <span>
            {startedAt.toLocaleString(i18n.language, {
              timeStyle: 'short',
            })}
          </span>
        </Typography>
        <RouteTokens route={route} />
        <RouteCardEssentials route={route} showDuration={false} />
      </Card>
      <Card type="default" sx={{ padding: 3 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 3 }}>
          {t('main.receipts')}
        </Typography>
        <RouteTransactions route={route} />
      </Card>
      {transferId ? (
        <TransferIdCard transferId={transferId} txLink={txLink} />
      ) : null}
    </>
  )
}
