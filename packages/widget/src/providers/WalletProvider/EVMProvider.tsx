import { ChainType } from '@lifi/sdk'
import { type FC, type PropsWithChildren, useContext } from 'react'
import { WagmiContext } from 'wagmi'
import { useInternalWalletProvider } from '../../hooks/useInternalWalletProvider.js'
import { isItemAllowed } from '../../utils/item.js'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'
import { EVMBaseProvider } from './EVMBaseProvider.js'
import { EVMExternalContext } from './EVMExternalContext.js'

function useInWagmiContext(): boolean {
  const { chains } = useWidgetConfig()
  const context = useContext(WagmiContext)

  return Boolean(context) && isItemAllowed(ChainType.EVM, chains?.types)
}

export const EVMProvider: FC<PropsWithChildren> = ({ children }) => {
  const inWagmiContext = useInWagmiContext()
  const useInternalWallet = useInternalWalletProvider(inWagmiContext)

  return useInternalWallet ? (
    <EVMBaseProvider>{children}</EVMBaseProvider>
  ) : (
    <EVMExternalContext.Provider value={inWagmiContext}>
      {children}
    </EVMExternalContext.Provider>
  )
}
