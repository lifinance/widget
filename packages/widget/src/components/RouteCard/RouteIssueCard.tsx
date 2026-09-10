import { Box, Typography } from '@mui/material'
import type React from 'react'
import { useTranslation } from 'react-i18next'
import { useRouteIssueCopy } from '../../hooks/useRouteIssueRemedy.js'
import type { RouteIssue } from '../../utils/routeIssues/types.js'
import { Card } from '../Card/Card.js'

interface RouteIssueCardProps {
  issue: RouteIssue
}

export const RouteIssueCard: React.FC<RouteIssueCardProps> = ({ issue }) => {
  const { t } = useTranslation()
  const { titleKey, descriptionKey, values, note, remedy } =
    useRouteIssueCopy(issue)

  return (
    <Card
      // A real button, as SelectTokenCard does, so the fix is keyboard reachable.
      {...(remedy && {
        component: 'button' as const,
        onClick: remedy.run,
        sx: { width: '100%', textAlign: 'left', font: 'inherit' },
      })}
    >
      <Box sx={{ p: 2 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 600 }}>
          {t(titleKey as any)}
        </Typography>
        <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: 0.5 }}>
          {t(descriptionKey as any, values)}
        </Typography>
        {note ? (
          <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: 0.5 }}>
            {note}
          </Typography>
        ) : null}
        {remedy ? (
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
              mt: 1.5,
              color: 'primary.main',
            }}
          >
            {t(remedy.labelKey as any, remedy.values)}
          </Typography>
        ) : null}
      </Box>
    </Card>
  )
}
