export const calculateValueLossPercentage = (
  fromAmountUSD: number,
  toAmountUSD: number,
  gasCostUSD: number,
  feeCostUSD: number
) => {
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
) => {
  if (!fromAmountUSD || !toAmountUSD) {
    return false
  }
  return toAmountUSD / (fromAmountUSD + gasCostUSD + feeCostUSD) < 0.9
}
