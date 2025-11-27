import { ChainType } from '@lifi/sdk'
import {
  EthereumProvider as EthereumSDKProvider,
  isBatchingSupported,
  isDelegationDesignatorCode,
  isGaslessStep,
} from '@lifi/sdk-provider-ethereum'
import { EthereumContext, isWalletInstalled } from '@lifi/widget-provider'
import {
  type FC,
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { Address } from 'viem'
import type { Connector } from 'wagmi'
import { useAccount, useConfig, useConnect } from 'wagmi'
import {
  connect,
  disconnect,
  getAccount,
  getBytecode,
  getConnectorClient,
  getTransactionCount,
  switchChain,
} from 'wagmi/actions'
import { defaultBaseAccountConfig } from '../config/baseAccount'
import { defaultCoinbaseConfig } from '../config/coinbase'
import { defaultMetaMaskConfig } from '../config/metaMask'
import { defaultWalletConnectConfig } from '../config/walletConnect'
import { createBaseAccountConnector } from '../connectors/baseAccount'
import { createCoinbaseConnector } from '../connectors/coinbase'
import { createMetaMaskConnector } from '../connectors/metaMask'
import { createPortoConnector } from '../connectors/porto'
import { createWalletConnectConnector } from '../connectors/walletConnect'
import type {
  CreateConnectorFnExtended,
  EthereumProviderConfig,
} from '../types'

interface EthereumProviderValuesProps {
  isExternalContext: boolean
  config?: EthereumProviderConfig
}

export const EthereumProviderValues: FC<
  PropsWithChildren<EthereumProviderValuesProps>
> = ({ children, isExternalContext, config }) => {
  const wagmiConfig = useConfig()
  const currentWallet = useAccount()
  const { connectors: wagmiConnectors } = useConnect()
  const [connectors, setConnectors] = useState<
    (CreateConnectorFnExtended | Connector)[]
  >([])

  useEffect(() => {
    ;(async () => {
      let evmConnectors: (CreateConnectorFnExtended | Connector)[] = Array.from(
        wagmiConnectors
        // Remove duplicate connectors
      ).filter(
        (connector, index, self) =>
          index === self.findIndex((c) => c.id === connector.id)
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
            config?.walletConnect ?? defaultWalletConnectConfig
          )
        )
      }
      if (
        !evmConnectors.some((connector) =>
          connector.id.toLowerCase().includes('coinbase')
        )
      ) {
        evmConnectors.unshift(
          createCoinbaseConnector(config?.coinbase ?? defaultCoinbaseConfig)
        )
      }
      if (
        !evmConnectors.some((connector) =>
          connector.id.toLowerCase().includes('metamask')
        )
      ) {
        evmConnectors.unshift(
          createMetaMaskConnector(config?.metaMask ?? defaultMetaMaskConfig)
        )
      }
      if (
        !evmConnectors.some((connector) =>
          connector.id.toLowerCase().includes('baseaccount')
        )
      ) {
        evmConnectors.unshift(
          createBaseAccountConnector(
            config?.baseAccount ?? defaultBaseAccountConfig
          )
        )
      }
      if (
        !evmConnectors.some((connector) =>
          connector.id.toLowerCase().includes('porto')
        )
      ) {
        evmConnectors.unshift(createPortoConnector(config?.porto))
      }

      setConnectors(evmConnectors)
    })()
  }, [wagmiConnectors, config])

  const account = { ...currentWallet, chainType: ChainType.EVM }

  const isConnected = account.isConnected

  const sdkProvider = useMemo(
    () =>
      EthereumSDKProvider({
        getWalletClient: () =>
          getConnectorClient(wagmiConfig, { assertChainId: false }),
        switchChain: async (chainId: number) => {
          const chain = await switchChain(wagmiConfig, { chainId })
          return getConnectorClient(wagmiConfig, { chainId: chain.id })
        },
      }),
    [wagmiConfig]
  )

  const installedWallets = useMemo(
    () =>
      connectors.filter((connector: Connector | CreateConnectorFnExtended) =>
        isWalletInstalled(connector.id)
      ),
    [connectors]
  )

  const handleConnect = useCallback(
    async (
      connectorIdOrName: string,
      onSuccess?: (address: string, chainId: number) => void
    ) => {
      const connector = connectors.find(
        (connector) => (connector.id ?? connector.name) === connectorIdOrName
      )
      if (connector) {
        const data = await connect(wagmiConfig, {
          connector: connector as Connector,
        })
        onSuccess?.(data.accounts[0], data.chainId)
      }
    },
    [wagmiConfig, connectors]
  )

  const handleDisconnect = useCallback(async () => {
    const connectedAccount = getAccount(wagmiConfig)
    if (connectedAccount.connector) {
      await disconnect(wagmiConfig, {
        connector: connectedAccount.connector,
      })
    }
  }, [wagmiConfig])

  const handleGetBytecode = useCallback(
    (chainId: number, address: string | Address) =>
      getBytecode(wagmiConfig, {
        chainId,
        address: address as Address,
      }),
    [wagmiConfig]
  )

  const handleGetTransactionCount = useCallback(
    (chainId: number, address: string | Address) =>
      getTransactionCount(wagmiConfig, {
        chainId,
        address: address as Address,
      }),
    [wagmiConfig]
  )

  return (
    <EthereumContext.Provider
      value={{
        isEnabled: true,
        account,
        sdkProvider,
        installedWallets,
        isConnected,
        isExternalContext,
        connect: handleConnect,
        disconnect: handleDisconnect,
        getBytecode: handleGetBytecode,
        getTransactionCount: handleGetTransactionCount,
        isGaslessStep,
        isBatchingSupported,
        isDelegationDesignatorCode,
      }}
    >
      {children}
    </EthereumContext.Provider>
  )
}
