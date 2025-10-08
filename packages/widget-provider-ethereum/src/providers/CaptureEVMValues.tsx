import { ChainType, EVM } from '@lifi/sdk'
import { EVMContext, isWalletInstalled } from '@lifi/widget-provider'
import {
  type FC,
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { type Address, isAddress as isEVMAddress } from 'viem'
import { type Connector, useAccount, useConfig, useConnect } from 'wagmi'
import {
  connect,
  disconnect,
  getAccount,
  getBytecode,
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
import type { CreateConnectorFnExtended, EVMWalletConfig } from '../types.js'

interface CaptureEVMValuesProps {
  isExternalContext: boolean
  config?: EVMWalletConfig
}

export const CaptureEVMValues: FC<PropsWithChildren<CaptureEVMValuesProps>> = ({
  children,
  isExternalContext,
  config,
}) => {
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

  const account = { ...currentWallet, chainType: ChainType.EVM }

  return (
    <EVMContext.Provider
      value={{
        isEnabled: true,
        isConnected: account.isConnected,
        sdkProvider: EVM({
          getWalletClient: () =>
            getConnectorClient(wagmiConfig, { assertChainId: false }),
          switchChain: async (chainId: number) => {
            const chain = await switchChain(wagmiConfig, { chainId })
            return getConnectorClient(wagmiConfig, { chainId: chain.id })
          },
        }),
        account,
        installedWallets,
        connect: handleConnect,
        disconnect: handleDisconnect,
        isValidAddress: isEVMAddress,
        isExternalContext,
        getBytecode: (chainId: number, address: string | Address) =>
          getBytecode(wagmiConfig, {
            chainId,
            address: address as Address,
          }),
        getTransactionCount: (chainId: number, address: string | Address) =>
          getTransactionCount(wagmiConfig, {
            chainId,
            address: address as Address,
          }),
      }}
    >
      {children}
    </EVMContext.Provider>
  )
}
