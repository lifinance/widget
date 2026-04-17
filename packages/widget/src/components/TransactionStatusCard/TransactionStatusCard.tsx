import { Box } from '@mui/material'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import type { JSX } from 'react'
import { useRouteExecutionMessage } from '../../hooks/useRouteExecutionMessage.js'
import { ExecutionDoneCard } from '../../pages/TransactionPage/ExecutionDoneCard.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { RouteExecutionStatus } from '../../stores/routes/types.js'
import { hasEnumFlag } from '../../utils/enum.js'
import { Card } from '../Card/Card.js'
import { RouteTokens } from '../RouteCard/RouteTokens.js'
import { useExecutionRows } from '../StepActions/StepActionRow.js'
import { ChecklistSection } from './ChecklistSection'
import {
  containerVariants,
  heroInnerVariants,
  outerVariants,
  STAGGER_INTERVAL,
  textSlotVariants,
} from './motion'
import { StaggeredRevealTypography } from './StaggeredRevealTypography'
import { StatusIcon } from './StatusIcon'
import type { TransactionStatusCardProps } from './TransactionStatusCard.types'

export function TransactionStatusCard({
  route,
  status,
  subtitleOverride,
}: TransactionStatusCardProps): JSX.Element {
  const { title, message: derivedMessage } = useRouteExecutionMessage(
    route,
    status
  )
  const message = subtitleOverride ?? derivedMessage
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

  const rows = useExecutionRows(route, toAddress)
  const hasRows = rows.length > 0

  return (
    <MotionConfig reducedMotion="user">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Card type="default" indented>
          {/* Card body: outer motion uses CARD_SECTION_STAGGER between the main
              column and the checklist; the column is a motion Box with
              STAGGER_INTERVAL across icon → title → description → optional VC.
              Title/description copy uses splitText word stagger + usePresence
              exits (see StaggeredRevealTypography). */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ width: '100%' }}
          >
            <Box
              component={motion.div}
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: STAGGER_INTERVAL },
                },
              }}
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxSizing: 'border-box',
              }}
            >
              {/* ── Icon ──────────────────────────────────────────── */}
              <motion.div
                variants={heroInnerVariants}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                {!showContractComponent ? (
                  <StatusIcon route={route} status={status} />
                ) : (
                  contractCompactComponent || contractSecondaryComponent
                )}
              </motion.div>

              {/* ── Title ─────────────────────────────────────────── */}
              {title && (
                <motion.div
                  variants={textSlotVariants}
                  style={{ width: '100%', paddingTop: 12 }}
                >
                  <StaggeredRevealTypography
                    key={title}
                    text={title}
                    sx={{
                      fontSize: 16,
                      fontWeight: 600,
                      lineHeight: 1.4,
                      textAlign: 'center',
                    }}
                  />
                </motion.div>
              )}

              {/* ── Description ───────────────────────────────────── */}
              {/* Accordion outer (height + mask); copy remounts on change. */}
              <AnimatePresence initial={false}>
                {message && (
                  <motion.div
                    key="description"
                    variants={outerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    style={{ overflow: 'hidden', width: '100%' }}
                  >
                    <motion.div
                      variants={textSlotVariants}
                      style={{ paddingTop: 4 }}
                    >
                      <StaggeredRevealTypography
                        key={message}
                        text={message}
                        sx={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: 'text.secondary',
                          textAlign: 'center',
                        }}
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {VcComponent ? (
                <motion.div
                  variants={heroInnerVariants}
                  style={{ width: '100%' }}
                >
                  <VcComponent route={route} />
                </motion.div>
              ) : null}
            </Box>

            {/* ── Checklist ───────────────────────────────────────── */}
            <AnimatePresence initial={false}>
              {hasRows && (
                <motion.div
                  key="action-rows-section"
                  variants={outerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  style={{ overflow: 'hidden', width: '100%' }}
                >
                  <motion.div variants={heroInnerVariants}>
                    <ChecklistSection rows={rows} />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </Card>

        {/* ── Bottom card ──────────────────────────────────────────── */}
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
