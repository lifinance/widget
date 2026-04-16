import { Typography, type TypographyProps } from '@mui/material'
import { animate, stagger } from 'motion'
import { usePresence, useReducedMotion } from 'motion/react'
import type { JSX } from 'react'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { splitText } from '../../animations/splitText'
import {
  DESCRIPTION_WORD_EXIT_DURATION,
  DESCRIPTION_WORD_EXIT_SPRING_TRANSITION,
  DESCRIPTION_WORD_SPRING_TRANSITION,
  DESCRIPTION_WORD_STAGGER_SPREAD,
  TITLE_WORD_EXIT_DURATION,
  TITLE_WORD_EXIT_SPRING_TRANSITION,
  TITLE_WORD_SPRING_TRANSITION,
  TITLE_WORD_STAGGER,
  WORD_ENTER_FILTER,
  WORD_ENTER_OFFSET_Y,
  WORD_EXIT_FILTER,
  WORD_EXIT_OFFSET_Y,
} from './motion'

const SPLIT_WORD_CLASS = 'tx-status-split-word'

export type StaggeredRevealTypographyProps = {
  /** Title = slower word cascade; description = faster. */
  wordMotion: 'title' | 'description'
  text: string
} & Omit<TypographyProps, 'children'>

/**
 * Word-level stagger reveal (via {@link splitText}) with spring enter and
 * staggered exit, coordinated with {@link AnimatePresence} through
 * {@link usePresence}.
 *
 * With `mode="popLayout"`, outgoing and incoming lines can overlap briefly;
 * asymmetric blur (light enter, heavier exit) hides the handoff. Exit timing
 * is read from refs so `safeToRemove` identity changes do not restart the run.
 */
export function StaggeredRevealTypography(
  props: StaggeredRevealTypographyProps
): JSX.Element {
  const { text, wordMotion, sx, ...typographyProps } = props
  const staggerDelay = wordMotion === 'title' ? TITLE_WORD_STAGGER : null
  const springTransition =
    wordMotion === 'title'
      ? TITLE_WORD_SPRING_TRANSITION
      : DESCRIPTION_WORD_SPRING_TRANSITION
  const exitDuration =
    wordMotion === 'title'
      ? TITLE_WORD_EXIT_DURATION
      : DESCRIPTION_WORD_EXIT_DURATION
  const exitSpringTransition =
    wordMotion === 'title'
      ? TITLE_WORD_EXIT_SPRING_TRANSITION
      : DESCRIPTION_WORD_EXIT_SPRING_TRANSITION
  const [isPresent, safeToRemove] = usePresence()
  const reduceMotion = useReducedMotion()
  const textRef = useRef<HTMLElement | null>(null)
  const wordsRef = useRef<readonly HTMLElement[]>([])
  const enterRef = useRef<ReturnType<typeof animate> | null>(null)
  const safeToRemoveRef = useRef(safeToRemove)
  const exitTimingRef = useRef({
    staggerDelay: staggerDelay ?? 0,
    exitDuration,
  })

  safeToRemoveRef.current = safeToRemove

  useLayoutEffect(() => {
    if (!isPresent || reduceMotion || !textRef.current) {
      return
    }

    const target = textRef.current
    target.textContent = text
    const { words } = splitText(target, {
      wordClass: SPLIT_WORD_CLASS,
    })
    wordsRef.current = words
    const wordStagger =
      staggerDelay ??
      (words.length > 1
        ? DESCRIPTION_WORD_STAGGER_SPREAD / (words.length - 1)
        : 0)
    exitTimingRef.current = {
      staggerDelay: wordStagger,
      exitDuration,
    }
    for (const el of words) {
      el.style.opacity = '0'
    }
    enterRef.current?.stop()
    enterRef.current = animate(
      words,
      {
        opacity: [0, 1],
        y: [WORD_ENTER_OFFSET_Y, 0],
        filter: [WORD_ENTER_FILTER, 'blur(0px)'],
      },
      {
        delay: stagger(wordStagger),
        ...springTransition,
      }
    )

    return () => {
      enterRef.current?.stop()
    }
  }, [
    isPresent,
    reduceMotion,
    springTransition,
    staggerDelay,
    exitDuration,
    text,
  ])

  useEffect(() => {
    if (isPresent) {
      return
    }
    if (reduceMotion) {
      queueMicrotask(() => {
        safeToRemoveRef.current?.()
      })
      return
    }

    const words = [...wordsRef.current]
    if (words.length === 0) {
      queueMicrotask(() => {
        safeToRemoveRef.current?.()
      })
      return
    }

    const { staggerDelay: exitStagger } = exitTimingRef.current

    const ctrl = animate(
      words,
      {
        opacity: 0,
        y: WORD_EXIT_OFFSET_Y,
        filter: WORD_EXIT_FILTER,
      },
      {
        delay: stagger(exitStagger, { from: 'first' }),
        ...exitSpringTransition,
      }
    )
    void ctrl.finished.finally(() => {
      safeToRemoveRef.current?.()
    })
    return () => {
      ctrl.stop()
    }
  }, [isPresent, reduceMotion, exitSpringTransition])

  return (
    <Typography
      ref={textRef}
      sx={[
        {
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
