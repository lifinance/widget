import { Box, Button, Typography } from '@mui/material'
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
  onAction?: () => void
}

const IssueCardBody: React.FC<IssueCardBodyProps> = ({
  title,
  description,
  note,
  action,
  onAction,
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
    {action && onAction ? (
      <Button
        variant="contained"
        onClick={onAction}
        fullWidth
        sx={{ mt: 1.5, height: 40, fontSize: 14 }}
      >
        {action}
      </Button>
    ) : null}
  </Box>
)

const StaticIssueCard: React.FC<RouteIssueCardProps> = ({ issue }) => (
  <Card>
    <IssueCardBody {...useRouteIssueCopy(issue)} />
  </Card>
)

const ActionableIssueCard: React.FC<RouteIssueCardProps> = ({ issue }) => {
  const copy = useRouteIssueCopy(issue)
  const remedy = useRouteIssueRemedy(issue)

  return (
    <Card>
      <IssueCardBody {...copy} action={remedy?.label} onAction={remedy?.run} />
    </Card>
  )
}

export const RouteIssueCard: React.FC<RouteIssueCardProps> = ({ issue }) =>
  remediableBuckets.includes(issue.bucket) ? (
    <ActionableIssueCard issue={issue} />
  ) : (
    <StaticIssueCard issue={issue} />
  )
