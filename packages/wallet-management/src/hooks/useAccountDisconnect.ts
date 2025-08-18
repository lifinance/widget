import type { Config as BigmiConfig } from '@bigmi/client'
import {
  disconnect as bigmiDisconnect,
  getAccount as bigmiGetAccount,
} from '@bigmi/client'
import { useConfig as useBigmiConfig } from '@bigmi/react'
import { ChainType } from '@lifi/sdk'
import { useDisconnectWallet } from '@mysten/dapp-kit'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWallet as useTronWallet } from '@tronweb3/tronwallet-adapter-react-hooks'
import type { Config } from 'wagmi'
import { useConfig as useWagmiConfig } from 'wagmi'
import { disconnect, getAccount } from 'wagmi/actions'
import type { Account } from './useAccount.js'

export const useAccountDisconnect = () => {
  const bigmiConfig = useBigmiConfig()
  const wagmiConfig = useWagmiConfig()
  const { disconnect: solanaDisconnect } = useWallet()
  const { mutateAsync: disconnectWallet } = useDisconnectWallet()
  const { disconnect: tronDisconnect } = useTronWallet()

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
      case 'TVM' as ChainType:
        await tronDisconnect()
        break
    }
  }
}
