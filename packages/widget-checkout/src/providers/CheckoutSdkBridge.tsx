import { useSDKClient } from '@lifi/widget/shared'
import {
  CheckoutContext,
  type CheckoutContextValue,
  useCheckoutConfig,
} from '@lifi/widget-provider/checkout'
import { type JSX, type PropsWithChildren, useMemo } from 'react'

// Must mount inside `SDKClientProvider` — re-provides `CheckoutContext` with
// `apiUrl` resolved from the active SDK client.
export const CheckoutSdkBridge = ({
  children,
}: PropsWithChildren): JSX.Element => {
  const sdkClient = useSDKClient()
  const parent = useCheckoutConfig()
  const apiUrl = sdkClient.config.apiUrl

  const value = useMemo<CheckoutContextValue>(
    () => ({ ...parent, apiUrl }),
    [parent, apiUrl]
  )

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  )
}
