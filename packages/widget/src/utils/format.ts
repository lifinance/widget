import { formatUnits } from 'viem'

/**
 * Format token amount to at least 6 decimals.
 * @param amount amount to format.
 * @returns formatted amount.
 */
export function formatTokenAmount(
  amount: bigint | undefined,
  decimals: number
) {
  const formattedAmount = amount ? formatUnits(amount, decimals) : '0'
  const parsedAmount = Number.parseFloat(formattedAmount)
  if (!parsedAmount || Number.isNaN(Number(formattedAmount))) {
    return '0'
  }

  return formattedAmount
}

export function formatSlippage(
  slippage = '',
  defaultValue = '',
  returnInitial = false
): string {
  if (!slippage) {
    return slippage
  }
  const parsedSlippage = Number.parseFloat(slippage)
  if (Number.isNaN(Number(slippage)) && !Number.isNaN(parsedSlippage)) {
    return parsedSlippage.toString()
  }
  if (Number.isNaN(parsedSlippage)) {
    return defaultValue
  }
  if (parsedSlippage >= 100) {
    return '100'
  }
  if (parsedSlippage < 0) {
    return Math.abs(parsedSlippage).toString()
  }
  if (returnInitial) {
    return slippage
  }
  return parsedSlippage.toString()
}

/**
 * Formats a user input amount string, normalizing it and optionally limiting decimal places.
 * @param amount - The amount string to format (e.g., '123.45', '1,23', '0..')
 * @param decimals - Maximum number of decimal places to allow. If null, no limit is applied.
 * @param returnInitial - If true, preserves the input format during typing (e.g., keeps trailing dots,
 *                        preserves leading zeros, keeps negative signs). If false (default), cleans up the
 *                        format on blur (removes leading/trailing zeros, removes negative signs).
 * @returns The formatted amount string, or empty string for invalid input.
 */
export function formatInputAmount(
  amount: string,
  decimals: number | null = null,
  returnInitial = false
) {
  if (!amount) {
    return amount
  }

  // Replace commas with dots
  let formattedAmount = amount.trim().replaceAll(',', '.')

  // Keep only the first dot, remove all subsequent dots
  const dotIndex = formattedAmount.indexOf('.')
  if (dotIndex !== -1) {
    formattedAmount = `${formattedAmount.slice(0, dotIndex + 1)}${formattedAmount.slice(dotIndex + 1).replaceAll('.', '')}`
  }

  // If the amount starts with a dot, prepend 0
  if (
    (!returnInitial && formattedAmount.startsWith('.')) ||
    formattedAmount === '.'
  ) {
    formattedAmount = `0${formattedAmount}`
  }

  // Parse the valid part of the amount
  const parsedAmount = Number.parseFloat(formattedAmount)
  if (Number.isNaN(Number(formattedAmount)) && !Number.isNaN(parsedAmount)) {
    formattedAmount = parsedAmount.toString()
  }
  if (Number.isNaN(Math.abs(Number(formattedAmount)))) {
    return ''
  }

  // Split and limit decimals
  let [integer, fraction = ''] = formattedAmount.split('.')
  if (decimals !== null && fraction.length > decimals) {
    fraction = fraction.slice(0, decimals)
  }

  if (returnInitial) {
    if (!fraction) {
      return formattedAmount
    }
    return `${integer}${fraction ? `.${fraction}` : ''}`
  }

  // Remove leading zeros and minus sign
  integer = integer.replace(/^0+|-/, '')
  // Remove trailing zeros
  fraction = fraction.replace(/(0+)$/, '')

  return `${integer || (fraction ? '0' : '')}${fraction ? `.${fraction}` : ''}`
}

export function formatTokenPrice(
  amount?: string | bigint,
  price?: string,
  decimals?: number
) {
  if (!amount || !price) {
    return 0
  }

  const formattedAmount =
    typeof amount === 'bigint' && decimals !== undefined
      ? formatUnits(amount, decimals)
      : amount.toString()

  if (Number.isNaN(Number(formattedAmount)) || Number.isNaN(Number(price))) {
    return 0
  }
  return Number.parseFloat(formattedAmount) * Number.parseFloat(price)
}

/**
 * Formatter for price value to token amount
 */
const formatter = new Intl.NumberFormat('en', {
  notation: 'standard',
  roundingPriority: 'morePrecision',
  maximumSignificantDigits: 20,
  maximumFractionDigits: 20,
  useGrouping: false,
})

/**
 * Convert price value to token amount
 */
export function priceToTokenAmount(priceValue: string, priceUSD?: string) {
  if (!priceValue || !priceUSD) {
    return '0'
  }

  const numericPriceValue = Number.parseFloat(priceValue)
  const numericPrice = Number.parseFloat(priceUSD)

  if (
    Number.isNaN(numericPriceValue) ||
    Number.isNaN(numericPrice) ||
    !numericPrice
  ) {
    return '0'
  }

  return formatter.format(numericPriceValue / numericPrice)
}

const units = [
  ['day', 86400],
  ['hour', 3600],
  ['minute', 60],
  ['second', 1],
] as const

export function formatDuration(seconds: number, locale: string): string {
  const match = units.find(([, v]) => seconds >= v)
  const amount = match ? Math.floor(seconds / match[1]) : 0
  const unit = match?.[0] ?? 'second'

  return amount.toLocaleString(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'narrow',
  })
}

export function wrapLongWords(text: string): string {
  return text.replace(
    /\S{32,}/g,
    (word) => `${word.slice(0, 8)}...${word.slice(-4)}`
  )
}
