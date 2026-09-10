import Route from '@mui/icons-material/Route'
import { Box, Collapse, Stack, Typography } from '@mui/material'
import type React from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { RouteIssue } from '../../utils/routeIssues/types.js'
import { ButtonTertiary } from '../ButtonTertiary.js'
import { RouteIssueCard } from './RouteIssueCard.js'

interface RouteNotFoundCardProps {
  issues?: RouteIssue[]
}

export const RouteNotFoundCard: React.FC<RouteNotFoundCardProps> = ({
  issues,
}) => {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)

  const [primary, ...rest] = issues ?? []

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
      {primary ? (
        <Stack direction="column" spacing={1} sx={{ mt: 2, width: '100%' }}>
          <RouteIssueCard issue={primary} />
          <Collapse timeout={225} in={expanded} unmountOnExit mountOnEnter>
            <Stack direction="column" spacing={1}>
              {rest.map((issue) => (
                <RouteIssueCard key={issue.bucket} issue={issue} />
              ))}
            </Stack>
          </Collapse>
          {rest.length ? (
            <ButtonTertiary
              onClick={() => setExpanded((open) => !open)}
              aria-expanded={expanded}
              fullWidth
            >
              {expanded
                ? t('info.routeIssue.hideOtherReasons')
                : t('info.routeIssue.otherReasons', { count: rest.length })}
            </ButtonTertiary>
          ) : null}
        </Stack>
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
