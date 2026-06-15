import type { Route } from '@lifi/sdk'
import type {
  CheckoutDepositAddressBearer,
  CheckoutRoute,
} from '../types/checkoutRoute.js'

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.length > 0

const readDepositField = (
  value: CheckoutDepositAddressBearer | undefined | null
): string | null => {
  if (!value) {
    return null
  }
  return isNonEmptyString(value.depositAddress) ? value.depositAddress : null
}

/**
 * IntentFactory `/v1/advanced/stepTransaction` responses expose the deposit
 * address on `step.estimate.toolData.depositAddress`. Falls back to
 * `route.depositAddress`, `step.toolData`, and `step.action.depositAddress`
 * for older route shapes / forward compatibility (CORE-203).
 */
export function extractDepositAddress(
  route: Route | undefined | null
): string | null {
  if (!route) {
    return null
  }
  const r = route as CheckoutRoute

  const top = readDepositField(r)
  if (top) {
    return top
  }

  for (const step of r.steps ?? []) {
    const fromEstimate = readDepositField(step.estimate?.toolData)
    if (fromEstimate) {
      return fromEstimate
    }
    const fromTool = readDepositField(step.toolData)
    if (fromTool) {
      return fromTool
    }
    const fromAction = readDepositField(step.action)
    if (fromAction) {
      return fromAction
    }
    for (const sub of step.includedSteps ?? []) {
      const subEstimate = readDepositField(sub.estimate?.toolData)
      if (subEstimate) {
        return subEstimate
      }
      const subTool = readDepositField(sub.toolData)
      if (subTool) {
        return subTool
      }
      const subAction = readDepositField(sub.action)
      if (subAction) {
        return subAction
      }
    }
  }

  return null
}
