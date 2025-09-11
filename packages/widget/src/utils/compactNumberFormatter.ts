/**
 * Converts a non-negative integer to its subscript representation using Unicode subscript characters.
 * @param n - The number to convert to subscript
 * @returns A string where each digit is converted to its subscript equivalent
 * @example
 * toSubscript(5) => '₅'
 * toSubscript(10) => '₁₀'
 */
function toSubscript(n: number): string {
  return n
    .toString()
    .split('')
    .map((digit) => String.fromCharCode(8320 + Number(digit)))
    .join('')
}

/**
 * Formats numbers with special handling for small decimal values, converting runs of leading zeros
 * into a more compact subscript notation.
 *
 * @param value - The numeric value to format (expected to be a string representing a BigInt)
 * @param lng - The locale string for number formatting
 * @param options - Formatting options including decimals and Intl.NumberFormat options
 * @returns A formatted string with subscript notation for leading zeros
 */
export const compactNumberFormatter = (
  lng: string | undefined,
  options: any
) => {
  const formatter = new Intl.NumberFormat(lng, {
    notation: 'standard',
    roundingPriority: 'morePrecision',
    maximumSignificantDigits: 21,
    maximumFractionDigits: 20,
    ...options,
  })
  return (value: any) => {
    if (!Number.parseFloat(value) || Number.isNaN(Number(value))) {
      return '0'
    }

    const parts = formatter.formatToParts(value as Intl.StringNumericLiteral)
    let integerPart = ''
    let fractionPart = ''
    let decimalSeparator = ''
    let minusSign = ''

    for (const p of parts) {
      switch (p.type) {
        case 'integer':
        case 'group':
          integerPart += p.value
          break
        case 'fraction':
          fractionPart += p.value
          break
        case 'decimal':
          decimalSeparator = p.value
          break
        case 'minusSign':
          minusSign = p.value
          break
      }
    }

    // For numbers with no decimal part, return early
    if (!fractionPart) {
      return `${minusSign}${integerPart}`
    }

    // Count consecutive leading zeros in the fraction part
    const match = fractionPart.match(/^0+/)
    const leadingZerosCount = match ? match[0].length : 0

    // For numbers with few leading zeros (≤ 3), format normally
    // but limit the total length and trim trailing zeros
    if (leadingZerosCount <= 3) {
      fractionPart = fractionPart.slice(0, 6).replace(/0+$/, '')
      return `${minusSign}${integerPart}${decimalSeparator}${fractionPart}`
    }

    // For numbers with many leading zeros (> 3), use subscript notation
    // Format: "0.0₍number_of_zeros₎significant_digits"
    const zerosSubscript = toSubscript(leadingZerosCount)
    const remainder = fractionPart
      .slice(leadingZerosCount, leadingZerosCount + 4)
      .replace(/0+$/, '')

    return `${minusSign}${integerPart}${decimalSeparator}0${zerosSubscript}${remainder}`
  }
}
