const STAGGER_INTERVAL_MS = 1200

let pending: (() => void) | null = null
let lastFlushAt = 0
let timer: ReturnType<typeof setTimeout> | null = null

export const enqueueStaggered = (task: () => void): void => {
  pending = task
  if (timer) {
    return
  }
  const delay = Math.max(0, lastFlushAt + STAGGER_INTERVAL_MS - Date.now())
  timer = setTimeout(drain, delay)
}

const drain = (): void => {
  timer = null
  const task = pending
  pending = null
  if (!task) {
    return
  }
  lastFlushAt = Date.now()
  task()
}

/**
 * Mark a direct (ungated) update so the next `enqueueStaggered` call is
 * throttled the full interval from this moment. Used when an action bypasses
 * the queue (e.g. restartRoute's sync flip from Failed → Pending) and we
 * still want the SDK's first follow-up update to space out, not stack.
 */
export const markStaggeredFlush = (): void => {
  lastFlushAt = Date.now()
}
