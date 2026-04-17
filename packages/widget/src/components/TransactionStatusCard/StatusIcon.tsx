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
import { iconMorphVariants } from './motion'

interface StatusIconProps {
  route: RouteExtended
  status: RouteExecutionStatus
}

/**
 * Animation wrapper around {@link ExecutionStatusIndicator}.
 *
 * The icon lives in a fixed-size slot; when the execution status changes
 * we use `AnimatePresence mode="popLayout"` so the outgoing and incoming
 * indicators share the slot for the brief transition. A near-invisible
 * crossfade with a hair of blur ({@link iconMorphVariants}) makes the
 * swap read as the icon softening and re-settling — no visible in/out.
 *
 * `iconMorphVariants` is opacity + filter; these aren't in Motion's
 * `positionalKeys`, so the crossfade still runs under reduced motion —
 * accepted trade-off for visual polish.
 */
export function StatusIcon({ route, status }: StatusIconProps): JSX.Element {
  const iconKey = resolveExecutionIconKey(route, status)

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: iconCircleSize,
        height: iconCircleSize,
      }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={iconKey}
          variants={iconMorphVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ExecutionStatusIndicator route={route} status={status} />
        </motion.div>
      </AnimatePresence>
    </Box>
  )
}
