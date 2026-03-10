import type { PropsWithChildren } from 'react'
import { createContext, useContext } from 'react'

const EnvVariablesContext = createContext({
  EVMWalletConnectId: '',
  TVMWalletConnectId: '',
})

interface EvnVariablesProviderProps extends PropsWithChildren {
  EVMWalletConnectId: string
  TVMWalletConnectId: string
}

export const EnvVariablesProvider = ({
  children,
  EVMWalletConnectId,
  TVMWalletConnectId,
}: EvnVariablesProviderProps) => {
  return (
    <EnvVariablesContext.Provider
      value={{ EVMWalletConnectId, TVMWalletConnectId }}
    >
      {children}
    </EnvVariablesContext.Provider>
  )
}

export const useEnvVariables = () => {
  return useContext(EnvVariablesContext)
}
