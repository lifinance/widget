export interface SendToWalletState {
  showSendToWallet: boolean;
}

export interface SendToWalletStore extends SendToWalletState {
  toggleSendToWallet(): void;
}
