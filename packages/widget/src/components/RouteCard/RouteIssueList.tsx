import { Collapse, Stack } from '@mui/material'
import type React from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { RouteIssue } from '../../utils/routeIssues/types.js'
import { ButtonTertiary } from '../ButtonTertiary.js'
import { RouteIssueCard } from './RouteIssueCard.js'

interface RouteIssueListProps {
  issues: RouteIssue[]
}

/**
 * Remount this on a new issue set — the caller keys it — so the expanded state
 * never carries over to a different set of reasons.
 */
export const RouteIssueList: React.FC<RouteIssueListProps> = ({ issues }) => {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)

  const [primary, ...rest] = issues

  if (!primary) {
    return null
  }

  return (
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
  )
}
