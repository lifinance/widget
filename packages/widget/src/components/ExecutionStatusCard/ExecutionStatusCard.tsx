import { Box, Typography } from '@mui/material'
import { stagger } from 'motion'
import type { Transition, Variants } from 'motion/react'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import type { JSX, ReactNode } from 'react'
import { Card } from '../Card/Card.js'
import type { ExecutionRow } from '../StepActions/executionRows.js'
import { ExecutionChecklist } from './ExecutionChecklist.js'
import { StaggeredRevealTypography } from './StaggeredRevealTypography.js'

interface ExecutionStatusCardProps {
  /** Phase title; `undefined` until the first action resolves a message. */
  title: string | undefined
  /** Status subtitle; `undefined` when the action has no description. */
  description: string | undefined
  /** Completed step rows for the animated checklist. */
  rows: ExecutionRow[]
  /** Icon well — a `StatusIcon` or a custom-variant contract component. */
  iconSlot: ReactNode
  /** Footer card: `ExecutionDoneCard` when done, otherwise `RouteTokens`. */
  footerSlot: ReactNode
  /** Partner/VC component, shown after the icon/title when done. */
  vcSlot?: ReactNode
}

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
      delayChildren: stagger(0.06),
    },
  },
}

const heroColumnVariants: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: stagger(0.04) } },
}

const heroItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
}

/** Title swap: the outgoing title fully exits before the next one enters. */
const titleVariants: Variants = {
  hidden: { opacity: 0, y: 10, filter: 'blur(2px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.3, ease: [0.19, 1, 0.22, 1] },
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: 'blur(2px)',
    transition: { duration: 0.05, ease: [0.19, 1, 0.22, 1] },
  },
}

/** Enters instantly (the word-level stagger is the reveal); exit matches the title's. */
const textContainerVariants: Variants = {
  hidden: {
    opacity: 0,
    transition: { duration: 0.05, ease: [0.215, 0.61, 0.355, 1] },
  },
  visible: { opacity: 1, transition: { duration: 0 } },
}

/**
 * Animate height explicitly: a layout-only FLIP would set `height: auto` at
 * once and snap the card background to full height before the content appears.
 * `layout` stays only to track the accordion's shift when the hero column
 * above it resizes.
 */
const accordionVariants: Variants = {
  hidden: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
  visible: {
    height: 'auto',
    opacity: 1,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
}

const layoutTransition: Transition = { duration: 0.3, ease: [0.19, 1, 0.22, 1] }

/** Seconds before the first word begins animating, coordinated with container stagger. */
const WORD_STAGGER_DELAY = 0.08

/**
 * Displays the current execution status: icon, title, description,
 * completed steps, and a footer card.
 */
export function ExecutionStatusCard({
  title,
  description,
  rows,
  iconSlot,
  footerSlot,
  vcSlot,
}: ExecutionStatusCardProps): JSX.Element {
  const hasRows = rows.length > 0

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/*
       * Keep Card non-animated: a layout FLIP here would compose with the
       * checklist rows' FLIP transforms and make rows teleport. Its height
       * follows the accordion via normal flow instead.
       */}
      <Card type="default" indented>
        <m.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ width: '100%', transformOrigin: 'top center' }}
        >
          <Box
            component={m.div}
            layout
            transition={{ layout: layoutTransition }}
            variants={heroColumnVariants}
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxSizing: 'border-box',
            }}
          >
            <m.div
              layout
              variants={heroItemVariants}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {iconSlot}
            </m.div>

            {title && (
              <m.div
                layout
                variants={heroItemVariants}
                style={{ width: '100%', paddingTop: 12 }}
              >
                {/* mode="wait": old title exits before the new one enters */}
                <AnimatePresence initial={false} mode="wait">
                  <m.div
                    key={title}
                    variants={titleVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    style={{ width: '100%' }}
                  >
                    <Typography
                      sx={{
                        fontSize: 16,
                        fontWeight: 600,
                        lineHeight: 1.4,
                        textAlign: 'center',
                      }}
                    >
                      {title}
                    </Typography>
                  </m.div>
                </AnimatePresence>
              </m.div>
            )}

            {/* mode="popLayout": old description leaves layout at once so the column reflows */}
            <AnimatePresence initial={false} mode="popLayout">
              {description && (
                <m.div
                  key={description}
                  variants={textContainerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  style={{ width: '100%', paddingTop: 4 }}
                >
                  <StaggeredRevealTypography
                    text={description}
                    delay={WORD_STAGGER_DELAY}
                    sx={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: 'text.secondary',
                      textAlign: 'center',
                    }}
                  />
                </m.div>
              )}
            </AnimatePresence>

            {vcSlot && (
              <m.div
                layout
                variants={heroItemVariants}
                style={{ width: '100%' }}
              >
                {vcSlot}
              </m.div>
            )}
          </Box>

          <AnimatePresence initial={false}>
            {hasRows && (
              <m.div
                key="checklist"
                layout
                transition={{ layout: layoutTransition }}
                variants={accordionVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                style={{ width: '100%' }}
              >
                <ExecutionChecklist rows={rows} />
              </m.div>
            )}
          </AnimatePresence>
        </m.div>
      </Card>

      {/* layout makes the footer shift smoothly when the card above grows */}
      <m.div layout transition={{ layout: layoutTransition }}>
        {footerSlot}
      </m.div>
    </Box>
  )
}
