import type { Transition, Variants } from 'motion/react'

// ── Easing ──────────────────────────────────────────────────────────────────

export const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]
export const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1]

// ── Layout transition ──────────────────────────────────────────────────────
// Used for `layout` / `layout="position"` on elements that need to slide
// smoothly when siblings change size (e.g., rows section when description
// above appears). Matches the section enter timing for cohesion.

export const layoutTransition: Transition = { duration: 0.4, ease: EASE }

// ── Timing system ───────────────────────────────────────────────────────────

const CASCADE = { desc: 0.12, rows: 0.18 }

// ── Custom data ─────────────────────────────────────────────────────────────

export interface MotionCustom {
  s: number
  index?: number
}

function t(c: MotionCustom): number {
  return c?.s ?? 1
}

// ── Text animation ──────────────────────────────────────────────────────────
// Pure opacity + y-translate. Used for title text swap (no clipping parent)
// and for description inner text (parent clips, so inner uses opacity only —
// see descriptionTextVariants).

function fadeYVariants(enterDelay = 0): Variants {
  return {
    enter: (c: MotionCustom) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35 * t(c),
        delay: enterDelay * t(c),
        ease: EASE,
      },
    }),
    exit: (c: MotionCustom) => ({
      opacity: 0,
      y: -4,
      filter: 'blur(4px)',
      transition: { duration: 0.15 * t(c), ease: EASE_OUT },
    }),
  }
}

// ── Section animation ──────────────────────────────────────────────────────
// Wrapper: height: 0 → auto + opacity (overflow: hidden on wrapper).
// Sonner-style sync — height and opacity at same duration with cascade.
// This is the proven pattern: smooth container growth, content reveals
// via clipping. Used by description and action rows section.

function sectionWrapperVariants(cascadeDelay: number): Variants {
  return {
    enter: (c: MotionCustom) => ({
      height: 'auto',
      opacity: 1,
      transition: {
        duration: 0.4 * t(c),
        delay: cascadeDelay * t(c),
        ease: EASE,
      },
    }),
    exit: (c: MotionCustom) => ({
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.2 * t(c),
        ease: EASE_OUT,
      },
    }),
  }
}

// ── Exports: Icon ───────────────────────────────────────────────────────────
// Pure scale + opacity + y. NO layout interference from parents.

export const iconVariants: Variants = {
  enter: (c: MotionCustom) => ({
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { duration: 0.35 * t(c), ease: EASE },
  }),
  exit: (c: MotionCustom) => ({
    scale: 0.95,
    opacity: 0,
    filter: 'blur(4px)',
    transition: { duration: 0.15 * t(c), ease: EASE_OUT },
  }),
}

export const iconInitial: { scale: number; opacity: number; y: number } = {
  scale: 0.9,
  opacity: 0,
  y: 6,
}

// ── Exports: Title ──────────────────────────────────────────────────────────

export const titleTextVariants: Variants = fadeYVariants(0)
export const titleTextInitial: { opacity: number; y: number } = {
  opacity: 0,
  y: 6,
}

// ── Exports: Description ────────────────────────────────────────────────────
// Wrapper: height + opacity (proven section pattern).
// Inner text: opacity only — no y-translate. The wrapper's height growth
// IS the spatial reveal; adding y inside the clipping frame causes the
// "cut off" misalignment.

export const descriptionVariants: Variants = sectionWrapperVariants(
  CASCADE.desc
)
export const descriptionInitial: { height: number; opacity: number } = {
  height: 0,
  opacity: 0,
}

export const descriptionTextVariants: Variants = {
  enter: (c: MotionCustom) => ({
    opacity: 1,
    transition: { duration: 0.3 * t(c), ease: EASE },
  }),
  exit: (c: MotionCustom) => ({
    opacity: 0,
    filter: 'blur(4px)',
    transition: { duration: 0.15 * t(c), ease: EASE_OUT },
  }),
}

export const descriptionTextInitial: { opacity: number } = { opacity: 0 }

// ── Exports: Action row section ─────────────────────────────────────────────

export const sectionVariants: Variants = sectionWrapperVariants(CASCADE.rows)
export const sectionInitial: { height: number; opacity: number } = {
  height: 0,
  opacity: 0,
}

// ── Exports: Action row items ───────────────────────────────────────────────
// Items: height + y + opacity. Each item grows with subtle upward drift.
// Stagger 70ms makes each row a distinct milestone.

const STAGGER_GAP = 0.07

export const itemVariants: Variants = {
  enter: (c: MotionCustom) => {
    const delay = (c.index ?? 0) * STAGGER_GAP * t(c)
    return {
      opacity: 1,
      height: 'auto',
      y: 0,
      transition: {
        duration: 0.3 * t(c),
        delay,
        ease: EASE_OUT,
      },
    }
  },
  exit: (c: MotionCustom) => ({
    opacity: 0,
    height: 0,
    y: -4,
    transition: {
      duration: 0.15 * t(c),
      ease: EASE_OUT,
    },
  }),
}

export const itemInitial: { opacity: number; height: number; y: number } = {
  opacity: 0,
  height: 0,
  y: 4,
}
