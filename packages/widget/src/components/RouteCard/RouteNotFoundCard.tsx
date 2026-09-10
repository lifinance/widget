import Route from '@mui/icons-material/Route'
import { Box, Typography } from '@mui/material'
import type React from 'react'
import { useTranslation } from 'react-i18next'
import type { RouteIssue } from '../../utils/routeIssues/types.js'
import { RouteIssueList } from './RouteIssueList.js'

interface RouteNotFoundCardProps {
  issues?: RouteIssue[]
}

export const RouteNotFoundCard: React.FC<RouteNotFoundCardProps> = ({
  issues,
}) => {
  const { t } = useTranslation()

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
      <Typography
        sx={{
          fontSize: 48,
        }}
      >
        <Route fontSize="inherit" />
      </Typography>
      <Typography
        sx={{
          fontSize: 18,
          fontWeight: 700,
        }}
      >
        {t('info.title.routeNotFound')}
      </Typography>
      {issues?.length ? (
        <RouteIssueList
          key={issues.map((issue) => issue.bucket).join()}
          issues={issues}
        />
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
