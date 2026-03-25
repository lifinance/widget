import type { WidgetTheme } from '@lifi/widget'
import type { CheckoutTheme } from '../types/checkout.js'

export function checkoutThemeToWidgetTheme(
  checkoutTheme?: CheckoutTheme
): WidgetTheme {
  if (!checkoutTheme) {
    return {}
  }
  return {
    colorSchemes: checkoutTheme.colorSchemes,
    shape: checkoutTheme.shape,
    typography: checkoutTheme.typography,
    components: checkoutTheme.components as WidgetTheme['components'],
    container: checkoutTheme.container,
    header: checkoutTheme.header,
    navigation: checkoutTheme.navigation,
  }
}
