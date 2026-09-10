import { Box, Button, Typography } from '@mui/material'
import type React from 'react'
import { useRouteIssueCard } from '../../hooks/useRouteIssueCard.js'
import type { RouteIssue } from '../../utils/routeIssues/types.js'
import { Card } from '../Card/Card.js'

interface RouteIssueCardProps {
  issue: RouteIssue
}

export const RouteIssueCard: React.FC<RouteIssueCardProps> = ({ issue }) => {
  const { title, description, note, action } = useRouteIssueCard(issue)

  return (
    <Card>
      <Box sx={{ p: 2 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 600 }}>{title}</Typography>
        <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: 0.5 }}>
          {description}
        </Typography>
        {note ? (
          <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: 0.5 }}>
            {note}
          </Typography>
        ) : null}
        {action ? (
          <Button
            variant="contained"
            onClick={action.run}
            fullWidth
            sx={{ mt: 1.5, height: 40, fontSize: 14 }}
          >
            {action.label}
          </Button>
        ) : null}
      </Box>
    </Card>
  )
}
