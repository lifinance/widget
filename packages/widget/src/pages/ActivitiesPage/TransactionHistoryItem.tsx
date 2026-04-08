import type { RouteExtended } from '@lifi/sdk'
import { useNavigate } from '@tanstack/react-router'
import { memo } from 'react'
import { TransactionDetailsCard } from '../../components/TransactionDetailsCard/TransactionDetailsCard.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'

export const TransactionHistoryItem: React.FC<{
  route: RouteExtended
  type: 'local' | 'history'
  transactionHash: string
  // startedAt in ms
  startedAt: number
}> = memo(({ route, type, transactionHash, startedAt }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate({
      to: navigationRoutes.transactionDetails,
      search: type === 'history' ? { transactionHash } : { routeId: route.id },
    })
  }

  return (
    <TransactionDetailsCard
      route={route}
      date={new Date(startedAt)}
      onClick={handleClick}
    />
  )
})
