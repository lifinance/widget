import { isWalletInstalled } from '@lifi/widget-provider'
import type { CombinedWallet } from '../hooks/useCombinedWallets.js'
import { WalletTagType } from '../types/walletTagType.js'
import { getConnectorId } from './getConnectorId.js'
import { normalizeName } from './normalizeName.js'

export const getConnectorTagType = (
  connectorId: string,
  isConnected: boolean
): WalletTagType => {
  if (isConnected) {
    return WalletTagType.Connected
  }

  if (connectorId === 'walletConnect') {
    return WalletTagType.QrCode
  }

  // The MetaMask SDK connector wraps an installed extension when one is
  // present (transport: eip1193) and only falls back to the QR/relay
  // transport when no extension is detected. Tag it as `Installed` in the
  // former case so it sorts and labels alongside other installed wallets;
  // otherwise show the `GetStarted` (install prompt) tag.
  if (connectorId === 'metaMaskSDK') {
    return isWalletInstalled('metaMask')
      ? WalletTagType.Installed
      : WalletTagType.GetStarted
  }

  if (
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
): WalletTagType | undefined => {
  const isMultichain =
    wallet.connectors.length > 1 || normalizeName(wallet.name) === 'ledger'
  let walletTagType: WalletTagType | undefined
  if (isMultichain) {
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
