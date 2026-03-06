import { ChainId, ChainType } from '@lifi/sdk'
import { BitcoinContext } from '@lifi/widget-provider'
import {
  type FC,
  type PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react'
import { BitcoinIframeProvider } from './BitcoinIframeProvider.js'

interface IframeWalletState {
  accounts: string[]
  connected: boolean
}

/**
 * Guest-side (iframe) Bitcoin context provider.
 *
 * Reads wallet state from BitcoinIframeProvider (which receives it from the
 * host via GuestBridge) and exposes it through BitcoinContext so the widget
 * can display the connected account.
 */
export const BitcoinIframeProviderValues: FC<PropsWithChildren> = ({
  children,
}) => {
  const providerRef = useRef<BitcoinIframeProvider>(null)
  if (!providerRef.current) {
    providerRef.current = new BitcoinIframeProvider()
  }
  const provider = providerRef.current

  const [walletState, setWalletState] = useState<IframeWalletState>({
    accounts: provider.accounts,
    connected: provider.connected,
  })

  useEffect(() => {
    const onAccountsChanged = (accounts: unknown) => {
      const accts = accounts as string[]
      setWalletState({ accounts: accts, connected: accts.length > 0 })
    }

    const onConnect = () => {
      setWalletState({
        accounts: provider.accounts,
        connected: true,
      })
    }

    const onDisconnect = () => {
      setWalletState({ accounts: [], connected: false })
    }

    provider.on('accountsChanged', onAccountsChanged)
    provider.on('connect', onConnect)
    provider.on('disconnect', onDisconnect)

    return () => {
      provider.removeListener('accountsChanged', onAccountsChanged)
      provider.removeListener('connect', onConnect)
      provider.removeListener('disconnect', onDisconnect)
    }
  }, [provider])

  const address = walletState.accounts[0] ?? null
  const isConnected = walletState.connected && !!address

  const account = {
    address: address ?? undefined,
    addresses: address ? [address] : [],
    chainType: ChainType.UTXO,
    chainId: ChainId.BTC,
    connector: isConnected ? { name: 'iframe-bridge' } : undefined,
    isConnected,
    isConnecting: false,
    isReconnecting: false,
    isDisconnected: !isConnected,
    status: (isConnected ? 'connected' : 'disconnected') as
      | 'connected'
      | 'disconnected',
  }

  return (
    <BitcoinContext.Provider
      value={{
        isEnabled: true,
        account,
        sdkProvider: undefined,
        installedWallets: [],
        isConnected,
        isExternalContext: true,
        connect: async () => {},
        disconnect: async () => {},
      }}
    >
      {children}
    </BitcoinContext.Provider>
  )
}
