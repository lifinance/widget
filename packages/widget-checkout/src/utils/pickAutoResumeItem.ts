import type { PendingActivityItem } from '../hooks/useCheckoutPendingRecords.js'

// Only a lone in-progress deposit auto-resumes; failed or multiple stay on the funding screen.
export function pickAutoResumeItem(
  items: PendingActivityItem[]
): PendingActivityItem | null {
  const resumable = items.filter(
    (item) =>
      item.state !== 'failed' &&
      Boolean(
        item.record.depositAddress ||
          item.record.transactionHash ||
          item.record.taskId
      )
  )
  return resumable.length === 1 ? resumable[0] : null
}
