import type { LiFiStepExtended, RouteExtended } from '@lifi/sdk'
import { ChainType } from '@lifi/sdk'

/**
 * Returns how much of a step's gas token the route itself delivers before that
 * step runs. The previous step must output the gas token on the same chain, and
 * whatever this step consumes as input is not available for gas.
 * Stellar routes only — they bridge XLM to the receiver and hold back a buffer
 * for the account reserve and the destination step fees.
 */
export const getSelfFundedGasAmount = (
  route: RouteExtended,
  step: LiFiStepExtended,
  gasChainType?: ChainType
): bigint => {
  // TODO: remove the chain gate when the backend reserves gas on every chain
  if (gasChainType !== ChainType.STL) {
    return 0n
  }
  const gasToken = step.estimate.gasCosts?.[0]?.token
  const previousStep = route.steps[route.steps.indexOf(step) - 1]
  if (!gasToken || !previousStep) {
    return 0n
  }
  const { toToken } = previousStep.action
  if (
    toToken.chainId !== gasToken.chainId ||
    toToken.address.toLowerCase() !== gasToken.address.toLowerCase()
  ) {
    return 0n
  }
  const deliveredAmount = BigInt(previousStep.estimate.toAmountMin)
  const consumedAmount =
    step.action.fromToken.address.toLowerCase() ===
    gasToken.address.toLowerCase()
      ? BigInt(step.action.fromAmount)
      : 0n
  return deliveredAmount > consumedAmount
    ? deliveredAmount - consumedAmount
    : 0n
}

/**
 * Returns how much of a step's gas the user has to hold themselves. The route
 * can deliver part of that gas, and only the shortfall comes out of the
 * balance. Returns zero when the route already covers the whole cost.
 */
export const getRequiredGasAmount = (
  route: RouteExtended,
  step: LiFiStepExtended,
  gasChainType?: ChainType
): bigint => {
  const gasCostAmount = (step.estimate.gasCosts ?? []).reduce(
    (amount, gasCost) => amount + BigInt(Number(gasCost.amount).toFixed(0)),
    0n
  )
  const selfFundedGasAmount = getSelfFundedGasAmount(route, step, gasChainType)
  return gasCostAmount > selfFundedGasAmount
    ? gasCostAmount - selfFundedGasAmount
    : 0n
}
