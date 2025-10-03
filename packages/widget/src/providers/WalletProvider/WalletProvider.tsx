import type { WalletManagementConfig } from '@lifi/wallet-management'
import { WalletManagementProvider } from '@lifi/wallet-management'
import { EVMProvider } from '@lifi/wallet-provider-evm'
import { MVMProvider } from '@lifi/wallet-provider-mvm'
import { SVMProvider } from '@lifi/wallet-provider-svm'
import { UTXOProvider } from '@lifi/wallet-provider-utxo'
import { type FC, type PropsWithChildren, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAvailableChains } from '../../hooks/useAvailableChains.js'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'
import { SDKProviders } from './SDKProviders.js'
import { useExternalWalletProvider } from './useExternalWalletProvider.js'

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const { walletConfig } = useWidgetConfig()
  const { chains } = useAvailableChains()
  // TODO: isItemAllowed(ChainType.SVM, chains?.types) - should we check it?
  return (
    // TODO: pass as props to WalletProvider
    <EVMProvider walletConfig={walletConfig} chains={chains}>
      <SVMProvider walletConfig={walletConfig}>
        <UTXOProvider walletConfig={walletConfig}>
          <MVMProvider walletConfig={walletConfig}>
            <SDKProviders />
            <WalletMenuProvider>{children}</WalletMenuProvider>
          </MVMProvider>
        </UTXOProvider>
      </SVMProvider>
    </EVMProvider>
  )
}

const WalletMenuProvider: FC<PropsWithChildren> = ({ children }) => {
  const { walletConfig } = useWidgetConfig()
  const { i18n } = useTranslation()
  const { internalChainTypes } = useExternalWalletProvider()

  const config: WalletManagementConfig = useMemo(() => {
    return {
      locale: i18n.resolvedLanguage as never,
      enabledChainTypes: internalChainTypes,
      walletEcosystemsOrder: walletConfig?.walletEcosystemsOrder,
    }
  }, [
    i18n.resolvedLanguage,
    internalChainTypes,
    walletConfig?.walletEcosystemsOrder,
  ])

  return (
    <WalletManagementProvider config={config}>
      {children}
    </WalletManagementProvider>
  )
}
