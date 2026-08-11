import type { ActivityItem } from '../hooks/useCheckoutActivity.js'

// A lone item that's still pending (or hasn't resolved its first poll yet)
// auto-resumes; anything terminal, failed, or with siblings stays on the
// funding screen for the user to pick.
export function pickAutoResumeItem(items: ActivityItem[]): ActivityItem | null {
  const pending = items.filter(
    (item) => item.phase === 'pending' || item.phase === undefined
  )
  return pending.length === 1 ? pending[0] : null
}
