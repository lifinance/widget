import type { Easing, Transition, Variants } from 'motion/react'

// ── Constants ───────────────────────────────────────────────────────────────
// Values are taken verbatim from the three motion references this card is
// built from:
//   - HeroStagger      — container stagger + large-reveal inner
//   - Accordion        — outer height + maskImage reveal
//   - Notifications    — per-row popLayout with scaleX + short y

export const STAGGER_INTERVAL = 0.05

/** Delay between major card regions (body column vs checklist). */
export const CARD_SECTION_STAGGER = 0.12
export const HERO_OFFSET_Y = 24
export const ACCORDION_DURATION = 0.2
export const TOAST_EXIT_DURATION = 0.12
export const TOAST_EASE_OUT: Easing = [0.215, 0.61, 0.355, 1]

export const MASK_OPEN =
  'linear-gradient(to bottom, black 100%, transparent 100%)'
export const MASK_CLOSED =
  'linear-gradient(to bottom, black 50%, transparent 100%)'

export const HERO_ITEM_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 320,
  damping: 32,
  bounce: 0,
}

export const TOAST_ITEM_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 360,
  damping: 28,
  bounce: 0,
}

export const TOAST_EXIT_TRANSITION: Transition = {
  duration: TOAST_EXIT_DURATION,
  ease: TOAST_EASE_OUT,
}

// ── Container (hero) ────────────────────────────────────────────────────────
// Card body wraps every slot. On mount, animate="visible" cascades through
// children via staggerChildren, recreating HeroStagger's reveal.

export const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: CARD_SECTION_STAGGER } },
}

// ── Outer layer (accordion) ─────────────────────────────────────────────────
// Height + maskImage reveal with overflow hidden on the element. Used for
// any slot whose presence toggles at runtime (description, checklist
// section, each checklist row).

export const outerVariants: Variants = {
  hidden: {
    height: 0,
    maskImage: MASK_CLOSED,
    transition: { duration: ACCORDION_DURATION },
  },
  visible: {
    height: 'auto',
    maskImage: MASK_OPEN,
    transition: { duration: ACCORDION_DURATION },
  },
}

// Row outer carries the same accordion, but uses toast timing on exit so
// the height collapse matches the row's snappy notification-style exit.
// This is what grows the card's height as new rows arrive — without it
// the parent jumps to its new size instantly.
export const rowOuterVariants: Variants = {
  hidden: {
    height: 0,
    maskImage: MASK_CLOSED,
    transition: TOAST_EXIT_TRANSITION,
  },
  visible: {
    height: 'auto',
    maskImage: MASK_OPEN,
    transition: { duration: ACCORDION_DURATION },
  },
}

// ── Inner: Hero flavor ──────────────────────────────────────────────────────
// Card-level slots (icon, checklist section wrapper, VC). Moderate rise + blur
// — scaled for compact transaction copy, snappier than marketing hero blocks.

export const heroInnerVariants: Variants = {
  hidden: { opacity: 0, y: HERO_OFFSET_Y, filter: 'blur(2px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: HERO_ITEM_TRANSITION,
  },
}

/** Slot wrapper for split-text blocks — participates in parent stagger only. */
export const textSlotVariants: Variants = {
  hidden: {},
  visible: {},
}

// ── Split text (title / description word stagger) ───────────────────────────
// Shared spatial + blur; title is slower / more legible, description snappier.

/** Vertical travel (px) for split-word enter / exit — keep small vs body text. */
export const WORD_ENTER_OFFSET_Y = 0

export const WORD_EXIT_OFFSET_Y = 0

/**
 * Blur masks handoffs when `popLayout` overlaps outgoing + incoming word spans.
 * Enter stays minimal; exit is stronger so the outgoing line reads as receding.
 */
export const WORD_ENTER_FILTER = 'blur(0.35px)'

export const WORD_EXIT_FILTER = 'blur(0.35px)'

/** Exit easing for split-word out animations (matches toast-style snap). */
export const WORD_EXIT_EASE: Easing = TOAST_EASE_OUT

export const TITLE_WORD_STAGGER = 0.05

export const TITLE_WORD_SPRING_TRANSITION: Transition = {
  type: 'spring',
  bounce: 0,
}

export const DESCRIPTION_WORD_SPRING_TRANSITION: Transition = {
  type: 'spring',
  bounce: 0,
}

export const TITLE_WORD_EXIT_DURATION = 0.15

/** Target total stagger spread (seconds) for description words. */
export const DESCRIPTION_WORD_STAGGER_SPREAD = 0.15

export const TITLE_WORD_EXIT_SPRING_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
  bounce: 0,
}

export const DESCRIPTION_WORD_EXIT_SPRING_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 36,
  bounce: 0,
}

export const DESCRIPTION_WORD_EXIT_DURATION = 0.085

// ── Atomic swap (icon content change) ───────────────────────────────────────
// Content morphing in place inside an always-present slot. Blur + opacity
// only — no spatial travel, since the slot itself isn't moving.

export const atomicSwapVariants: Variants = {
  hidden: {
    opacity: 0,
    filter: 'blur(4px)',
    transition: TOAST_EXIT_TRANSITION,
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: TOAST_ITEM_TRANSITION,
  },
}

// ── Icon morph (execution status indicator change) ──────────────────────────
// Near-invisible crossfade. Paired with `AnimatePresence mode="popLayout"`
// the outgoing and incoming icons share the slot simultaneously for the
// brief duration of the transition, so the swap reads as the icon
// softening and re-settling rather than a visible in/out animation.
// A tiny blur smooths the handoff without any spatial motion.

export const ICON_MORPH_DURATION = 0.18

export const iconMorphVariants: Variants = {
  hidden: {
    opacity: 0,
    filter: 'blur(1.5px)',
    transition: { duration: ICON_MORPH_DURATION, ease: TOAST_EASE_OUT },
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: ICON_MORPH_DURATION, ease: TOAST_EASE_OUT },
  },
}

// ── Reduced motion fallbacks ────────────────────────────────────────────────
// `MotionConfig reducedMotion="user"` at the card root strips transforms
// globally, but explicit variants let components choose exactly which
// states remain (e.g., checklist rows need a three-state fallback).

export const reducedInnerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}
