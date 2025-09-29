import type { ExtendedChain } from '@lifi/sdk'
import { ChainType } from '@lifi/sdk'
import { EVMContext } from '@lifi/wallet-provider'
import { type FC, type PropsWithChildren, useCallback, useContext } from 'react'
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
      <CaptureEVMValues isExternalContext={inEVMContext}>
        {children}
      </CaptureEVMValues>
    </EVMBaseProvider>
  )
}

const CaptureEVMValues: FC<
  PropsWithChildren<{ isExternalContext: boolean }>
> = ({ children, isExternalContext }) => {
  const config = useConfig()
  const currentWallet = useAccount()
  const { connectors } = useConnect()

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

  return (
    <EVMContext.Provider
      value={{
        walletClient: getConnectorClient(config),
        wallets: connectors,
        account,
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
