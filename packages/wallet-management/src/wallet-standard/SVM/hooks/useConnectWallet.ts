import { type UiWallet, useConnect } from '@wallet-standard/react'
import { useWalletStore } from './useWalletStore'

interface useConnectWalletProps {
  wallet: UiWallet
}

export function useConnectWallet({ wallet }: useConnectWalletProps) {
  const setConnectionStatus = useWalletStore((state) => state.setStatus)
  const setCurrentWallet = useWalletStore((state) => state.selectWallet)
  const setCurrentAccount = useWalletStore((state) => state.selectAccount)

  const [, connect] = useConnect(wallet)

  const handleConnect = async () => {
    try {
      setConnectionStatus('connecting')
      const accounts = await connect()
      setCurrentWallet(wallet)
      setCurrentAccount(accounts[0])
      setConnectionStatus('connected')
      return accounts
    } catch (e) {
      setConnectionStatus('disconnected')
      throw e
    }
  }

  return {
    connect: handleConnect,
  }
}
