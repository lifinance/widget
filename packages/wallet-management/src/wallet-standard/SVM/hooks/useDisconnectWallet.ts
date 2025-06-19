import { useDisconnect } from '@wallet-standard/react'
import { useCurrentWallet } from './useCurrentWallet'
import { useWalletStore } from './useWalletStore'

export function useDisconnectWallet() {
  const { currentWallet } = useCurrentWallet()
  if (!currentWallet) {
    throw new Error('No wallet is connected.')
  }
  const [, disconnect] = useDisconnect(currentWallet)

  const setConnectionStatus = useWalletStore((state) => state.setStatus)
  const setCurrentWallet = useWalletStore((state) => state.selectWallet)
  const setCurrentAccount = useWalletStore((state) => state.selectAccount)

  const handleDisconnect = async () => {
    await disconnect()
    setConnectionStatus('disconnected')
    setCurrentWallet(null)
    setCurrentAccount(null)
  }

  return {
    disconnect: handleDisconnect,
  }
}
