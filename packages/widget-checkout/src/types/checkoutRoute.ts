import type { Action, Estimate, LiFiStep, Route, Step } from '@lifi/sdk'

/**
 * Intent-factory routes expose a `depositAddress` on the route itself and on
 * `step.estimate.toolData` (after the `/v1/advanced/stepTransaction` call).
 * The SDK's public `Route` / `Step` types do not declare either yet, so we
 * widen here. Remove this file once the SDK ships first-class typings
 * (CORE-203).
 */
export interface CheckoutDepositAddressBearer {
  depositAddress?: string
}

export type CheckoutAction = Action & CheckoutDepositAddressBearer

export type CheckoutEstimate = Estimate & {
  toolData?: CheckoutDepositAddressBearer
}

export type CheckoutInnerStep = Omit<Step, 'action' | 'estimate'> & {
  action: CheckoutAction
  estimate: CheckoutEstimate
  toolData?: CheckoutDepositAddressBearer
}

export type CheckoutStep = Omit<
  LiFiStep,
  'action' | 'estimate' | 'includedSteps'
> & {
  action: CheckoutAction
  estimate: CheckoutEstimate
  toolData?: CheckoutDepositAddressBearer
  includedSteps: CheckoutInnerStep[]
}

export type CheckoutRoute = Omit<Route, 'steps'> &
  CheckoutDepositAddressBearer & {
    steps: CheckoutStep[]
  }
