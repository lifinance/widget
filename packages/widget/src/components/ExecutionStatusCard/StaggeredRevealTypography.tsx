import { Typography, type TypographyProps } from '@mui/material'
import { motion, useReducedMotion } from 'motion/react'
import type { JSX } from 'react'
import { Fragment } from 'react'

const WORD_DURATION = 0.3
const WORD_BOUNCE = 0
const WORD_ENTER_Y = 4

export type StaggeredRevealTypographyProps = {
  text: string
  /** Seconds before the first word begins animating. */
  delay?: number
} & Omit<TypographyProps, 'children'>

/**
 * Reveals text with a word-level stagger animation on mount.
 * Callers should remount via `key={text}` when the text changes.
 */
export function StaggeredRevealTypography({
  text,
  delay,
  ...props
}: StaggeredRevealTypographyProps): JSX.Element {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <Typography {...props}>{text}</Typography>
  }

  const words = text.split(' ')
  const perWordDuration = words.length > 1 ? WORD_DURATION * 0.6 : WORD_DURATION
  const staggerInterval =
    (WORD_DURATION - perWordDuration) / Math.max(1, words.length - 1)

  return (
    <Typography {...props}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          {i > 0 && ' '}
          <motion.span
            initial={{ opacity: 0, y: WORD_ENTER_Y }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: 'spring',
              visualDuration: perWordDuration,
              bounce: WORD_BOUNCE,
              delay: (delay ?? 0) + i * staggerInterval,
            }}
            style={{ display: 'inline-block' }}
          >
            {word}
          </motion.span>
        </Fragment>
      ))}
    </Typography>
  )
}
