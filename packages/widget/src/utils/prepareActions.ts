import type { ExecutionAction } from '@lifi/sdk'

/** Group actions by `group`; group order = first appearance.
 * Undefined `group` → single-action group. */
export function prepareActions(
  actions: ExecutionAction[]
): ExecutionAction[][] {
  const keyOrder: (string | number)[] = []
  const keyToGroup = new Map<string | number, ExecutionAction[]>()
  actions.forEach((action) => {
    const key = action.group ?? action.type
    if (!keyToGroup.has(key)) {
      keyOrder.push(key)
      keyToGroup.set(key, [])
    }
    keyToGroup.get(key)!.push(action)
  })
  return keyOrder.map((k) => keyToGroup.get(k)!)
}
