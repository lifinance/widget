import { Collapse, Stack } from '@mui/material'
import type React from 'react'
import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouteIssueCards } from '../../hooks/useRouteIssueCards.js'
import type { RouteIssue } from '../../utils/routeIssues/types.js'
import { ButtonTertiary } from '../ButtonTertiary.js'
import { RouteIssueCard } from './RouteIssueCard.js'

interface RouteIssueListProps {
  issues: RouteIssue[]
}

export const RouteIssueList: React.FC<RouteIssueListProps> = ({ issues }) => {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const restId = useId()
  const cards = useRouteIssueCards(issues)

  // The 60s refetch can change which reasons come back. Reset the expansion
  // rather than remounting: a remount tears the button out from under a click.
  const signature = issues.map((issue) => issue.bucket).join()
  const [renderedSignature, setRenderedSignature] = useState(signature)
  if (signature !== renderedSignature) {
    setRenderedSignature(signature)
    setExpanded(false)
  }

  const [primary, ...rest] = cards

  if (!primary) {
    return null
  }

  return (
    <Stack direction="column" spacing={1} sx={{ mt: 2, width: '100%' }}>
      <RouteIssueCard content={primary} />
      <Collapse
        id={restId}
        timeout={225}
        in={expanded}
        unmountOnExit
        mountOnEnter
      >
        <Stack direction="column" spacing={1}>
          {rest.map((card) => (
            <RouteIssueCard key={card.key} content={card} />
          ))}
        </Stack>
      </Collapse>
      {rest.length ? (
        <ButtonTertiary
          onClick={() => setExpanded((open) => !open)}
          aria-expanded={expanded}
          aria-controls={restId}
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
