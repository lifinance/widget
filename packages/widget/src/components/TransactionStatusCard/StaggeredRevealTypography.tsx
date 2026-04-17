import { Typography, type TypographyProps } from '@mui/material'
import { animate, stagger } from 'motion'
import { useReducedMotion } from 'motion/react'
import type { JSX } from 'react'
import { useEffect, useRef } from 'react'
import { splitText } from '../../animations/splitText'
import {
  WORD_ENTER_FILTER,
  WORD_ENTER_OFFSET_Y,
  WORD_SPRING_TRANSITION,
  WORD_STAGGER,
} from './motion'

const SPLIT_WORD_CLASS = 'tx-status-split-word'

export type StaggeredRevealTypographyProps = {
  text: string
} & Omit<TypographyProps, 'children'>

/**
 * Word-level stagger reveal via {@link splitText}. Animates words in once on
 * mount; callers remount (via `key={text}`) to re-trigger on copy changes.
 */
export function StaggeredRevealTypography(
  props: StaggeredRevealTypographyProps
): JSX.Element {
  const { text, sx, ...typographyProps } = props
  const reduceMotion = useReducedMotion()
  const textRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (reduceMotion || !textRef.current) {
      return
    }
    const target = textRef.current

    let controls: ReturnType<typeof animate> | null = null
    document.fonts.ready.then(() => {
      target.style.visibility = 'visible'
      const { words } = splitText(target, { wordClass: SPLIT_WORD_CLASS })
      controls = animate(
        words,
        {
          opacity: [0, 1],
          y: [WORD_ENTER_OFFSET_Y, 0],
          filter: [WORD_ENTER_FILTER, 'blur(0px)'],
        },
        { ...WORD_SPRING_TRANSITION, delay: stagger(WORD_STAGGER) }
      )
    })

    return () => {
      controls?.stop()
    }
  }, [reduceMotion])

  return (
    <Typography
      ref={textRef}
      sx={[
        {
          visibility: reduceMotion ? 'visible' : 'hidden',
          [`& .${SPLIT_WORD_CLASS}`]: {
            willChange: 'transform, opacity, filter',
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...typographyProps}
    >
      {text}
    </Typography>
  )
}
