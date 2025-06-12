import type { ChainType } from '@lifi/sdk'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { WalletTagType } from '../types/walletTagType'
import { getConnectorId } from '../utils/getConnectorId'
import { type ConnectorType, useAccount } from './useAccount'
import type { CombinedWallet } from './useCombinedWallets'

export const useWalletTag = () => {
  const { t } = useTranslation()
  const { accounts } = useAccount()

  const connectedConnectorIds = useMemo(() => {
    return accounts
      .filter((account) => account.isConnected)
      .map((account) => getConnectorId(account.connector, account.chainType))
  }, [accounts])

  const getConnectorTagType = useCallback(
    (connector?: ConnectorType, chainType?: ChainType) => {
      const connectorId = getConnectorId(connector, chainType)
      if (!connectorId) {
        return undefined
      }

      if (connectedConnectorIds.includes(connectorId)) {
        return WalletTagType.Connected
      }

      if (connectorId === 'walletConnect') {
        return WalletTagType.QrCode
      }

      if (
        connectorId === 'metaMaskSDK' ||
        connectorId === 'coinbaseWalletSDK'
      ) {
        return WalletTagType.GetStarted
      }

      return WalletTagType.Installed
    },
    [connectedConnectorIds]
  )

  const getWalletTagType = useCallback(
    (wallet: CombinedWallet) => {
      let walletTagType: WalletTagType | undefined
      if (wallet.connectors.length > 1) {
        walletTagType = wallet.connectors.some(
          (connector) =>
            getConnectorTagType(connector.connector, connector.chainType) ===
            WalletTagType.Connected
        )
          ? WalletTagType.Connected
          : WalletTagType.Multichain
      } else if (wallet.connectors.length === 1) {
        walletTagType = getConnectorTagType(
          wallet.connectors[0].connector,
          wallet.connectors[0].chainType
        )
      }
      return walletTagType
    },
    [getConnectorTagType]
  )

  const getTagLabel = (tagType: WalletTagType) => {
    switch (tagType) {
      case WalletTagType.Connected:
        return t('tags.connected')
      case WalletTagType.Multichain:
        return t('tags.multichain')
      case WalletTagType.Installed:
        return t('tags.installed')
      case WalletTagType.QrCode:
        return t('tags.qrCode')
      case WalletTagType.GetStarted:
        return t('tags.getStarted')
      default:
        return ''
    }
  }

  return {
    getConnectorTagType,
    getWalletTagType,
    getTagLabel,
  }
}
