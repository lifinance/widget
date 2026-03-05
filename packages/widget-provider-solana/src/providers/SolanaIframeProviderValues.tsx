import { ChainId, ChainType } from '@lifi/sdk'
import { SolanaProvider as SolanaSDKProvider } from '@lifi/sdk-provider-solana'
import { SolanaContext } from '@lifi/widget-provider'
import {
  type FC,
  type PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { SolanaIframeProvider } from '../iframe/SolanaIframeProvider.js'

interface IframeWalletState {
  accounts: string[]
  connected: boolean
}

/**
 * Guest-side (iframe) Solana context provider.
 *
 * Reads wallet state from SolanaIframeProvider (which receives it from the
 * host via GuestBridge) and exposes it through SolanaContext so the widget
 * can display the connected account and execute transactions.
 */
export const SolanaIframeProviderValues: FC<PropsWithChildren> = ({
  children,
}) => {
  const providerRef = useRef<SolanaIframeProvider>(null)
  if (!providerRef.current) {
    providerRef.current = new SolanaIframeProvider()
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
        chainId: ChainId.SOL,
        chainType: ChainType.SVM,
        connector: { name: 'iframe-bridge' },
        isConnected: true as const,
        isConnecting: false,
        isReconnecting: false,
        isDisconnected: false,
        status: 'connected' as const,
      }
    : {
        chainType: ChainType.SVM,
        isConnected: false as const,
        isConnecting: false,
        isReconnecting: false,
        isDisconnected: true,
        status: 'disconnected' as const,
      }

  const sdkProvider = useMemo(
    () =>
      SolanaSDKProvider({
        async getWallet() {
          if (!provider.address) {
            throw new Error('Solana wallet not connected')
          }
          return createIframeWallet(provider)
        },
      }),
    [provider]
  )

  return (
    <SolanaContext.Provider
      value={{
        isEnabled: true,
        account,
        sdkProvider,
        installedWallets: [],
        isConnected,
        isExternalContext: true,
        connect: async () => {},
        disconnect: async () => {},
      }}
    >
      {children}
    </SolanaContext.Provider>
  )
}

/**
 * Creates a minimal Wallet Standard-compatible object backed by the iframe
 * provider. The SDK's SolanaStepExecutor uses wallet.accounts and the
 * solana:signTransaction feature to sign transactions.
 */
function createIframeWallet(provider: SolanaIframeProvider) {
  const address = provider.address!

  const account = {
    address,
    publicKey: new Uint8Array(32),
    chains: ['solana:mainnet'] as const,
    features: [
      'solana:signTransaction',
      'solana:signAndSendTransaction',
      'solana:signMessage',
    ] as const,
  }

  return {
    name: 'iframe-bridge',
    icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciLz4=' as const,
    version: '1.0.0' as const,
    chains: ['solana:mainnet'] as const,
    accounts: [account],
    features: {
      'solana:signTransaction': {
        version: '1.0.0' as const,
        supportedTransactionVersions: ['legacy', 0] as const,
        async signTransaction(
          ...inputs: Array<{
            account: { address: string }
            transaction: Uint8Array
          }>
        ) {
          const results = []
          for (const input of inputs) {
            const txBase64 = btoa(
              String.fromCharCode(...new Uint8Array(input.transaction))
            )
            const result = (await provider.request('signTransaction', {
              transaction: txBase64,
            })) as { signedTransaction: string }
            const signed = Uint8Array.from(
              atob(result.signedTransaction),
              (c) => c.charCodeAt(0)
            )
            results.push({ signedTransaction: signed })
          }
          return results
        },
      },
      'solana:signAndSendTransaction': {
        version: '1.0.0' as const,
        supportedTransactionVersions: ['legacy', 0] as const,
        async signAndSendTransaction(
          ...inputs: Array<{
            account: { address: string }
            transaction: Uint8Array
          }>
        ) {
          const results = []
          for (const input of inputs) {
            const txBase64 = btoa(
              String.fromCharCode(...new Uint8Array(input.transaction))
            )
            const result = (await provider.request('signAndSendTransaction', {
              transaction: txBase64,
            })) as { signature: string }
            const sig = Uint8Array.from(atob(result.signature), (c) =>
              c.charCodeAt(0)
            )
            results.push({ signature: sig })
          }
          return results
        },
      },
      'solana:signMessage': {
        version: '1.0.0' as const,
        async signMessage(
          ...inputs: Array<{
            account: { address: string }
            message: Uint8Array
          }>
        ) {
          const results = []
          for (const input of inputs) {
            const msgBase64 = btoa(
              String.fromCharCode(...new Uint8Array(input.message))
            )
            const result = (await provider.request('signMessage', {
              message: msgBase64,
            })) as { signature: string }
            const sig = Uint8Array.from(atob(result.signature), (c) =>
              c.charCodeAt(0)
            )
            results.push({ signedMessage: input.message, signature: sig })
          }
          return results
        },
      },
      'standard:events': {
        version: '1.0.0' as const,
        on() {
          return () => {}
        },
      },
    },
  }
}
