import { ChainType } from '@lifi/sdk'
import {
  useMVMContext,
  useSVMContext,
  useUTXOContext,
} from '@lifi/wallet-provider'
import type { Config } from 'wagmi'
import { useConfig as useWagmiConfig } from 'wagmi'
import { disconnect, getAccount } from 'wagmi/actions'
import type { Account } from './useAccount.js'

export const useAccountDisconnect = () => {
  const wagmiConfig = useWagmiConfig()
  const { disconnect: utxoDisconnect } = useUTXOContext()
  const { disconnect: svmDisconnect } = useSVMContext()
  const { disconnect: suiDisconnect } = useMVMContext()

  const handleDisconnectEVM = async (config: Config) => {
    const connectedAccount = getAccount(config)
    if (connectedAccount.connector) {
      await disconnect(config, { connector: connectedAccount.connector })
    }
  }

  return async (account: Account) => {
    switch (account.chainType) {
      case ChainType.EVM:
        await handleDisconnectEVM(wagmiConfig)
        break
      case ChainType.UTXO:
        await utxoDisconnect()
        break
      case ChainType.SVM:
        await svmDisconnect()
        break
      case ChainType.MVM:
        await suiDisconnect()
        break
    }
  }
}
