import { Box } from '@mui/material'
import { AnimatePresence, motion } from 'motion/react'
import type { JSX } from 'react'
import {
  type ExecutionRow,
  renderExecutionRow,
} from '../StepActions/StepActionRow.js'
import { itemInitial, itemVariants, type MotionCustom } from './variants'

/**
 * Props for {@link ChecklistSection}.
 */
interface ChecklistSectionProps {
  /**
   * Rows to render. Built by the parent via `useExecutionRows` so the
   * parent can derive `hasRows` from the same source (single source of
   * truth for the visibility predicate).
   */
  rows: ExecutionRow[]
  /**
   * Motion custom payload threaded to each row's `motion.div` so variants
   * can read `timeScale` and per-item `index` for stagger.
   */
  custom: MotionCustom
}

/**
 * Animated checklist wrapping the production {@link renderExecutionRow}
 * output in per-row motion wrappers.
 *
 * Owns ONLY the animation layer: content rendering, row kinds, and link
 * resolution all live in production code shared with the static step
 * lists. When a bug is fixed or feature added to the production rows,
 * the animated card picks it up automatically.
 *
 * @remarks
 * Uses positional keys (`row-0`, `row-1`, …) so `AnimatePresence` only
 * triggers enter/exit when the list grows or shrinks. Content changes
 * within an existing slot update props without retriggering animations.
 * `layout="position"` preserves per-item stagger (full `layout` would
 * collapse staggered delays into a uniform FLIP animation).
 */
export function ChecklistSection({
  rows,
  custom,
}: ChecklistSectionProps): JSX.Element | null {
  if (rows.length === 0) {
    return null
  }

  return (
    <Box sx={{ paddingTop: 0.5 }}>
      <AnimatePresence custom={custom}>
        {rows.map((row, index) => (
          <motion.div
            layout="position"
            key={`row-${index}`}
            custom={{ ...custom, index }}
            variants={itemVariants}
            initial={itemInitial}
            animate="enter"
            exit="exit"
          >
            <Box sx={{ paddingTop: 1.5 }}>{renderExecutionRow(row)}</Box>
          </motion.div>
        ))}
      </AnimatePresence>
    </Box>
  )
}
