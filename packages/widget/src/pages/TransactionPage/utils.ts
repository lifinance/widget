import { LiFiErrorCode, type RouteExtended } from '@lifi/sdk'
import { getFailedStepAction } from '../../stores/routes/utils.js'
import type { WidgetMode } from '../../types/widget.js'
import { formatTokenAmount } from '../../utils/format.js'

export const calculateValueLossPercentage = (
  fromAmountUSD: number,
  toAmountUSD: number,
  gasCostUSD: number,
  feeCostUSD: number
): number => {
  return Number.parseFloat(
    (
      (toAmountUSD / (fromAmountUSD + gasCostUSD + feeCostUSD) - 1) *
      100
    ).toFixed(2)
  )
}

export const getTokenValueLossThreshold = (
  fromAmountUSD: number,
  toAmountUSD: number,
  gasCostUSD: number,
  feeCostUSD: number
): boolean => {
  if (!fromAmountUSD || !toAmountUSD) {
    return false
  }
  return toAmountUSD / (fromAmountUSD + gasCostUSD + feeCostUSD) < 0.9
}

interface AddressGateInput {
  toAddress: string | undefined
  hasActivity: boolean | undefined
  isLoadingAddressActivity: boolean
  isActivityAddressFetched: boolean
  confirmationHidden: boolean
}

const needsAddressConfirmation = ({
  toAddress,
  hasActivity,
  isLoadingAddressActivity,
  isActivityAddressFetched,
  confirmationHidden,
}: AddressGateInput): boolean =>
  Boolean(
    toAddress &&
      !hasActivity &&
      !isLoadingAddressActivity &&
      isActivityAddressFetched &&
      !confirmationHidden
  )

export type RetryGate = 'address' | 'value'

export const getRetryGates = (
  input: AddressGateInput & {
    valueLossExceeded: boolean
    isCustomMode: boolean
  }
): readonly (readonly [gate: RetryGate, needed: boolean])[] => [
  ['address', needsAddressConfirmation(input)],
  ['value', input.valueLossExceeded && !input.isCustomMode],
]

/** Ordering lives here so no sheet decides what follows it — that is how gates came to be skipped. */
export const nextGate = <T extends string>(
  gates: readonly (readonly [gate: T, needed: boolean])[],
  after?: T
): T | undefined => {
  if (!after) {
    return gates.find(([, needed]) => needed)?.[0]
  }
  const index = gates.findIndex(([gate]) => gate === after)
  if (index < 0) {
    return undefined
  }
  return gates.slice(index + 1).find(([, needed]) => needed)?.[0]
}

export const openNextGate = <T extends string>(
  gates: readonly (readonly [gate: T, needed: boolean])[],
  open: Record<T, () => void>,
  done: () => void,
  after?: T
): void => {
  const gate = nextGate(gates, after)
  if (gate) {
    open[gate]()
    return
  }
  done()
}

export type StartGate = 'flagged' | 'address' | 'value'

export const getStartGates = (
  input: AddressGateInput & {
    flaggedTokenCount: number
    valueLossExceeded: boolean
    isCustomMode: boolean
  }
): readonly (readonly [gate: StartGate, needed: boolean])[] => [
  ['flagged', input.flaggedTokenCount > 0],
  ['address', needsAddressConfirmation(input)],
  ['value', input.valueLossExceeded && !input.isCustomMode],
]

// Only these modes show the plain from/to swap form.
const newSwapModes: readonly (WidgetMode | undefined)[] = [
  undefined,
  'default',
  'split',
]

// Try again only waits for the same bundle again.
export const isCallBundleNotFound = (route: RouteExtended): boolean =>
  getFailedStepAction(route)?.action.error?.code ===
  LiFiErrorCode.CallBundleNotFound

// A new swap repeats the whole route.
export const canStartNewSwap = ({
  route,
  mode,
  swapOnly,
}: {
  route: RouteExtended
  mode: WidgetMode | undefined
  swapOnly: boolean
}): boolean => {
  const failed = getFailedStepAction(route)
  if (!failed || !isCallBundleNotFound(route)) {
    return false
  }
  return (
    failed.step === route.steps[0] &&
    route.steps.every(
      (step) => step === failed.step || !step.execution?.actions?.length
    ) &&
    newSwapModes.includes(mode) &&
    // A swap-only form requests no bridges.
    !(swapOnly && route.fromChainId !== route.toChainId)
  )
}

interface NewSwapFormValues {
  fromChain: number
  fromToken: string
  fromAmount: string
  toChain: number
  toToken: string
  toAddress?: string
}

// The last step has the destination; the first can end at an intermediate token.
export const getNewSwapFormValues = (
  route: RouteExtended,
  { keepReceiver = false }: { keepReceiver?: boolean } = {}
): NewSwapFormValues => {
  const { action: fromAction } = route.steps[0]
  const { action: toAction } = route.steps[route.steps.length - 1]
  const receiver = toAction.toAddress
  const values: NewSwapFormValues = {
    fromChain: fromAction.fromChainId,
    fromToken: fromAction.fromToken.address,
    fromAmount: formatTokenAmount(
      BigInt(fromAction.fromAmount),
      fromAction.fromToken.decimals
    ),
    toChain: toAction.toChainId,
    toToken: toAction.toToken.address,
  }
  if (!keepReceiver) {
    values.toAddress =
      receiver &&
      receiver.toLowerCase() !== fromAction.fromAddress?.toLowerCase()
        ? receiver
        : ''
  }
  return values
}
