export enum ElementId {
  WalletModalContent = 'widget-wallet-modal-content',
  WalletConnectElement = 'w3m-modal',
}

export const getWalletModalContentElement = () =>
  document.getElementById(ElementId.WalletModalContent)

export const getWalletConnectElement = () =>
  document.querySelector(ElementId.WalletConnectElement)

export const createWalletConnectElement = () => {
  const elementExists = getWalletConnectElement()
  if (!elementExists) {
    const modal = document.createElement(ElementId.WalletConnectElement)
    const containerElement = getWalletModalContentElement()
    containerElement?.parentElement?.insertAdjacentElement('afterbegin', modal)
  }
}
