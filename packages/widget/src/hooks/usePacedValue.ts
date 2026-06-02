import { useEffect, useRef, useState } from 'react'

/** Smallest gap between UI updates, in milliseconds. */
const DISPLAY_INTERVAL = 1200

/**
 * Returns `live`, but changes it at most once every {@link DISPLAY_INTERVAL}
 * milliseconds. If `live` changes several times within that window, only the
 * newest value is shown.
 *
 * Set `paced` to `false` to turn this off and update on every change.
 */
export function usePacedValue<T>(live: T, paced = true): T {
  const [value, setValue] = useState(live)

  const shown = useRef(live)
  // 0 so the first update shows immediately, then throttles.
  const windowStart = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    if (live === shown.current) {
      return
    }
    if (!paced) {
      shown.current = live
      setValue(live)
      return
    }
    const show = () => {
      windowStart.current = Date.now()
      shown.current = live
      setValue(live)
    }
    const remaining = windowStart.current + DISPLAY_INTERVAL - Date.now()
    if (remaining <= 0) {
      show()
      return
    }
    timer.current = setTimeout(show, remaining)
    return () => clearTimeout(timer.current)
  }, [live, paced])

  return value
}
