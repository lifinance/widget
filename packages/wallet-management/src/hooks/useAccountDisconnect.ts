import { useConfig as useBigmiConfig } from '@bigmi/react'
import { ChainType } from '@lifi/sdk'
import { useDisconnectWallet } from '@mysten/dapp-kit'
import { useWallet } from '@solana/wallet-adapter-react'
import type { Config } from 'wagmi'
import { useConfig as useWagmiConfig } from 'wagmi'
import { disconnect, getAccount } from 'wagmi/actions'
import type { Account } from './useAccount.js'

export const useAccountDisconnect = () => {
  const bigmiConfig = useBigmiConfig()
  const wagmiConfig = useWagmiConfig()
  const { disconnect: solanaDisconnect } = useWallet()
  const { mutateAsync: disconnectWallet } = useDisconnectWallet()

  const handleDisconnect = async (config: Config) => {
    const connectedAccount = getAccount(config)
    if (connectedAccount.connector) {
      await disconnect(config, { connector: connectedAccount.connector })
    }
  }

  return async (account: Account) => {
    switch (account.chainType) {
      case ChainType.EVM:
        await handleDisconnect(wagmiConfig)
        break
      case ChainType.UTXO:
        await handleDisconnect(bigmiConfig)
        break
      case ChainType.SVM:
        await solanaDisconnect()
        break
      case ChainType.MVM:
        await disconnectWallet()
        break
    }
  }
}
