import { BigmiContext } from '@bigmi/react'
import { ChainType } from '@lifi/sdk'
import { type FC, type PropsWithChildren, useContext } from 'react'
import { useBaseProvider } from '../../hooks/useBaseProvider.js'
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
  const useBase = useBaseProvider(inBigmiContext)

  return useBase ? (
    <UTXOBaseProvider>{children}</UTXOBaseProvider>
  ) : (
    <UTXOExternalContext.Provider value={inBigmiContext}>
      {children}
    </UTXOExternalContext.Provider>
  )
}
