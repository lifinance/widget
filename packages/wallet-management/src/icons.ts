import { ChainType } from '@lifi/sdk'

export const getWalletIcon = (id: string): string | undefined => {
  switch (id) {
    case 'walletConnect':
      return 'https://lifinance.github.io/types/src/assets/icons/wallets/walletConnect.svg'
    case 'coinbaseWalletSDK':
      return 'https://lifinance.github.io/types/src/assets/icons/wallets/coinbase.svg'
    case 'safe':
      return 'https://lifinance.github.io/types/src/assets/icons/wallets/safe.svg'
    case 'metaMaskSDK':
    case 'io.metamask':
      return 'https://lifinance.github.io/types/src/assets/icons/wallets/metamask.svg'
    default:
      break
  }
}

export const getChainTypeIcon = (chainType: ChainType) => {
  switch (chainType) {
    case ChainType.EVM:
      return 'https://lifinance.github.io/types/src/assets/icons/chains/ethereum.svg'
    case ChainType.SVM:
      return 'https://lifinance.github.io/types/src/assets/icons/chains/solana.svg'
    case ChainType.UTXO:
      return 'https://lifinance.github.io/types/src/assets/icons/chains/bitcoin.svg'
    case ChainType.MVM:
      return 'https://lifinance.github.io/types/src/assets/icons/chains/sui.svg'
  }
}

export const lifiLogoUrl =
  'https://lifinance.github.io/types/src/assets/icons/bridges/lifi.svg'
