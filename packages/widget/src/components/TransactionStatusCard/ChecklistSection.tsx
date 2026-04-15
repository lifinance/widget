import { Box } from '@mui/material'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { JSX } from 'react'
import {
  type ExecutionRow,
  renderExecutionRow,
} from '../StepActions/StepActionRow.js'
import { rowOuterVariants, TOAST_EASE_OUT } from './motion'

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
 * Notification-stack checklist rendered as a two-layer motion wrapper:
 *
 * - OUTER (`rowOuterVariants`) animates `height: 0 ↔ auto` + `maskImage`
 *   gradient. This is what grows the parent card smoothly as each row
 *   arrives — without it the card height jumps.
 * - INNER follows the reference notifications-list recipe verbatim:
 *   `opacity / y / scaleX` spring on entry (200/18), per-property 0.2s
 *   tween on exit, `layout` for smooth sibling reflow, and
 *   `transformOrigin: 'center bottom'` so rows rise into place from the
 *   bottom edge.
 */
export function ChecklistSection({
  rows,
}: ChecklistSectionProps): JSX.Element | null {
  const shouldReduceMotion = useReducedMotion()

  if (rows.length === 0) {
    return null
  }

  return (
    <Box sx={{ paddingTop: 0.5 }}>
      <AnimatePresence initial={false} mode="popLayout">
        {rows.map((row, index) => (
          <motion.div
            key={`row-${index}`}
            variants={rowOuterVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={{ overflow: 'hidden' }}
          >
            <motion.div
              layout
              initial={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 0, y: 14, scaleX: 0.8 }
              }
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, y: 0, scaleX: 1 }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      y: 10,
                      scaleX: 0.9,
                      transition: {
                        opacity: {
                          duration: TOAST_EXIT_DURATION,
                          ease: TOAST_EASE_OUT,
                        },
                        y: {
                          duration: TOAST_EXIT_DURATION,
                          ease: TOAST_EASE_OUT,
                        },
                        scaleX: {
                          duration: TOAST_EXIT_DURATION,
                          ease: TOAST_EASE_OUT,
                        },
                      },
                    }
              }
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
