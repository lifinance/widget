import type { JSX, PropsWithChildren } from 'react'
import { createContext, useContext } from 'react'

export interface PlaygroundEnvVariables {
  EVMWalletConnectId: string
  TVMWalletConnectId: string
  /** Core checkout session API base URL, e.g. `https://develop.li.quest` or `http://localhost:8080`. */
  onrampSessionApiUrl?: string
  /** Checkout integrator forwarded in body/header, e.g. `local-test`. */
  checkoutIntegrator?: string
  /** Default checkout target chain id for testing, e.g. `1`. */
  checkoutToChain?: number
  /** Default checkout target token address for testing. */
  checkoutToToken?: string
}

const EnvVariablesContext = createContext<PlaygroundEnvVariables>({
  EVMWalletConnectId: '',
  TVMWalletConnectId: '',
  onrampSessionApiUrl: undefined,
  checkoutIntegrator: undefined,
  checkoutToChain: undefined,
  checkoutToToken: undefined,
})

interface EvnVariablesProviderProps extends PropsWithChildren {
  EVMWalletConnectId: string
  TVMWalletConnectId: string
  onrampSessionApiUrl?: string
  checkoutIntegrator?: string
  checkoutToChain?: number
  checkoutToToken?: string
}

export const EnvVariablesProvider = ({
  children,
  EVMWalletConnectId,
  TVMWalletConnectId,
  onrampSessionApiUrl,
  checkoutIntegrator,
  checkoutToChain,
  checkoutToToken,
}: EvnVariablesProviderProps): JSX.Element => {
  return (
    <EnvVariablesContext.Provider
      value={{
        EVMWalletConnectId,
        TVMWalletConnectId,
        onrampSessionApiUrl,
        checkoutIntegrator,
        checkoutToChain,
        checkoutToToken,
      }}
    >
      {children}
    </EnvVariablesContext.Provider>
  )
}

export const useEnvVariables = (): PlaygroundEnvVariables => {
  return useContext(EnvVariablesContext)
}
