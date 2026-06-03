import type { RouteExtended } from '@lifi/sdk'
import { Box } from '@mui/material'
import type React from 'react'
import { Fragment } from 'react'
import { renderExecutionRow, useExecutionRows } from './executionRows.js'

interface StepActionsListProps {
  route: RouteExtended
  toAddress?: string
}

/** Non-animated list of completed execution step rows (transaction details view). */
export const StepActionsList: React.FC<StepActionsListProps> = ({
  route,
  toAddress,
}) => {
  const rows = useExecutionRows(route, toAddress)

  if (rows.length === 0) {
    return null
  }

  const lastActionIndex = rows.findLastIndex((r) => r.kind === 'action')

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {rows.map((row, index) => (
        <Fragment
          key={
            row.kind === 'action'
              ? `${row.step.id}-${row.action.type}-${index}`
              : `wallet-${row.toChainId}`
          }
        >
          {renderExecutionRow(row, index === lastActionIndex)}
        </Fragment>
      ))}
    </Box>
  )
}
