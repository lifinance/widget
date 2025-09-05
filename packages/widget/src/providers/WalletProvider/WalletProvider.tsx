import type { WalletManagementConfig } from '@lifi/wallet-management'
import { WalletManagementProvider } from '@lifi/wallet-management'
import { MVMProvider } from '@lifi/wallet-provider-mvm'
import { SVMProvider } from '@lifi/wallet-provider-svm'
import { UTXOProvider } from '@lifi/wallet-provider-utxo'
import { type FC, type PropsWithChildren, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'
import { EVMProvider } from './EVMProvider.js'
import { SDKProviders } from './SDKProviders.js'
import { useExternalWalletProvider } from './useExternalWalletProvider.js'

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const { walletConfig } = useWidgetConfig()
  // TODO: isItemAllowed(ChainType.SVM, chains?.types) - should we check it?
  return (
    <EVMProvider>
      <SVMProvider
        forceInternalWalletManagement={
          walletConfig?.forceInternalWalletManagement
        }
      >
        <UTXOProvider
          forceInternalWalletManagement={
            walletConfig?.forceInternalWalletManagement
          }
        >
          <MVMProvider
            forceInternalWalletManagement={
              walletConfig?.forceInternalWalletManagement
            }
          >
            <SDKProviders />
            <WalletMenuProvider>{children}</WalletMenuProvider>
          </MVMProvider>
        </UTXOProvider>
      </SVMProvider>
    </EVMProvider>
  )
}

export const WalletMenuProvider: FC<PropsWithChildren> = ({ children }) => {
  const { walletConfig } = useWidgetConfig()
  const { i18n } = useTranslation()
  const { internalChainTypes } = useExternalWalletProvider()

  const config: WalletManagementConfig = useMemo(() => {
    return {
      locale: i18n.resolvedLanguage as never,
      enabledChainTypes: internalChainTypes,
      ...walletConfig,
    }
  }, [i18n.resolvedLanguage, internalChainTypes, walletConfig])

  return (
    <WalletManagementProvider config={config}>
      {children}
    </WalletManagementProvider>
  )
}
