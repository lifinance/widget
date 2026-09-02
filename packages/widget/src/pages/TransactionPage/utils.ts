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
  toAddress?: string
  hasActivity?: boolean
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
