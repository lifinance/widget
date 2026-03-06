import type { ExecutionAction } from '@lifi/sdk'

// NB: New SDK adds new actions - merge them into old TOKEN_ALLOWANCE before UI changes
const allowanceTypes = new Set([
  'NATIVE_PERMIT',
  'CHECK_ALLOWANCE',
  'RESET_ALLOWANCE',
  'SET_ALLOWANCE',
])

export function prepareActions(
  actions: ExecutionAction[]
): ExecutionAction[][] {
  const groups = new Map<string | number, ExecutionAction[]>()
  for (const action of actions) {
    const key = allowanceTypes.has(action.type)
      ? 'TOKEN_ALLOWANCE'
      : action.type
    const group = groups.get(key)
    if (group) {
      group.push(action)
    } else {
      groups.set(key, [action])
    }
  }
  return [...groups.values()]
}
