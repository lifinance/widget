import type { RouteExtended } from '@lifi/sdk'
import { Box } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '../../components/Card/Card.js'
import { RouteTokens } from '../../components/RouteCard/RouteTokens.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import {
  DateLabelContainer,
  DateLabelText,
} from './TransactionHistoryItem.style.js'

export const TransactionHistoryItem: React.FC<{
  route: RouteExtended
  transactionHash: string
  // startedAt in ms
  startedAt: number
}> = memo(({ route, transactionHash, startedAt }) => {
  const { i18n } = useTranslation()
  const navigate = useNavigate()

  const handleClick = () => {
    navigate({
      to: navigationRoutes.transactionDetails,
      search: { transactionHash },
    })
  }

  const date = new Date(startedAt)

  return (
    <Card onClick={handleClick} indented>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <DateLabelContainer>
          <DateLabelText color="text.secondary">
            {date.toLocaleString(i18n.language, { dateStyle: 'long' })}
          </DateLabelText>
          <DateLabelText color="text.secondary">
            {date.toLocaleString(i18n.language, { timeStyle: 'short' })}
          </DateLabelText>
        </DateLabelContainer>
        <RouteTokens route={route} />
      </Box>
    </Card>
  )
})
