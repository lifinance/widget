import { useCallback, useEffect, useRef, useState } from 'react'

/** Smallest gap between UI updates, in milliseconds. */
const DISPLAY_INTERVAL = 1200

/**
 * Limits how often `live` updates the UI to once per {@link DISPLAY_INTERVAL}.
 * If `live` changes several times quickly, only the latest value is shown once
 * the interval passes.
 *
 * @remarks
 * The interval is measured from mount, so a just-mounted hook holds its first
 * value for one interval (time for an animation to play), while one mounted
 * longer shows the next change right away. With `paced` set to `false`, `live`
 * passes through unchanged. `flush` shows a value now and restarts the interval.
 *
 * @returns `value` to render, and `flush` to show a value immediately.
 */
export function usePacedValue<T>(
  live: T,
  paced = true
): {
  value: T
  flush: (next: T) => void
} {
  const [value, setValue] = useState(live)

  // Set once at mount, not on every render.
  const windowStart = useRef<number | null>(null)
  if (windowStart.current === null) {
    windowStart.current = Date.now()
  }

  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const emit = useCallback((next: T): void => {
    clearTimeout(timer.current)
    windowStart.current = Date.now()
    setValue(next)
  }, [])

  useEffect(() => {
    // Not pacing: show live as-is. We don't restart the interval here, so the
    // first paced update later isn't delayed.
    if (!paced) {
      setValue(live)
      return
    }
    const remaining = windowStart.current! + DISPLAY_INTERVAL - Date.now()
    if (remaining <= 0) {
      emit(live)
      return
    }
    // Otherwise wait it out, then show the latest live. A newer live cancels and
    // reschedules this (via cleanup), so quick bursts become a single update.
    timer.current = setTimeout(() => emit(live), remaining)
    return () => clearTimeout(timer.current)
  }, [live, paced, emit])

  return { value, flush: emit }
}
