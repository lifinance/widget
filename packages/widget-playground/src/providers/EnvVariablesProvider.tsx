import type { PropsWithChildren } from 'react'
import { createContext, useContext } from 'react'

export interface PlaygroundEnvVariables {
  EVMWalletConnectId: string
  /** Base URL for checkout cash on-ramp (mock or deployed), e.g. `http://localhost:8080`. */
  onrampSessionApiUrl?: string
}

const EnvVariablesContext = createContext<PlaygroundEnvVariables>({
  EVMWalletConnectId: '',
  onrampSessionApiUrl: undefined,
})

interface EvnVariablesProviderProps extends PropsWithChildren {
  EVMWalletConnectId: string
  onrampSessionApiUrl?: string
}

export const EnvVariablesProvider = ({
  children,
  EVMWalletConnectId,
  onrampSessionApiUrl,
}: EvnVariablesProviderProps) => {
  return (
    <EnvVariablesContext.Provider
      value={{ EVMWalletConnectId, onrampSessionApiUrl }}
    >
      {children}
    </EnvVariablesContext.Provider>
  )
}

export const useEnvVariables = () => {
  return useContext(EnvVariablesContext)
}
