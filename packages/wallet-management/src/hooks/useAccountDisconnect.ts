import { ChainType } from '@lifi/sdk'
import {
  useEVMContext,
  useMVMContext,
  useSVMContext,
  useUTXOContext,
} from '@lifi/wallet-provider'
import type { Account } from './useAccount.js'

export const useAccountDisconnect = () => {
  const { disconnect: evmDisconnect } = useEVMContext()
  const { disconnect: utxoDisconnect } = useUTXOContext()
  const { disconnect: svmDisconnect } = useSVMContext()
  const { disconnect: suiDisconnect } = useMVMContext()

  return async (account: Account) => {
    switch (account.chainType) {
      case ChainType.EVM:
        await evmDisconnect()
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
