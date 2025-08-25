import type { ChainType } from '@lifi/sdk'
import { WalletContext } from '@tronweb3/tronwallet-adapter-react-hooks'
import { type FC, type PropsWithChildren, useContext } from 'react'
import { isItemAllowed } from '../../utils/item.js'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'
import { TVMBaseProvider } from './TVMBaseProvider.js'
import { TVMExternalContext } from './TVMExternalContext.js'

export function useInTVMContext(): boolean {
  const { chains } = useWidgetConfig()
  const context = useContext(WalletContext)
  // NB: this is a hack to check if the the context is external and not default initial value.
  // disableAutoConnectOnLoad is the only property that is not exposed in default context
  return (
    'disableAutoConnectOnLoad' in context &&
    isItemAllowed('TVM' as unknown as ChainType, chains?.types) // TODO: update this type
  )
}

export const TVMProvider: FC<PropsWithChildren> = ({ children }) => {
  const inTVMContext = useInTVMContext()
  return inTVMContext ? (
    <TVMExternalContext.Provider value={inTVMContext}>
      {children}
    </TVMExternalContext.Provider>
  ) : (
    <TVMBaseProvider>{children}</TVMBaseProvider>
  )
}
