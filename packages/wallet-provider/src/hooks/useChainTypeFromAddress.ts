import { ChainType } from '@lifi/sdk'
import { useCallback } from 'react'
import { useEVMContext } from '../contexts/EVMContext.js'
import { useMVMContext } from '../contexts/MVMContext.js'
import { useSVMContext } from '../contexts/SVMContext.js'
import { useUTXOContext } from '../contexts/UTXOContext.js'

export const useChainTypeFromAddress = () => {
  const { isValidAddress: isValidEVMAddress } = useEVMContext()
  const { isValidAddress: isValidSVMAddress } = useSVMContext()
  const { isValidAddress: isValidUTXOAddress } = useUTXOContext()
  const { isValidAddress: isValidSuiAddress } = useMVMContext()

  const getChainTypeFromAddress = useCallback(
    (address: string): ChainType | undefined => {
      if (isValidEVMAddress(address)) {
        return ChainType.EVM
      }
      if (isValidSVMAddress(address)) {
        return ChainType.SVM
      }
      if (isValidUTXOAddress(address)) {
        return ChainType.UTXO
      }
      if (isValidSuiAddress(address)) {
        return ChainType.MVM
      }
      //[ChainType.TVM]: () => false,
    },
    [
      isValidEVMAddress,
      isValidSVMAddress,
      isValidUTXOAddress,
      isValidSuiAddress,
    ]
  )
  return { getChainTypeFromAddress }
}
