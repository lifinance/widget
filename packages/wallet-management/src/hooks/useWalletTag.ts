import type { ChainType } from '@lifi/sdk'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { WalletTagType } from '../types/walletTagType'
import { getConnectorId } from '../utils/getConnectorId'
import { type ConnectorType, useAccount } from './useAccount'

export const useWalletTag = () => {
  const { t } = useTranslation()
  const { accounts } = useAccount()

  const connectedConnectorIds = useMemo(() => {
    return accounts
      .filter((account) => account.isConnected)
      .map((account) => getConnectorId(account.connector, account.chainType))
  }, [accounts])

  const getTagType = useCallback(
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
    getTagType,
    getTagLabel,
  }
}
