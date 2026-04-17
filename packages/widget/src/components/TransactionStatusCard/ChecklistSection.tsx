import { Box } from '@mui/material'
import { AnimatePresence, motion } from 'motion/react'
import type { JSX } from 'react'
import {
  type ExecutionRow,
  renderExecutionRow,
} from '../StepActions/StepActionRow.js'
import { ACCORDION_DURATION, TOAST_EASE_OUT } from './motion'

// Exit timing per the notifications reference this list mirrors.
const TOAST_EXIT_DURATION = 0.2

interface ChecklistSectionProps {
  /**
   * Rows to render. Built by the parent via `useExecutionRows` so the
   * parent can derive `hasRows` from the same source (single source of
   * truth for the visibility predicate).
   */
  rows: ExecutionRow[]
}

/**
 * Notification-stack checklist.
 *
 * Two-layer motion wrapper per row:
 *
 * - OUTER: `height: 0 ↔ auto` + `overflow: hidden` — grows the card
 *   smoothly as rows arrive. `height` is in Motion's `positionalKeys`,
 *   so this is auto-disabled under reduced motion; no conditional code.
 * - INNER: `opacity / y / scaleX` spring on entry (200/18), per-property
 *   0.2s tween on exit. `layout` for smooth sibling reflow.
 *   `transformOrigin: 'center bottom'` so rows rise into place from the
 *   bottom edge.
 */
export function ChecklistSection({
  rows,
}: ChecklistSectionProps): JSX.Element | null {
  if (rows.length === 0) {
    return null
  }

  return (
    <Box>
      <AnimatePresence initial={false} mode="popLayout">
        {rows.map((row, index) => (
          <motion.div
            key={`row-${index}`}
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: ACCORDION_DURATION }}
            style={{ overflow: 'hidden' }}
          >
            <motion.div
              layout
              initial={{ opacity: 0, y: 14, scaleX: 0.8 }}
              animate={{ opacity: 1, y: 0, scaleX: 1 }}
              exit={{
                opacity: 0,
                y: 10,
                scaleX: 0.9,
                transition: {
                  opacity: {
                    duration: TOAST_EXIT_DURATION,
                    ease: TOAST_EASE_OUT,
                  },
                  y: { duration: TOAST_EXIT_DURATION, ease: TOAST_EASE_OUT },
                  scaleX: {
                    duration: TOAST_EXIT_DURATION,
                    ease: TOAST_EASE_OUT,
                  },
                },
              }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 18,
                bounce: 0,
              }}
              style={{ transformOrigin: 'center bottom' }}
            >
              <Box sx={{ paddingTop: 1.5 }}>{renderExecutionRow(row)}</Box>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </Box>
  )
}
