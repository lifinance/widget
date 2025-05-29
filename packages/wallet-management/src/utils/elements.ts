export enum ElementId {
  WalletModalContent = 'widget-wallet-modal-content',
  WalletConnectElement = 'w3m-modal',
}

export const getWalletModalContentElement = () =>
  document.getElementById(ElementId.WalletModalContent)

export const getWalletConnectElement = () =>
  document.querySelector(ElementId.WalletConnectElement)
