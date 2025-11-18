/**
 * Checks if a value is a valid hex string.
 *
 * @param value - The value to check
 * @param options - Configuration options
 * @param options.strict - If true, validates hex format strictly (default: true)
 * @returns True if the value is a valid hex string
 *
 * @example
 * ```ts
 * isHex('0x1234') // true
 * isHex('0x') // true
 * isHex('1234') // false
 * isHex('0x1234', { strict: false }) // true
 * ```
 *
 * @remarks This function is adapted from viem's isHex utility.
 */
export function isHex(
  value: unknown,
  { strict = true }: { strict?: boolean | undefined } = {}
): value is `0x${string}` {
  if (!value) {
    return false
  }
  if (typeof value !== 'string') {
    return false
  }
  return strict ? /^0x[0-9a-fA-F]*$/.test(value) : value.startsWith('0x')
}
