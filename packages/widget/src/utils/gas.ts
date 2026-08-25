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
