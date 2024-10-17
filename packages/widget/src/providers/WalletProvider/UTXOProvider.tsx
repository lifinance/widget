import { BigmiContext } from '@bigmi/react'
import { ChainType } from '@lifi/sdk'
import { type FC, type PropsWithChildren, useContext } from 'react'
import { isItemAllowed } from '../../utils/item.js'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'
import { UTXOBaseProvider } from './UTXOBaseProvider.js'
import { UTXOExternalContext } from './UTXOExternalContext.js'

export function useInBigmiContext(): boolean {
  const { chains } = useWidgetConfig()
  const context = useContext(BigmiContext)

  return Boolean(context) && isItemAllowed(ChainType.UTXO, chains?.types)
}

export const UTXOProvider: FC<PropsWithChildren> = ({ children }) => {
  const inBigmiContext = useInBigmiContext()

  return inBigmiContext ? (
    <UTXOExternalContext.Provider value={inBigmiContext}>
      {children}
    </UTXOExternalContext.Provider>
  ) : (
    <UTXOBaseProvider>{children}</UTXOBaseProvider>
  )
}
