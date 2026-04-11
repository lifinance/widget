import type { RouteExtended } from '@lifi/sdk'
import { Box } from '@mui/material'
import { Fragment } from 'react'
import {
  renderExecutionRow,
  useExecutionRows,
} from '../../components/StepActions/StepActionRow.js'

interface StepActionsListProps {
  route: RouteExtended
  toAddress?: string
}

export const StepActionsList: React.FC<StepActionsListProps> = ({
  route,
  toAddress,
}) => {
  const rows = useExecutionRows(route, toAddress)

  if (rows.length === 0) {
    return null
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {rows.map((row) => (
        <Fragment key={row.kind === 'action' ? row.href : 'wallet'}>
          {renderExecutionRow(row)}
        </Fragment>
      ))}
    </Box>
  )
}
