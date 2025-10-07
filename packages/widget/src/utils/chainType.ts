import { ChainId, ChainType } from '@lifi/sdk'

export const defaultChainIdsByType = {
  [ChainType.EVM]: ChainId.ETH,
  [ChainType.SVM]: ChainId.SOL,
  [ChainType.UTXO]: ChainId.BTC,
  [ChainType.MVM]: ChainId.SUI,
  [ChainType.TVM]: ChainId.TRN,
}
