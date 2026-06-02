import { Box } from '@mui/material'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import type { JSX } from 'react'
import type { ExecutionRow } from '../StepActions/executionRows.js'
import { renderExecutionRow } from '../StepActions/executionRows.js'

const ROW_STAGGER = 0.06

const rowTransition = { duration: 0.3, ease: [0.19, 1, 0.22, 1] as const }
const rowExitTransition = {
  duration: 0.2,
  ease: [0.215, 0.61, 0.355, 1] as const,
}

interface ExecutionChecklistProps {
  rows: ExecutionRow[]
}

/** Animated list of completed execution actions. */
export function ExecutionChecklist({
  rows,
}: ExecutionChecklistProps): JSX.Element | null {
  if (rows.length === 0) {
    return null
  }

  return (
    <AnimatePresence mode="popLayout">
      {rows.map((row, index) => (
        <m.div
          key={row.kind === 'action' ? row.href : 'wallet'}
          layout
          initial={{ opacity: 0, y: 14, scaleX: 0.8 }}
          animate={{ opacity: 1, y: 0, scaleX: 1 }}
          transition={{
            ...rowTransition,
            delay: index * ROW_STAGGER,
            layout: rowTransition,
          }}
          exit={{
            opacity: 0,
            y: 10,
            scaleX: 0.9,
            transition: rowExitTransition,
          }}
          style={{ transformOrigin: 'center bottom' }}
        >
          <Box sx={{ paddingTop: 1.5 }}>{renderExecutionRow(row)}</Box>
        </m.div>
      ))}
    </AnimatePresence>
  )
}
