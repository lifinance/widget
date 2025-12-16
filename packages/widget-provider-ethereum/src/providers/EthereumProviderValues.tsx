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
import { useConfig, useConnection, useConnectors } from 'wagmi'
import {
  connect,
  disconnect,
  getBytecode,
  getConnection,
  getConnectorClient,
  getTransactionCount,
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
import type {
  CreateConnectorFnExtended,
  EthereumProviderConfig,
} from '../types.js'

interface EthereumProviderValuesProps {
  isExternalContext: boolean
  config?: EthereumProviderConfig
}

export const EthereumProviderValues: FC<
  PropsWithChildren<EthereumProviderValuesProps>
> = ({ children, isExternalContext, config }) => {
  const wagmiConfig = useConfig()
  const currentWallet = useConnection()
  const wagmiConnectors = useConnectors()
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

      // Load additional connectors based on config
      // Only connectors with provided config are loaded
      // Config value can be: true (use defaults), object (use that config), or false/undefined (skip)
      const additionalConnectors: CreateConnectorFnExtended[] = []

      // If WalletConnect is the most recently connected wallet or lazy loading is disabled,
      // add the WalletConnect connector to the beginning of the connectors list
      if (
        config?.walletConnect &&
        !evmConnectors.some((connector) =>
          connector.id.toLowerCase().includes('walletconnect')
        )
      ) {
        const walletConnectConfig =
          config.walletConnect === true
            ? defaultWalletConnectConfig
            : config.walletConnect
        additionalConnectors.push(
          createWalletConnectConnector(walletConnectConfig)
        )
      }
      if (
        config?.coinbase &&
        !evmConnectors.some((connector) =>
          connector.id.toLowerCase().includes('coinbase')
        )
      ) {
        const coinbaseConfig =
          config.coinbase === true ? defaultCoinbaseConfig : config.coinbase
        additionalConnectors.unshift(createCoinbaseConnector(coinbaseConfig))
      }
      if (
        config?.metaMask &&
        !evmConnectors.some((connector) =>
          connector.id.toLowerCase().includes('metamask')
        )
      ) {
        const metaMaskConfig =
          config.metaMask === true ? defaultMetaMaskConfig : config.metaMask
        additionalConnectors.unshift(createMetaMaskConnector(metaMaskConfig))
      }
      if (
        config?.baseAccount &&
        !evmConnectors.some((connector) =>
          connector.id.toLowerCase().includes('baseaccount')
        )
      ) {
        const baseAccountConfig =
          config.baseAccount === true
            ? defaultBaseAccountConfig
            : config.baseAccount
        additionalConnectors.unshift(
          createBaseAccountConnector(baseAccountConfig)
        )
      }
      if (
        config?.porto &&
        !evmConnectors.some((connector) =>
          connector.id.toLowerCase().includes('porto')
        )
      ) {
        const portoConfig = config.porto === true ? undefined : config.porto
        additionalConnectors.unshift(createPortoConnector(portoConfig))
      }

      evmConnectors.unshift(...additionalConnectors)

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
    const connectedConnection = getConnection(wagmiConfig)
    if (connectedConnection.connector) {
      await disconnect(wagmiConfig, {
        connector: connectedConnection.connector,
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
