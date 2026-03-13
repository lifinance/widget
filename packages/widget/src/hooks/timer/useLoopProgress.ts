import { useEffect, useRef, useState } from 'react'

interface UseLoopProgressOptions {
  active: boolean
  durationMs: number
  tickMs: number
}

/**
 * Returns a 0–100 progress value that continuously loops over `durationMs`,
 * updating every `tickMs`. Useful for animating indeterminate progress rings
 * when the actual duration is unknown. The loop resets whenever `active` flips
 * from false to true.
 */
export function useLoopProgress({
  active,
  durationMs,
  tickMs,
}: UseLoopProgressOptions): number {
  const [progress, setProgress] = useState(0)
  const startRef = useRef(0)

  useEffect(() => {
    if (!active) {
      return
    }
    startRef.current = Date.now()
    const id = setInterval(() => {
      const elapsed = (Date.now() - startRef.current) % durationMs
      setProgress((elapsed / durationMs) * 100)
    }, tickMs)
    return () => clearInterval(id)
  }, [active, durationMs, tickMs])

  return progress
}
