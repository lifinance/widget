import type { RouteExtended } from '@lifi/sdk'
import { Box } from '@mui/material'
import type { Transition, Variants } from 'motion/react'
import { AnimatePresence, motion } from 'motion/react'
import type { JSX } from 'react'
import type { RouteExecutionStatus } from '../../stores/routes/types.js'
import { IconCircle } from '../IconCircle/IconCircle.js'
import { iconCircleSize } from '../IconCircle/IconCircle.style.js'
import { TimerRing } from '../Timer/StepStatusTimer.js'
import type { ExecutionIconKey } from './iconKey.js'
import { resolveExecutionIconKey } from './iconKey.js'

const ICON_EXIT = { duration: 0.08, ease: [0.22, 1, 0.36, 1] as const }

const iconEnterConfig: Record<
  ExecutionIconKey,
  { initialScale: number; transition: Transition }
> = {
  success: {
    initialScale: 0.6,
    transition: { type: 'spring', visualDuration: 0.3, bounce: 0.18 },
  },
  warning: {
    initialScale: 0.75,
    transition: { type: 'spring', visualDuration: 0.27, bounce: 0.1 },
  },
  error: {
    initialScale: 0.75,
    transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
  },
  info: {
    initialScale: 0.8,
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
  },
  timer: {
    initialScale: 0.85,
    transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
  },
}

const iconVariants: Variants = {
  hidden: (key: ExecutionIconKey) => ({
    opacity: 0,
    scale: iconEnterConfig[key].initialScale,
  }),
  visible: (key: ExecutionIconKey) => ({
    opacity: 1,
    scale: 1,
    transition: iconEnterConfig[key].transition,
  }),
  exit: {
    opacity: 0,
    scale: 0.8,
    filter: 'blur(4px)',
    transition: { duration: ICON_EXIT.duration, ease: ICON_EXIT.ease },
  },
}

interface StatusIconProps {
  route: RouteExtended
  status: RouteExecutionStatus
}

/**
 * Animated icon slot for the execution status.
 * Enter animations reflect the semantic weight of each state;
 * all exits share the same recession.
 */
export function StatusIcon({ route, status }: StatusIconProps): JSX.Element {
  const iconKey = resolveExecutionIconKey(route, status)
  const step = route.steps.at(-1)

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
          custom={iconKey}
          variants={iconVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {iconKey === 'timer' ? (
            <TimerRing step={step} />
          ) : (
            <IconCircle status={iconKey} />
          )}
        </motion.div>
      </AnimatePresence>
    </Box>
  )
}
