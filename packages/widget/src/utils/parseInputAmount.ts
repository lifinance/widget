import { parseUnits } from 'viem'

/**
 * Parse an amount string from the form to the smallest token unit.
 * An amount without digits ('', '-', '.', '-.') parses to 0n.
 * viem 2.55.4+ throws on these values, older versions returned 0n.
 * @param amount amount to parse.
 * @param decimals token decimals.
 * @returns parsed amount.
 */
export function parseInputAmount(amount: string, decimals: number) {
  const value = amount.trim()
  if (/^-?\.?$/.test(value)) {
    return 0n
  }
  return parseUnits(value, decimals)
}
