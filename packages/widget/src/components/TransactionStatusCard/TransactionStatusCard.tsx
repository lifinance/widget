import { Box, Typography } from '@mui/material'
import {
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  motion,
} from 'motion/react'
import { type JSX, useMemo } from 'react'
import { useRouteExecutionMessage } from '../../hooks/useRouteExecutionMessage.js'
import { ExecutionDoneCard } from '../../pages/TransactionPage/ExecutionDoneCard.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { RouteExecutionStatus } from '../../stores/routes/types.js'
import { hasEnumFlag } from '../../utils/enum.js'
import { Card } from '../Card/Card.js'
import { RouteTokens } from '../RouteCard/RouteTokens.js'
import { useExecutionRows } from '../StepActions/StepActionRow.js'
import { ChecklistSection } from './ChecklistSection'
import { StatusIcon } from './StatusIcon'
import type { TransactionStatusCardProps } from './TransactionStatusCard.types'
import {
  descriptionInitial,
  descriptionTextInitial,
  descriptionTextVariants,
  descriptionVariants,
  layoutTransition,
  type MotionCustom,
  sectionInitial,
  sectionVariants,
  titleTextInitial,
  titleTextVariants,
} from './variants'

export function TransactionStatusCard({
  route,
  status,
  timeScale = 1,
}: TransactionStatusCardProps): JSX.Element {
  const { title, message } = useRouteExecutionMessage(route, status)
  const {
    feeConfig,
    subvariant,
    contractSecondaryComponent,
    contractCompactComponent,
  } = useWidgetConfig()

  const isDone = hasEnumFlag(status, RouteExecutionStatus.Done)
  const toAddress = isDone ? route.toAddress : undefined

  const showContractComponent =
    subvariant === 'custom' &&
    isDone &&
    (contractCompactComponent || contractSecondaryComponent)

  const VcComponent =
    status === RouteExecutionStatus.Done ? feeConfig?._vcComponent : undefined

  const custom: MotionCustom = useMemo(() => ({ s: timeScale }), [timeScale])

  const rows = useExecutionRows(route, toAddress)
  const hasRows = rows.length > 0

  return (
    <MotionConfig reducedMotion="user">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Card type="default" indented>
          {/* LayoutGroup + layout prop on every motion element:
              parent scales smoothly, children counter-scale to prevent
              distortion. Card moves as one organism. */}
          <LayoutGroup>
            <motion.div layout transition={layoutTransition}>
              {/* ── Progress section ─────────────────────────────── */}
              <motion.div
                layout
                transition={layoutTransition}
                style={{
                  width: '100%',
                  padding: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  boxSizing: 'border-box',
                }}
              >
                {/* ── Region 1: Icon ────────────────────────────── */}
                {/* StatusIcon's inner motion.div has layout prop
                    internally to counter-scale and stay crisp. */}
                {!showContractComponent ? (
                  <StatusIcon route={route} status={status} custom={custom} />
                ) : (
                  contractCompactComponent || contractSecondaryComponent
                )}

                {/* ── Region 2: Title ───────────────────────────── */}
                {title && (
                  <motion.div
                    layout
                    transition={layoutTransition}
                    style={{
                      width: '100%',
                      fontSize: 16,
                      fontWeight: 600,
                      lineHeight: 1.4,
                      textAlign: 'center',
                    }}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={title}
                        layout
                        transition={layoutTransition}
                        custom={custom}
                        variants={titleTextVariants}
                        initial={titleTextInitial}
                        animate="enter"
                        exit="exit"
                        style={{ width: '100%' }}
                      >
                        {title}
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* ── Region 3: Description ─────────────────────── */}
                {/* Height animation on wrapper (overflow:hidden) for
                    smooth reveal. layout prop + counter-scaling keeps
                    content sharp. Cascade-delayed after title. */}
                <AnimatePresence custom={custom}>
                  {message && (
                    <motion.div
                      key="description"
                      layout
                      transition={layoutTransition}
                      custom={custom}
                      variants={descriptionVariants}
                      initial={descriptionInitial}
                      animate="enter"
                      exit="exit"
                      style={{ width: '100%' }}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={message}
                          layout
                          transition={layoutTransition}
                          custom={custom}
                          variants={descriptionTextVariants}
                          initial={descriptionTextInitial}
                          animate="enter"
                          exit="exit"
                          style={{ width: '100%' }}
                        >
                          <Typography
                            sx={{
                              fontSize: 14,
                              fontWeight: 500,
                              color: 'text.secondary',
                              textAlign: 'center',
                              mt: 0.5,
                            }}
                          >
                            {message}
                          </Typography>
                        </motion.div>
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>

                {VcComponent ? <VcComponent route={route} /> : null}
              </motion.div>

              {/* ── Action rows ─────────────────────────────────── */}
              <AnimatePresence custom={custom}>
                {hasRows && (
                  <motion.div
                    key="action-rows-section"
                    layout
                    transition={layoutTransition}
                    custom={custom}
                    variants={sectionVariants}
                    initial={sectionInitial}
                    animate="enter"
                    exit="exit"
                    style={{ width: '100%' }}
                  >
                    <ChecklistSection rows={rows} custom={custom} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        </Card>

        {/* ── Bottom card ──────────────────────────────────────── */}
        {isDone ? (
          <ExecutionDoneCard route={route} status={status} />
        ) : (
          <Card type="default" indented>
            <RouteTokens route={route} />
          </Card>
        )}
      </Box>
    </MotionConfig>
  )
}
