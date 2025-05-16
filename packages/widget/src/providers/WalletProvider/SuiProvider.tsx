import { ChainType } from '@lifi/sdk'
import { SuiClientContext } from '@mysten/dapp-kit'
import { type FC, type PropsWithChildren, useContext } from 'react'
import { isItemAllowed } from '../../utils/item.js'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'
import { SuiBaseProvider } from './SuiBaseProvider.js'
import { SuiExternalContext } from './SuiExternalContext.js'

export function useInSuiContext(): boolean {
  const { chains } = useWidgetConfig()
  const context = useContext(SuiClientContext)

  return Boolean(context) && isItemAllowed(ChainType.MVM, chains?.types)
}

export const SuiProvider: FC<PropsWithChildren> = ({ children }) => {
  const inSuiContext = useInSuiContext()

  return inSuiContext ? (
    <SuiExternalContext.Provider value={inSuiContext}>
      {children}
    </SuiExternalContext.Provider>
  ) : (
    <SuiBaseProvider>{children}</SuiBaseProvider>
  )
}
