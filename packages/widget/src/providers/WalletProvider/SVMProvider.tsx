import { ChainType } from '@lifi/sdk'
import { ConnectionContext } from '@solana/wallet-adapter-react'
import { type FC, type PropsWithChildren, useContext } from 'react'
import { useInternalWalletProvider } from '../../hooks/useInternalWalletProvider.js'
import { isItemAllowed } from '../../utils/item.js'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'
import { SVMBaseProvider } from './SVMBaseProvider.js'
import { SVMExternalContext } from './SVMExternalContext.js'

export function useInSolanaContext(): boolean {
  const { chains } = useWidgetConfig()
  const context = useContext(ConnectionContext)
  return (
    Boolean(context?.connection) && isItemAllowed(ChainType.SVM, chains?.types)
  )
}

export const SVMProvider: FC<PropsWithChildren> = ({ children }) => {
  const inSolanaContext = useInSolanaContext()
  const useInternalWallet = useInternalWalletProvider(inSolanaContext)

  return useInternalWallet ? (
    <SVMBaseProvider>{children}</SVMBaseProvider>
  ) : (
    <SVMExternalContext.Provider value={inSolanaContext}>
      {children}
    </SVMExternalContext.Provider>
  )
}
