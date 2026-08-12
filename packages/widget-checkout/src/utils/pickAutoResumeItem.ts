import type { ActivityItem } from '../hooks/useCheckoutActivity.js'

// A lone pending item auto-resumes. Terminal items never auto-resume (a
// cold cache must not land the user on a stale done/failed order), and while
// any item's phase hasn't resolved its first poll yet, we hold off entirely
// rather than risk committing to the wrong item once it loads.
export function pickAutoResumeItem(items: ActivityItem[]): ActivityItem | null {
  const pending = items.filter((item) => item.phase === 'pending')
  return pending.length === 1 && items.every((item) => item.phase !== undefined)
    ? pending[0]
    : null
}
