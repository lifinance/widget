import type { CSSProperties } from 'react'

/** Pixel offset of a fixed widget header. Non-lengths count as zero. */
export const fixedHeaderTopOffset = (top: CSSProperties['top']): number => {
  if (typeof top === 'number' && Number.isFinite(top)) {
    return Math.max(top, 0)
  }
  if (typeof top === 'string') {
    const parsed = Number.parseFloat(top)
    return Number.isFinite(parsed) ? Math.max(parsed, 0) : 0
  }
  return 0
}
