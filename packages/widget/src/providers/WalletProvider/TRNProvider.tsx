import type { ChainType } from '@lifi/sdk'
import { WalletContext } from '@tronweb3/tronwallet-adapter-react-hooks'
import { type FC, type PropsWithChildren, useContext } from 'react'
import { isItemAllowed } from '../../utils/item.js'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'
import { TRNBaseProvider } from './TRNBaseProvider.js'
import { TRNExternalContext } from './TRNExternalContext.js'

export function useInTRNContext(): boolean {
  const { chains } = useWidgetConfig()
  const context = useContext(WalletContext)
  return (
    'disableAutoConnectOnLoad' in context &&
    isItemAllowed('TRN' as unknown as ChainType, chains?.types)
  )
}

export const TRNProvider: FC<PropsWithChildren> = ({ children }) => {
  const inTRNContext = useInTRNContext()
  return inTRNContext ? (
    <TRNExternalContext.Provider value={inTRNContext}>
      {children}
    </TRNExternalContext.Provider>
  ) : (
    <TRNBaseProvider>{children}</TRNBaseProvider>
  )
}
