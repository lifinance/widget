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
  if (parsedSlippage > 100) {
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

export function formatInputAmount(
  amount: string,
  decimals: number | null = null,
  returnInitial = false
) {
  if (!amount) {
    return amount
  }
  let formattedAmount = amount.trim().replaceAll(',', '.')
  if (formattedAmount.startsWith('.')) {
    formattedAmount = `0${formattedAmount}`
  }
  const parsedAmount = Number.parseFloat(formattedAmount)
  if (Number.isNaN(Number(formattedAmount)) && !Number.isNaN(parsedAmount)) {
    return parsedAmount.toString()
  }
  if (Number.isNaN(Math.abs(Number(formattedAmount)))) {
    return ''
  }
  if (returnInitial) {
    return formattedAmount
  }
  let [integer, fraction = ''] = formattedAmount.split('.')
  if (decimals !== null && fraction.length > decimals) {
    fraction = fraction.slice(0, decimals)
  }
  integer = integer.replace(/^0+|-/, '')
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

export function wrapHashes(text: string): string {
  const shouldWrap = (text: string): boolean => {
    const cleanText = text.replace(/[.,!?;:]$/, '')
    const hashPattern = /^[A-Za-z0-9]{32,}$/
    return hashPattern.test(cleanText)
  }
  return text
    .split(' ')
    .map((word) =>
      shouldWrap(word) ? `${word.slice(0, 8)}...${word.slice(-4)}` : word
    )
    .join(' ')
}
