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

/**
 * The next gate to open before a transaction starts, given the gates in order
 * and the one the user just cleared. Returns undefined when none is left, so
 * the caller executes. Keeping the order in one place stops each sheet from
 * deciding what follows it, which is how gates came to be skipped.
 */
export const nextGate = <T extends string>(
  gates: readonly (readonly [gate: T, needed: boolean])[],
  after?: T
): T | undefined => {
  const start = after ? gates.findIndex(([gate]) => gate === after) + 1 : 0
  return gates.slice(start).find(([, needed]) => needed)?.[0]
}
