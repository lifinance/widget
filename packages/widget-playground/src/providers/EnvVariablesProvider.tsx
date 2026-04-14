import type { JSX, PropsWithChildren } from 'react'
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
}: EvnVariablesProviderProps): JSX.Element => {
  return (
    <EnvVariablesContext.Provider
      value={{ EVMWalletConnectId, TVMWalletConnectId }}
    >
      {children}
    </EnvVariablesContext.Provider>
  )
}

export const useEnvVariables = (): {
  EVMWalletConnectId: string
  TVMWalletConnectId: string
} => {
  return useContext(EnvVariablesContext)
}
