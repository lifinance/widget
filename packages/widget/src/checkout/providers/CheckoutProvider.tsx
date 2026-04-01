import { createContext, useContext, useMemo } from 'react'
import type { CheckoutConfig, CheckoutProviderProps } from '../types/config.js'

interface CheckoutContextValue {
  config: CheckoutConfig
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null)

export const useCheckoutConfig = (): CheckoutConfig => {
  const context = useContext(CheckoutContext)
  if (!context) {
    throw new Error('useCheckoutConfig must be used within CheckoutProvider')
  }
  return context.config
}

export const CheckoutProvider: React.FC<CheckoutProviderProps> = ({
  children,
  config,
}) => {
  const value = useMemo(() => ({ config }), [config])

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  )
}
