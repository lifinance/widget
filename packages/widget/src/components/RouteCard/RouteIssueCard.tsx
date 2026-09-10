import { Box, Typography } from '@mui/material'
import type React from 'react'
import {
  remediableBuckets,
  useRouteIssueCopy,
  useRouteIssueRemedy,
} from '../../hooks/useRouteIssueCopy.js'
import type { RouteIssue } from '../../utils/routeIssues/types.js'
import { Card } from '../Card/Card.js'

interface RouteIssueCardProps {
  issue: RouteIssue
}

interface IssueCardBodyProps {
  title: string
  description: string
  note?: string
  action?: string
}

const IssueCardBody: React.FC<IssueCardBodyProps> = ({
  title,
  description,
  note,
  action,
}) => (
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
      <Typography
        sx={{ fontSize: 14, fontWeight: 600, mt: 1.5, color: 'primary.main' }}
      >
        {action}
      </Typography>
    ) : null}
  </Box>
)

const StaticIssueCard: React.FC<RouteIssueCardProps> = ({ issue }) => {
  const copy = useRouteIssueCopy(issue)
  return (
    <Card>
      <IssueCardBody {...copy} />
    </Card>
  )
}

const ActionableIssueCard: React.FC<RouteIssueCardProps> = ({ issue }) => {
  const copy = useRouteIssueCopy(issue)
  const remedy = useRouteIssueRemedy(issue)

  if (!remedy) {
    return <StaticIssueCard issue={issue} />
  }

  return (
    // A real button, as SelectTokenCard is.
    <Card
      component="button"
      onClick={remedy.run}
      sx={{ width: '100%', textAlign: 'left', font: 'inherit' }}
    >
      <IssueCardBody {...copy} action={remedy.label} />
    </Card>
  )
}

export const RouteIssueCard: React.FC<RouteIssueCardProps> = ({ issue }) =>
  remediableBuckets.includes(issue.bucket) ? (
    <ActionableIssueCard issue={issue} />
  ) : (
    <StaticIssueCard issue={issue} />
  )
