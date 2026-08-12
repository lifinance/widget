import type { ActivityItem } from '../hooks/useCheckoutActivity.js'
import { isAwaitingUserAction } from './orderStatusView.js'

// A lone in-flight pending item auto-resumes. Terminal items never auto-resume
// (a cold cache must not land the user on a stale done/failed order), and while
// any item's phase hasn't resolved its first poll yet, we hold off entirely
// rather than risk committing to the wrong item once it loads. An item still
// awaiting the user's own deposit/payment is excluded as well: resuming it
// lands on a progress screen with nothing to act on, so it stays tappable in
// the activity list instead.
export function pickAutoResumeItem(items: ActivityItem[]): ActivityItem | null {
  const pending = items.filter(
    (item) => item.phase === 'pending' && !isAwaitingUserAction(item.order)
  )
  return pending.length === 1 && items.every((item) => item.phase !== undefined)
    ? pending[0]
    : null
}
