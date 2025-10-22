import { ChainType } from '@lifi/sdk'
import { useCallback } from 'react'
import { useBitcoinContext } from '../contexts/BitcoinContext.js'
import { useEthereumContext } from '../contexts/EthereumContext.js'
import { useSolanaContext } from '../contexts/SolanaContext.js'
import { useSuiContext } from '../contexts/SuiContext.js'

export const useChainTypeFromAddress = () => {
  const { isValidAddress: isValidEthereumAddress } = useEthereumContext()
  const { isValidAddress: isValidSolanaAddress } = useSolanaContext()
  const { isValidAddress: isValidBitcoinAddress } = useBitcoinContext()
  const { isValidAddress: isValidSuiAddress } = useSuiContext()

  const getChainTypeFromAddress = useCallback(
    (address: string): ChainType | undefined => {
      if (isValidEthereumAddress(address)) {
        return ChainType.EVM
      }
      if (isValidSolanaAddress(address)) {
        return ChainType.SVM
      }
      if (isValidBitcoinAddress(address)) {
        return ChainType.UTXO
      }
      if (isValidSuiAddress(address)) {
        return ChainType.MVM
      }
    },
    [
      isValidEthereumAddress,
      isValidSolanaAddress,
      isValidBitcoinAddress,
      isValidSuiAddress,
    ]
  )
  return { getChainTypeFromAddress }
}
