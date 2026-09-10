import Route from '@mui/icons-material/Route'
import { Box, Typography } from '@mui/material'
import type React from 'react'
import { useTranslation } from 'react-i18next'
import { useRouteIssueCard } from '../../hooks/useRouteIssueCard.js'
import type { RouteIssue } from '../../utils/routeIssues/types.js'
import { RouteIssueCard } from './RouteIssueCard.js'

interface RouteNotFoundCardProps {
  issues?: RouteIssue[]
}

export const RouteNotFoundCard: React.FC<RouteNotFoundCardProps> = ({
  issues,
}) => {
  const { t } = useTranslation()
  // Only the best-ranked reason is shown; the rest are already folded into it
  // or rank below it, and a stack of them reads as a list of blockers.
  const card = useRouteIssueCard(issues?.[0])

  return (
    <Box
      sx={{
        py: 1.625,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        flex: 1,
        whiteSpace: 'normal',
      }}
    >
      <Typography sx={{ fontSize: 48 }}>
        <Route fontSize="inherit" />
      </Typography>
      <Typography sx={{ fontSize: 18, fontWeight: 700 }}>
        {t('info.title.routeNotFound')}
      </Typography>
      {card ? (
        <Box sx={{ width: '100%' }}>
          <Typography
            sx={{
              fontSize: 14,
              color: 'text.secondary',
              textAlign: 'center',
              mt: 1,
              mb: 2,
            }}
          >
            {t('info.routeIssue.lookForReasons')}
          </Typography>
          <RouteIssueCard content={card} />
        </Box>
      ) : (
        <Typography
          sx={{
            fontSize: 14,
            color: 'text.secondary',
            textAlign: 'center',
            mt: 2,
          }}
        >
          {t('info.message.routeNotFound')}
        </Typography>
      )}
    </Box>
  )
}
