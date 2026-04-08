import type { RouteExtended } from '@lifi/sdk'
import { Box } from '@mui/material'
import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '../Card/Card.js'
import { RouteTokens } from '../RouteCard/RouteTokens.js'
import { DateLabelContainer, DateLabelText } from './TransactionCard.style.js'

interface TransactionCardProps {
  route: RouteExtended
  date: Date
  onClick?: () => void
}

export const TransactionCard = ({
  route,
  date,
  onClick,
}: TransactionCardProps): JSX.Element => {
  const { i18n } = useTranslation()

  return (
    <Card indented onClick={onClick}>
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
}
