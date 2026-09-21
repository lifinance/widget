import { Box, Button, Typography } from '@mui/material'
import type React from 'react'
import type { RouteIssueCardContent } from '../../utils/routeIssues/card.js'
import { Card } from '../Card/Card.js'

export const RouteIssueCard: React.FC<{
  content: RouteIssueCardContent
  /** Where a Card already wraps this, a second surface reads as a seam. */
  variant?: 'card' | 'cardless'
}> = ({ content, variant = 'card' }) => {
  const { title, description, note, action } = content
  const Surface = variant === 'cardless' ? Box : Card

  return (
    <Surface>
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
    </Surface>
  )
}
