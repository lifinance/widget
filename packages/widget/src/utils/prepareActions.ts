import type { ExecutionAction } from '@lifi/sdk'

// NB: New SDK adds new actions - merge them into old TOKEN_ALLOWANCE before UI changes
export function prepareActions(
  actions: ExecutionAction[]
): ExecutionAction[][] {
  const keyOrder: (string | number)[] = []
  const keyToGroup = new Map<string | number, ExecutionAction[]>()
  actions.forEach((action) => {
    const key = [
      'NATIVE_PERMIT',
      'CHECK_ALLOWANCE',
      'RESET_ALLOWANCE',
      'SET_ALLOWANCE',
    ].includes(action.type)
      ? 'TOKEN_ALLOWANCE'
      : action.type
    if (!keyToGroup.has(key)) {
      keyOrder.push(key)
      keyToGroup.set(key, [])
    }
    keyToGroup.get(key)!.push(action)
  })
  return keyOrder.map((k) => keyToGroup.get(k)!)
}
