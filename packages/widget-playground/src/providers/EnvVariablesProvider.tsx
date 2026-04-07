import type { JSX, PropsWithChildren } from 'react'
import { createContext, useContext } from 'react'

const EnvVariablesContext = createContext({
  EVMWalletConnectId: '',
})

interface EvnVariablesProviderProps extends PropsWithChildren {
  EVMWalletConnectId: string
}

export const EnvVariablesProvider = ({
  children,
  EVMWalletConnectId,
}: EvnVariablesProviderProps): JSX.Element => {
  return (
    <EnvVariablesContext.Provider value={{ EVMWalletConnectId }}>
      {children}
    </EnvVariablesContext.Provider>
  )
}

export const useEnvVariables = (): { EVMWalletConnectId: string } => {
  return useContext(EnvVariablesContext)
}
