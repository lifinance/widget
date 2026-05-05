/** Checkout deposit UX copy (EN). For full i18n, replace with resource keys later. */
export function formatCheckoutBalanceWithToken(
  formattedAmount: string,
  symbol: string
): string {
  return `Balance: ${formattedAmount} ${symbol}`
}
