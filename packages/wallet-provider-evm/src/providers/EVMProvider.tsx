import type { ExtendedChain } from '@lifi/sdk'
import { ChainType } from '@lifi/sdk'
import { EVMContext, isWalletInstalled } from '@lifi/wallet-provider'
import {
  type FC,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { isAddress as isEVMAddress } from 'viem'
import {
  type Connector,
  useAccount,
  useConfig,
  useConnect,
  WagmiContext,
} from 'wagmi'
import {
  connect,
  disconnect,
  getAccount,
  getConnectorClient,
  switchChain,
} from 'wagmi/actions'
import { defaultBaseAccountConfig } from '../config/baseAccount.js'
import { defaultCoinbaseConfig } from '../config/coinbase.js'
import { defaultMetaMaskConfig } from '../config/metaMask.js'
import { defaultWalletConnectConfig } from '../config/walletConnect.js'
import { createBaseAccountConnector } from '../connectors/baseAccount.js'
import { createCoinbaseConnector } from '../connectors/coinbase.js'
import { createMetaMaskConnector } from '../connectors/metaMask.js'
import { createPortoConnector } from '../connectors/porto.js'
import { createWalletConnectConnector } from '../connectors/walletConnect.js'
import { EVMBaseProvider } from './EVMBaseProvider.js'

interface EVMProviderProps {
  walletConfig?: any // TODO: WidgetWalletConfig type
  chains?: ExtendedChain[]
}

export function useInEVMContext(): boolean {
  const context = useContext(WagmiContext)
  return Boolean(context)
}

export const EVMProvider: FC<PropsWithChildren<EVMProviderProps>> = ({
  walletConfig,
  chains,
  children,
}) => {
  const forceInternalWalletManagement =
    walletConfig?.forceInternalWalletManagement

  const inEVMContext = useInEVMContext()

  if (inEVMContext && !forceInternalWalletManagement) {
    return (
      <CaptureEVMValues isExternalContext={inEVMContext}>
        {children}
      </CaptureEVMValues>
    )
  }

  return (
    <EVMBaseProvider walletConfig={walletConfig} chains={chains}>
      <CaptureEVMValues
        isExternalContext={inEVMContext}
        walletConfig={walletConfig}
      >
        {children}
      </CaptureEVMValues>
    </EVMBaseProvider>
  )
}

const CaptureEVMValues: FC<
  PropsWithChildren<{ isExternalContext: boolean; walletConfig?: any }>
> = ({ children, isExternalContext, walletConfig }) => {
  const config = useConfig()
  const currentWallet = useAccount()
  const { connectors: wagmiConnectors } = useConnect()
  const [connectors, setConnectors] = useState<Connector[]>([])

  useEffect(() => {
    ;(async () => {
      let evmConnectors: any[] = Array.from(
        wagmiConnectors
        // Remove duplicate connectors
      ).filter(
        (connector: any, index: number, self: any) =>
          index === self.findIndex((c: any) => c.id === connector.id)
      )

      // Check if Safe connector exists and can get a provider
      const safeConnector = evmConnectors.find(
        (connector) => connector.id === 'safe'
      ) as Connector | undefined
      let shouldFilterOutSafeConnector = false

      if (safeConnector) {
        try {
          const provider = await safeConnector.getProvider()
          // If no provider is available, we should filter out the Safe connector
          if (!provider) {
            shouldFilterOutSafeConnector = true
          }
        } catch {
          // If getting provider fails, filter out the Safe connector
          shouldFilterOutSafeConnector = true
        }
      }

      if (shouldFilterOutSafeConnector) {
        evmConnectors = evmConnectors.filter(
          (connector) => connector.id !== 'safe'
        )
      }

      // Ensure standard connectors are included
      if (
        !evmConnectors.some((connector) =>
          connector.id.toLowerCase().includes('walletconnect')
        )
      ) {
        evmConnectors.unshift(
          createWalletConnectConnector(
            walletConfig?.walletConnect ?? defaultWalletConnectConfig
          )
        )
      }
      if (
        !evmConnectors.some((connector) =>
          connector.id.toLowerCase().includes('coinbase')
        )
      ) {
        evmConnectors.unshift(
          createCoinbaseConnector(
            walletConfig?.coinbase ?? defaultCoinbaseConfig
          )
        )
      }
      if (
        !evmConnectors.some((connector) =>
          connector.id.toLowerCase().includes('metamask')
        )
      ) {
        evmConnectors.unshift(
          createMetaMaskConnector(
            walletConfig?.metaMask ?? defaultMetaMaskConfig
          )
        )
      }
      if (
        !evmConnectors.some((connector) =>
          connector.id.toLowerCase().includes('baseaccount')
        )
      ) {
        evmConnectors.unshift(
          createBaseAccountConnector(
            walletConfig?.baseAccount ?? defaultBaseAccountConfig
          )
        )
      }
      if (
        !evmConnectors.some((connector) =>
          connector.id.toLowerCase().includes('porto')
        )
      ) {
        evmConnectors.unshift(createPortoConnector(walletConfig?.porto))
      }

      setConnectors(evmConnectors)
    })()
  }, [wagmiConnectors, walletConfig])

  const handleConnect = useCallback(
    async (connector: Connector) => {
      return await connect(config, { connector })
    },
    [config]
  )

  const handleDisconnect = useCallback(async () => {
    const connectedAccount = getAccount(config)
    if (connectedAccount.connector) {
      await disconnect(config, {
        connector: connectedAccount.connector,
      })
    }
  }, [config])

  const account = { ...currentWallet, chainType: ChainType.EVM }

  const installedWallets = useMemo(
    () =>
      connectors.filter((connector: any) => isWalletInstalled(connector.id)),
    [connectors]
  )

  const nonDetectedWallets = useMemo(
    () =>
      connectors.filter((connector: any) => !isWalletInstalled(connector.id)),
    [connectors]
  )

  return (
    <EVMContext.Provider
      value={{
        walletClient: getConnectorClient(config),
        account,
        installedWallets,
        nonDetectedWallets,
        connect: handleConnect,
        disconnect: handleDisconnect,
        isValidAddress: isEVMAddress,
        isExternalContext,
        switchChain: async (chainId: number) => {
          const chain = await switchChain(config, { chainId })
          return getConnectorClient(config, { chainId: chain.id })
        },
      }}
    >
      {children}
    </EVMContext.Provider>
  )
}
