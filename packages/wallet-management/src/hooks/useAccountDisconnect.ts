import { ChainType } from '@lifi/sdk'
import {
  type Account,
  useBitcoinContext,
  useEthereumContext,
  useSolanaContext,
  useSuiContext,
} from '@lifi/widget-provider'

export const useAccountDisconnect = () => {
  const { disconnect: ethereumDisconnect } = useEthereumContext()
  const { disconnect: bitcoinDisconnect } = useBitcoinContext()
  const { disconnect: solanaDisconnect } = useSolanaContext()
  const { disconnect: suiDisconnect } = useSuiContext()

  return async (account: Account) => {
    switch (account.chainType) {
      case ChainType.EVM:
        await ethereumDisconnect()
        break
      case ChainType.UTXO:
        await bitcoinDisconnect()
        break
      case ChainType.SVM:
        await solanaDisconnect()
        break
      case ChainType.MVM:
        await suiDisconnect()
        break
    }
  }
}
