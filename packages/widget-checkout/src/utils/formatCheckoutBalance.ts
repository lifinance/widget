export function formatCheckoutBalanceWithToken(
  formattedAmount: string,
  _symbol: string
): string {
  return `/ ${formattedAmount}`
}
