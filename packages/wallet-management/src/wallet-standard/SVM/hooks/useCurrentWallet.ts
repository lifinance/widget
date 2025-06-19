import { useWalletStore } from './useWalletStore'

export function useCurrentWallet() {
  const currentWallet = useWalletStore((state) => state.currentWallet)
  const status = useWalletStore((state) => state.status)

  switch (status) {
    case 'connecting':
      return {
        status,
        currentWallet: null,
        isDisconnected: false,
        isConnecting: true,
        isConnected: false,
      } as const
    case 'disconnected':
      return {
        status,
        currentWallet: null,
        isDisconnected: true,
        isConnecting: false,
        isConnected: false,
      } as const
    case 'connected': {
      return {
        status,
        currentWallet: currentWallet!,
        isDisconnected: false,
        isConnecting: false,
        isConnected: true,
      } as const
    }
    case 'reconnecting': {
      return {
        status,
        currentWallet: currentWallet!,
        isDisconnected: false,
        isConnecting: true,
        isConnected: false,
      } as const
    }
  }
}
