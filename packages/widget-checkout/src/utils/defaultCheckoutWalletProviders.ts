import type { WidgetConfig } from '@lifi/widget'
import { BitcoinProvider } from '@lifi/widget-provider-bitcoin'
import { EthereumProvider } from '@lifi/widget-provider-ethereum'
import { SolanaProvider } from '@lifi/widget-provider-solana'
import { SuiProvider } from '@lifi/widget-provider-sui'

/**
 * Same stack as the playground default widget — required for `WalletProvider` to
 * register connectors. Without these, `WalletProvider` renders no ecosystem
 * wrappers and every chain context falls back to empty `installedWallets`.
 */
export function getDefaultCheckoutWalletProviders(): NonNullable<
  WidgetConfig['providers']
> {
  return [
    EthereumProvider({
      baseAccount: true,
      coinbase: true,
      metaMask: true,
      walletConnect: true,
      porto: true,
    }),
    SuiProvider(),
    SolanaProvider(),
    BitcoinProvider(),
  ]
}
