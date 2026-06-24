const A_CODE_POINT = 'A'.charCodeAt(0)
const REGIONAL_INDICATOR_A = 0x1f1e6

const CURRENCY_REGION_OVERRIDES: Record<string, string> = {
  EUR: 'EU',
  USD: 'US',
  GBP: 'GB',
}

export function currencyToFlag(currency: string): string {
  const upper = currency.toUpperCase()
  const region = CURRENCY_REGION_OVERRIDES[upper] ?? upper.slice(0, 2)
  if (!/^[A-Z]{2}$/.test(region)) {
    return '💱'
  }
  const chars = [...region].map((char) =>
    String.fromCodePoint(
      REGIONAL_INDICATOR_A + (char.charCodeAt(0) - A_CODE_POINT)
    )
  )
  return chars.join('')
}
