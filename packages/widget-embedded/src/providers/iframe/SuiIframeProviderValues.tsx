import { ChainId, ChainType } from '@lifi/sdk'
import { SuiContext } from '@lifi/widget-provider'
import {
  type FC,
  type PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react'
import { SuiIframeProvider } from './SuiIframeProvider.js'

interface IframeWalletState {
  accounts: string[]
  connected: boolean
}

/**
 * Guest-side (iframe) Sui context provider.
 *
 * Reads wallet state from SuiIframeProvider (which receives it from the
 * host via GuestBridge) and exposes it through SuiContext so the widget
 * can display the connected account.
 */
export const SuiIframeProviderValues: FC<PropsWithChildren> = ({
  children,
}) => {
  const providerRef = useRef<SuiIframeProvider>(null)
  if (!providerRef.current) {
    providerRef.current = new SuiIframeProvider()
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

  const account = isConnected
    ? {
        address,
        chainId: ChainId.SUI,
        chainType: ChainType.MVM,
        connector: { name: 'iframe-bridge' },
        isConnected: true as const,
        isConnecting: false,
        isReconnecting: false,
        isDisconnected: false,
        status: 'connected' as const,
      }
    : {
        chainType: ChainType.MVM,
        isConnected: false as const,
        isConnecting: false,
        isReconnecting: false,
        isDisconnected: true,
        status: 'disconnected' as const,
      }

  return (
    <SuiContext.Provider
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
    </SuiContext.Provider>
  )
}
