import type { Config as BigmiConfig } from '@bigmi/client'
import {
  disconnect as bigmiDisconnect,
  getAccount as bigmiGetAccount,
} from '@bigmi/client'
import { useConfig as useBigmiConfig } from '@bigmi/react'
import { ChainType } from '@lifi/sdk'
import { useDisconnectWallet } from '@mysten/dapp-kit'
import { useWallet } from '@solana/wallet-adapter-react'
import type { Config, Connector } from 'wagmi'
import { useConfig as useWagmiConfig } from 'wagmi'
import { disconnect, getAccount } from 'wagmi/actions'
import {
  type WalletDisconnected,
  WalletManagementEvent,
} from '../types/events.js'
import type { Account } from './useAccount.js'
import { useWalletManagementEvents } from './useWalletManagementEvents.js'

export const useAccountDisconnect = () => {
  const emitter = useWalletManagementEvents()
  const bigmiConfig = useBigmiConfig()
  const wagmiConfig = useWagmiConfig()
  const { disconnect: solanaDisconnect } = useWallet()
  const { mutateAsync: disconnectWallet } = useDisconnectWallet()

  const handleDisconnectEVM = async (config: Config) => {
    const connectedAccount = getAccount(config)
    if (connectedAccount.connector) {
      await disconnect(config, { connector: connectedAccount.connector })
    }
  }

  const handleDisconnectUTXO = async (config: BigmiConfig) => {
    const connectedAccount = bigmiGetAccount(config)
    if (connectedAccount.connector) {
      await bigmiDisconnect(config, { connector: connectedAccount.connector })
    }
  }

  return async (account: Account) => {
    const walletDisconnected: WalletDisconnected = {
      address: account.address,
      chainId: account.chainId,
      chainType: account.chainType,
      connectorId: (account.connector as Connector)?.id,
      connectorName: (account.connector as Connector)?.name,
    }
    switch (account.chainType) {
      case ChainType.EVM:
        await handleDisconnectEVM(wagmiConfig)
        break
      case ChainType.UTXO:
        await handleDisconnectUTXO(bigmiConfig)
        break
      case ChainType.SVM:
        await solanaDisconnect()
        break
      case ChainType.MVM:
        await disconnectWallet()
        break
    }
    emitter.emit(WalletManagementEvent.WalletDisconnected, walletDisconnected)
  }
}
