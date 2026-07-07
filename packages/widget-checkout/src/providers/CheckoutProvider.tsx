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
      onSuccess: config.onSuccess,
      onError: config.onError,
      resumePending: config.resumePending,
      allowUserDestinationAddress: config.allowUserDestinationAddress,
    }),
    [
      config.integrator,
      config.onSuccess,
      config.onError,
      config.resumePending,
      config.allowUserDestinationAddress,
    ]
  )

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  )
}
