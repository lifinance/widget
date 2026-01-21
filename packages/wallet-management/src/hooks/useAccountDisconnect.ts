import { ChainType } from '@lifi/sdk'
import {
  type Account,
  useBitcoinContext,
  useEthereumContext,
  useSolanaContext,
  useSuiContext,
  type WalletConnector,
} from '@lifi/widget-provider'
import {
  type WalletDisconnected,
  WalletManagementEvent,
} from '../types/events.js'
import { useWalletManagementEvents } from './useWalletManagementEvents.js'

export const useAccountDisconnect = () => {
  const { disconnect: ethereumDisconnect } = useEthereumContext()
  const { disconnect: bitcoinDisconnect } = useBitcoinContext()
  const { disconnect: solanaDisconnect } = useSolanaContext()
  const { disconnect: suiDisconnect } = useSuiContext()
  const emitter = useWalletManagementEvents()

  return async (account: Account) => {
    const walletDisconnected: WalletDisconnected = {
      address: account.address,
      chainId: account.chainId,
      chainType: account.chainType,
      connectorId: (account.connector as WalletConnector)?.id,
      connectorName: (account.connector as WalletConnector)?.name,
    }
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
    emitter.emit(WalletManagementEvent.WalletDisconnected, walletDisconnected)
  }
}
