// import type { ChainType } from '@lifi/sdk'
// import { WalletContext } from '@tronweb3/tronwallet-adapter-react-hooks'
import type { FC, PropsWithChildren } from 'react'
// import { isItemAllowed } from '../../utils/item.js'
//import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'
import { TVMBaseProvider } from './TVMBaseProvider.js'
import { TVMExternalContext } from './TVMExternalContext.js'

export function useInTVMContext(): boolean {
  //   const { chains } = useWidgetConfig()
  //   const context = useContext(WalletContext)
  return false
  //   return (
  //     Boolean(context?.wallet) && isItemAllowed('TVM' as ChainType, chains?.types)
  //   )
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
