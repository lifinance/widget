import { useWidgetConfig } from '@lifi/widget/shared'
import { useCheckoutConfig } from '@lifi/widget-provider/checkout'
import { Box, Typography } from '@mui/material'
import type { JSX, ReactNode } from 'react'
import { useEffect } from 'react'
import { useCheckoutConfigError } from '../hooks/useCheckoutConfigError.js'
import { useOnRampProviderMetas } from '../providers/OnRampProvider/OnRampProvider.js'

/**
 * Blocks the checkout when required config (toAddress/toChain/toToken) is missing,
 * surfacing it via console + `onError` instead of degrading silently.
 */
export function CheckoutConfigGuard({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  const missing = useCheckoutConfigError()
  const { onError } = useCheckoutConfig()
  const { apiKey } = useWidgetConfig()
  const providerMetas = useOnRampProviderMetas()
  const hasError = missing.length > 0

  useEffect(() => {
    if (hasError) {
      const message = `[LifiWidgetCheckout] Missing required config: ${missing.join(', ')}. The recipient (toAddress) and destination asset (toChain, toToken) must be set for the checkout to run.`
      console.error(message)
      onError?.({ code: 'INVALID_CONFIG', message })
    }
  }, [hasError, missing, onError])

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return
    }
    if (!hasError && providerMetas.length > 0 && !apiKey) {
      console.error(
        '[LifiWidgetCheckout] On-ramp (cash/exchange) providers require `config.apiKey`. Those funding sources stay unavailable until it is set; pay-from-wallet and transfer are unaffected.'
      )
    }
  }, [hasError, providerMetas.length, apiKey])

  if (hasError) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Checkout misconfigured
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Missing required config: {missing.join(', ')}. Set the recipient (
          <code>config.toAddress</code>) and destination asset (
          <code>config.toChain</code>, <code>config.toToken</code>) to enable
          checkout.
        </Typography>
      </Box>
    )
  }

  return <>{children}</>
}
