import type { Easing, Transition, Variants } from 'motion/react'

// ── Constants ───────────────────────────────────────────────────────────────
// Values are taken verbatim from the three motion references this card is
// built from:
//   - HeroStagger      — container stagger + large-reveal inner
//   - Accordion        — outer height + maskImage reveal
//   - Notifications    — per-row popLayout with scaleX + short y

export const STAGGER_INTERVAL = 0.05
export const HERO_OFFSET_Y = 40
export const ACCORDION_DURATION = 0.2
export const TOAST_EXIT_DURATION = 0.12
export const TOAST_EASE_OUT: Easing = [0.215, 0.61, 0.355, 1]

export const MASK_OPEN =
  'linear-gradient(to bottom, black 100%, transparent 100%)'
export const MASK_CLOSED =
  'linear-gradient(to bottom, black 50%, transparent 100%)'

export const HERO_ITEM_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 26,
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
  visible: { transition: { staggerChildren: STAGGER_INTERVAL } },
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
// Card-level slots (icon, title, description, checklist section wrapper).
// Large 40px rise + blur + opacity via spring(120, 20).

export const heroInnerVariants: Variants = {
  hidden: { opacity: 0, y: HERO_OFFSET_Y, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: HERO_ITEM_TRANSITION,
  },
}

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

// ── Text reveal (title / description content change) ────────────────────────
// Subtle vertical nudge paired with blur + opacity. Designed to be used
// with `AnimatePresence mode="popLayout"` so the outgoing text is popped
// out of the layout flow while the new text takes its place — the two
// coexist visually for a short beat, which removes the empty-slot gap
// that `mode="wait"` produces. The small offset + low blur keep the
// crossover from reading as distortion.

export const TEXT_REVEAL_OFFSET_Y = 4
export const TEXT_REVEAL_BLUR = 2.5

export const textRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: TEXT_REVEAL_OFFSET_Y,
    filter: `blur(${TEXT_REVEAL_BLUR}px)`,
    transition: TOAST_EXIT_TRANSITION,
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: TOAST_ITEM_TRANSITION,
  },
  exiting: {
    opacity: 0,
    y: -TEXT_REVEAL_OFFSET_Y,
    filter: `blur(${TEXT_REVEAL_BLUR}px)`,
    transition: TOAST_EXIT_TRANSITION,
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
