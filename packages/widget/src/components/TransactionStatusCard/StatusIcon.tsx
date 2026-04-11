import type { RouteExtended } from '@lifi/sdk'
import { Box } from '@mui/material'
import { AnimatePresence, motion } from 'motion/react'
import type { JSX } from 'react'
import type { RouteExecutionStatus } from '../../stores/routes/types.js'
import {
  ExecutionStatusIndicator,
  resolveExecutionIconKey,
} from '../ExecutionProgress/ExecutionStatusIndicator.js'
import { iconCircleSize } from '../IconCircle/IconCircle.style.js'
import {
  iconInitial,
  iconVariants,
  layoutTransition,
  type MotionCustom,
} from './variants'

interface StatusIconProps {
  route: RouteExtended
  status: RouteExecutionStatus
  custom: MotionCustom
}

/**
 * Animation wrapper around {@link ExecutionStatusIndicator}.
 *
 * Renders the same indicator as the static flow. The wrapper contributes:
 * - `AnimatePresence mode="wait"` keyed by {@link resolveExecutionIconKey}
 *   so a state change animates the old indicator out and the new one in.
 *   The key is derived from the same logic the indicator uses internally,
 *   keeping render output and animation key in sync.
 * - Motion variants (scale + opacity + subtle y-translate) sharing the
 *   card's rhythm.
 * - `layout` prop so the icon counter-scales if an ancestor animates
 *   layout, keeping the icon crisp.
 */
export function StatusIcon({
  route,
  status,
  custom,
}: StatusIconProps): JSX.Element {
  const iconKey = resolveExecutionIconKey(route, status)

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: iconCircleSize,
        mb: 2,
      }}
    >
      <AnimatePresence mode="wait" custom={custom}>
        <motion.div
          key={iconKey}
          layout
          transition={layoutTransition}
          custom={custom}
          variants={iconVariants}
          initial={iconInitial}
          animate="enter"
          exit="exit"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: iconCircleSize,
            height: iconCircleSize,
          }}
        >
          <ExecutionStatusIndicator route={route} status={status} />
        </motion.div>
      </AnimatePresence>
    </Box>
  )
}
