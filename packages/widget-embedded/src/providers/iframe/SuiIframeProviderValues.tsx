import { ChainId, ChainType } from '@lifi/sdk'
import { SuiProvider as SuiSDKProvider } from '@lifi/sdk-provider-sui'
import { SuiContext } from '@lifi/widget-provider'
import { SuiJsonRpcClient } from '@mysten/sui/jsonRpc'
import {
  type FC,
  type PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { IframeConnectorInfo } from './BaseIframeProvider.js'
import { IframeSuiSigner } from './IframeSuiSigner.js'
import { SuiIframeProvider } from './SuiIframeProvider.js'

interface IframeWalletState {
  accounts: string[]
  connected: boolean
  connector: IframeConnectorInfo
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
    connector: provider.connector,
  })

  useEffect(() => {
    const onAccountsChanged = (accounts: unknown) => {
      const accts = accounts as string[]
      setWalletState((s) => ({
        ...s,
        accounts: accts,
        connected: accts.length > 0,
      }))
    }

    const onConnect = () => {
      setWalletState({
        accounts: provider.accounts,
        connected: true,
        connector: provider.connector,
      })
    }

    const onDisconnect = () => {
      setWalletState({ accounts: [], connected: false, connector: {} })
    }

    // Register React listeners BEFORE connect() — onInit may fire
    // synchronously if INIT already arrived, and we need to catch it.
    provider.on('accountsChanged', onAccountsChanged)
    provider.on('connect', onConnect)
    provider.on('disconnect', onDisconnect)
    provider.connect()

    return () => {
      provider.removeListener('accountsChanged', onAccountsChanged)
      provider.removeListener('connect', onConnect)
      provider.removeListener('disconnect', onDisconnect)
      provider.destroy()
    }
  }, [provider])

  const address = walletState.accounts[0] ?? null
  const isConnected = walletState.connected && !!address
  const connectorName = walletState.connector.name
  const connectorIcon = walletState.connector.icon

  const account = useMemo(
    () =>
      isConnected
        ? {
            address,
            chainId: ChainId.SUI,
            chainType: ChainType.MVM,
            connector: {
              name: connectorName ?? 'Sui Wallet',
              icon: connectorIcon,
            },
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
          },
    [address, isConnected, connectorName, connectorIcon]
  )

  const sdkProvider = useMemo(
    () =>
      SuiSDKProvider({
        getClient: async () =>
          new SuiJsonRpcClient({
            url: 'https://fullnode.mainnet.sui.io:443',
            network: 'mainnet',
          }),
        getSigner: async () => new IframeSuiSigner(address!, provider),
      }),
    [address, provider]
  )

  const contextValue = useMemo(
    () => ({
      isEnabled: true,
      account,
      sdkProvider,
      installedWallets: [] as [],
      isConnected,
      isExternalContext: true,
      connect: async () => {},
      disconnect: async () => {},
    }),
    [account, sdkProvider, isConnected]
  )

  return (
    <SuiContext.Provider value={contextValue}>{children}</SuiContext.Provider>
  )
}
