import { ChainType } from '@lifi/sdk'
import { SolanaClientContext } from '@solana/react-hooks'
import { type FC, type PropsWithChildren, useContext } from 'react'
import { useInternalWalletProvider } from '../../hooks/useInternalWalletProvider.js'
import { isItemAllowed } from '../../utils/item.js'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'
import { SVMBaseProvider } from './SVMBaseProvider.js'
import { SVMExternalContext } from './SVMExternalContext.js'

function useInSolanaContext(): boolean {
  const { chains } = useWidgetConfig()
  const context = useContext(SolanaClientContext)
  return Boolean(context) && isItemAllowed(ChainType.SVM, chains?.types)
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
