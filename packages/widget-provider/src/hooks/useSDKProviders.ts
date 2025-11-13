import { useBitcoinContext } from '../contexts/BitcoinContext'
import { useEthereumContext } from '../contexts/EthereumContext'
import { useSolanaContext } from '../contexts/SolanaContext'
import { useSuiContext } from '../contexts/SuiContext'

export const useSDKProviders = () => {
  const { sdkProvider: evmSDKProvider } = useEthereumContext()
  const { sdkProvider: utxoSDKProvider } = useBitcoinContext()
  const { sdkProvider: svmSDKProvider } = useSolanaContext()
  const { sdkProvider: suiSDKProvider } = useSuiContext()

  return [
    evmSDKProvider,
    utxoSDKProvider,
    svmSDKProvider,
    suiSDKProvider,
  ].filter((provider) => provider !== null)
}
