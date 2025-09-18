import type { CombinedWallet } from '../hooks/useCombinedWallets.js'
import { WalletTagType } from '../types/walletTagType.js'
import { getConnectorId } from './getConnectorId.js'

export const getConnectorTagType = (
  connectorId: string,
  isConnected: boolean
) => {
  if (isConnected) {
    return WalletTagType.Connected
  }

  if (connectorId === 'walletConnect') {
    return WalletTagType.QrCode
  }

  if (
    connectorId === 'metaMaskSDK' ||
    connectorId === 'coinbaseWalletSDK' ||
    connectorId === 'baseAccount' ||
    connectorId === 'xyz.ithaca.porto'
  ) {
    return WalletTagType.GetStarted
  }

  return WalletTagType.Installed
}

export const getWalletTagType = (
  wallet: CombinedWallet,
  connectedConnectorIds: string[]
) => {
  let walletTagType: WalletTagType | undefined
  if (wallet.connectors.length > 1) {
    walletTagType = wallet.connectors.some((connector) => {
      const connectorId = getConnectorId(
        connector.connector,
        connector.chainType
      )
      return (
        connectorId &&
        getConnectorTagType(
          connectorId,
          connectedConnectorIds.includes(connectorId)
        ) === WalletTagType.Connected
      )
    })
      ? WalletTagType.Connected
      : WalletTagType.Multichain
  } else if (wallet.connectors.length === 1) {
    const connectorId = getConnectorId(
      wallet.connectors[0].connector,
      wallet.connectors[0].chainType
    )
    walletTagType = connectorId
      ? getConnectorTagType(
          connectorId,
          connectedConnectorIds.includes(connectorId)
        )
      : undefined
  }
  return walletTagType
}
