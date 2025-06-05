export enum WalletTagType {
  Multichain = 'multichain',
  Installed = 'installed',
  QrCode = 'qr-code',
  GetStarted = 'get-started',
}

export const getTagType = (connectorId: string) => {
  if (connectorId === 'walletConnect') {
    return WalletTagType.QrCode
  }

  if (connectorId === 'metaMaskSDK' || connectorId === 'coinbaseWalletSDK') {
    return WalletTagType.GetStarted
  }

  return WalletTagType.Installed
}
