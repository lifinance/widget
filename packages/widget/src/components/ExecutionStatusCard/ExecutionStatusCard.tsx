import { Box, Typography } from '@mui/material'
import { stagger } from 'motion'
import type { Transition, Variants } from 'motion/react'
import { AnimatePresence, motion } from 'motion/react'
import type { JSX } from 'react'
import { Card } from '../Card/Card.js'
import { ExecutionChecklist } from './ExecutionChecklist.js'
import type { ExecutionStatusCardProps } from './ExecutionStatusCard.types.js'
import { StaggeredRevealTypography } from './StaggeredRevealTypography.js'

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

/**
 * Title swap — outgoing exits fully before the incoming one appears.
 * Has three states: `hidden` (before enter), `visible` (settled), `exit`.
 */
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

/**
 * Description container. Enters instantly — word-level stagger is the sole
 * reveal. Exit duration matches titleVariants exit so both leave together.
 */
const textContainerVariants: Variants = {
  hidden: {
    opacity: 0,
    transition: { duration: 0.05, ease: [0.215, 0.61, 0.355, 1] },
  },
  visible: { opacity: 1, transition: { duration: 0 } },
}

/**
 * Checklist accordion. Explicit height animation keeps DOM and visual height
 * in sync — a layout-only FLIP would set `height: auto` immediately in the
 * DOM (using scaleY to fake height: 0), which causes the card background to
 * snap to full height before the content appears.
 *
 * `layout` is kept on this element for position tracking only: when the hero
 * column above changes height (title/description update), the accordion
 * FLIP-animates its vertical shift. This does not conflict with the explicit
 * height animation because `layout` fires only on re-renders of an already-
 * mounted element — on first mount inside AnimatePresence there is no prior
 * position to compare against, so only the explicit height animation runs.
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
       * Card is intentionally a plain (non-motion) element. Making it a
       * layout-animated element would cause its scaleY FLIP transform to
       * compose with the checklist rows' translateY FLIP transforms, producing
       * visual artifacts where rows appear to teleport during layout changes.
       * The card height follows the accordion's explicit height animation
       * smoothly via CSS flow without needing its own FLIP.
       */}
      <Card type="default" indented>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ width: '100%', transformOrigin: 'top center' }}
        >
          <Box
            component={motion.div}
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
            <motion.div
              layout
              variants={heroItemVariants}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {iconSlot}
            </motion.div>

            {title && (
              <motion.div
                layout
                variants={heroItemVariants}
                style={{ width: '100%', paddingTop: 12 }}
              >
                {/* mode="wait": the outgoing title must fully exit before the incoming one enters */}
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
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
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}

            {/* mode="popLayout": old description leaves layout immediately so the
                column can reflow without waiting for the exit animation to finish */}
            <AnimatePresence initial={false} mode="popLayout">
              {description && (
                <motion.div
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
                </motion.div>
              )}
            </AnimatePresence>

            {vcSlot && (
              <motion.div
                layout
                variants={heroItemVariants}
                style={{ width: '100%' }}
              >
                {vcSlot}
              </motion.div>
            )}
          </Box>

          <AnimatePresence initial={false}>
            {hasRows && (
              <motion.div
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
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Card>

      {/* layout makes the footer shift smoothly when the card above grows */}
      <motion.div layout transition={{ layout: layoutTransition }}>
        {footerSlot}
      </motion.div>
    </Box>
  )
}
