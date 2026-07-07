import type { JSX, PropsWithChildren } from 'react'
import { createContext, useContext } from 'react'

export interface PlaygroundEnvVariables {
  EVMWalletConnectId: string
  TVMWalletConnectId: string
  /** Checkout integrator forwarded in body/header, e.g. `local-test`. */
  checkoutIntegrator?: string
  /** Default checkout target chain id for testing, e.g. `1`. */
  checkoutToChain?: number
  /** Default checkout target token address for testing. */
  checkoutToToken?: string
  /** Default checkout recipient address; falls back to the connected wallet. */
  checkoutToAddress?: string
}

const EnvVariablesContext = createContext<PlaygroundEnvVariables>({
  EVMWalletConnectId: '',
  TVMWalletConnectId: '',
  checkoutIntegrator: undefined,
  checkoutToChain: undefined,
  checkoutToToken: undefined,
  checkoutToAddress: undefined,
})

interface EvnVariablesProviderProps extends PropsWithChildren {
  EVMWalletConnectId: string
  TVMWalletConnectId: string
  checkoutIntegrator?: string
  checkoutToChain?: number
  checkoutToToken?: string
  checkoutToAddress?: string
}

export const EnvVariablesProvider = ({
  children,
  EVMWalletConnectId,
  TVMWalletConnectId,
  checkoutIntegrator,
  checkoutToChain,
  checkoutToToken,
  checkoutToAddress,
}: EvnVariablesProviderProps): JSX.Element => {
  return (
    <EnvVariablesContext.Provider
      value={{
        EVMWalletConnectId,
        TVMWalletConnectId,
        checkoutIntegrator,
        checkoutToChain,
        checkoutToToken,
        checkoutToAddress,
      }}
    >
      {children}
    </EnvVariablesContext.Provider>
  )
}

export const useEnvVariables = (): PlaygroundEnvVariables => {
  return useContext(EnvVariablesContext)
}
