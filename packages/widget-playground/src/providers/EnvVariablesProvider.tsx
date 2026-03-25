import type { JSX, PropsWithChildren } from 'react'
import { createContext, useContext } from 'react'

export interface PlaygroundEnvVariables {
  EVMWalletConnectId: string
  TVMWalletConnectId: string
  /** Base URL for checkout cash on-ramp (mock or deployed), e.g. `http://localhost:8080`. */
  onrampSessionApiUrl?: string
}

const EnvVariablesContext = createContext<PlaygroundEnvVariables>({
  EVMWalletConnectId: '',
  TVMWalletConnectId: '',
  onrampSessionApiUrl: undefined,
})

interface EvnVariablesProviderProps extends PropsWithChildren {
  EVMWalletConnectId: string
  TVMWalletConnectId: string
  onrampSessionApiUrl?: string
}

export const EnvVariablesProvider = ({
  children,
  EVMWalletConnectId,
  TVMWalletConnectId,
  onrampSessionApiUrl,
}: EvnVariablesProviderProps): JSX.Element => {
  return (
    <EnvVariablesContext.Provider
      value={{ EVMWalletConnectId, TVMWalletConnectId, onrampSessionApiUrl }}
    >
      {children}
    </EnvVariablesContext.Provider>
  )
}

export const useEnvVariables = (): PlaygroundEnvVariables => {
  return useContext(EnvVariablesContext)
}
