import {
  CheckoutContext,
  type CheckoutContextValue,
} from '@lifi/widget-provider/checkout'
import { useMemo } from 'react'
import type { CheckoutProviderProps } from '../types/config.js'

export { useCheckoutConfig } from '@lifi/widget-provider/checkout'

export const CheckoutProvider: React.FC<CheckoutProviderProps> = ({
  children,
  config,
}) => {
  const value = useMemo<CheckoutContextValue>(
    () => ({
      integrator: config.integrator,
      onrampSessionApiUrl: config.onrampSessionApiUrl,
      onSuccess: config.onSuccess,
      onError: config.onError,
    }),
    [
      config.integrator,
      config.onrampSessionApiUrl,
      config.onSuccess,
      config.onError,
    ]
  )

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  )
}
