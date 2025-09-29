// TODO: remove config and connectors exports after wallet-management migration
export { defaultBaseAccountConfig } from './config/baseAccount.js'
export { defaultCoinbaseConfig } from './config/coinbase.js'
export { defaultMetaMaskConfig } from './config/metaMask.js'
export { defaultWalletConnectConfig } from './config/walletConnect.js'
export { createBaseAccountConnector } from './connectors/baseAccount.js'
export { createCoinbaseConnector } from './connectors/coinbase.js'
export { createMetaMaskConnector } from './connectors/metaMask.js'
export { createPortoConnector } from './connectors/porto.js'
export { createWalletConnectConnector } from './connectors/walletConnect.js'
export { useSyncWagmiConfig } from './hooks/useSyncWagmiConfig.js'
export { EVMProvider, useInEVMContext } from './providers/EVMProvider.js'
export type { CreateConnectorFnExtended } from './types/connectors.js'
export {
  convertExtendedChain,
  isExtendedChain,
} from './utils/convertExtendedChain.js'
