export function normalizeFiatAmount(input: string): string {
  return input.trim().replace(',', '.')
}

const numberFormatCache = new Map<string, Intl.NumberFormat>()
const symbolCache = new Map<string, string>()
const displayNamesCache = new Map<string, Intl.DisplayNames | null>()

function getNumberFormat(
  language: string,
  currency: string
): Intl.NumberFormat {
  const key = `${language}:${currency}`
  let formatter = numberFormatCache.get(key)
  if (!formatter) {
    formatter = new Intl.NumberFormat(language, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    })
    numberFormatCache.set(key, formatter)
  }
  return formatter
}

export function formatFiat(
  value: string,
  currency: string,
  language: string
): string {
  const parsed = Number.parseFloat(value)
  if (!Number.isFinite(parsed)) {
    return `${value} ${currency}`
  }
  try {
    return getNumberFormat(language, currency).format(parsed)
  } catch {
    return `${value} ${currency}`
  }
}

export function getCurrencySymbol(currency: string, language: string): string {
  const key = `${language}:${currency}`
  const cached = symbolCache.get(key)
  if (cached !== undefined) {
    return cached
  }
  let symbol = currency
  try {
    symbol =
      new Intl.NumberFormat(language, {
        style: 'currency',
        currency,
        currencyDisplay: 'narrowSymbol',
      })
        .formatToParts(0)
        .find((part) => part.type === 'currency')?.value ?? currency
  } catch {
    symbol = currency
  }
  symbolCache.set(key, symbol)
  return symbol
}

export function getCurrencyName(currency: string, language: string): string {
  let displayNames = displayNamesCache.get(language)
  if (displayNames === undefined) {
    try {
      displayNames = new Intl.DisplayNames(language, { type: 'currency' })
    } catch {
      displayNames = null
    }
    displayNamesCache.set(language, displayNames)
  }
  if (!displayNames) {
    return currency
  }
  try {
    return displayNames.of(currency) ?? currency
  } catch {
    return currency
  }
}
