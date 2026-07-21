import {
  type ModuleInterface,
  Networks,
  StellarWalletsKit,
} from '@creit.tech/stellar-wallets-kit'
import { BitgetModule } from '@creit.tech/stellar-wallets-kit/modules/bitget'
import { FreighterModule } from '@creit.tech/stellar-wallets-kit/modules/freighter'
import { HanaModule } from '@creit.tech/stellar-wallets-kit/modules/hana'
import { KleverModule } from '@creit.tech/stellar-wallets-kit/modules/klever'
import { LobstrModule } from '@creit.tech/stellar-wallets-kit/modules/lobstr'
import { OneKeyModule } from '@creit.tech/stellar-wallets-kit/modules/onekey'
import { RabetModule } from '@creit.tech/stellar-wallets-kit/modules/rabet'
import {
  WalletConnectModule,
  WalletConnectTargetChain,
} from '@creit.tech/stellar-wallets-kit/modules/wallet-connect'
import { xBullModule } from '@creit.tech/stellar-wallets-kit/modules/xbull'
import type { StellarProviderConfig } from '../types.js'

/**
 * The curated set of Stellar wallets surfaced in the LI.FI wallet menu:
 * browser-extension wallets (only shown when actually installed) plus
 * WalletConnect (mobile QR, always offered as a connection method). The ids
 * match each Stellar Wallets Kit module's `productId`; we filter
 * `refreshSupportedWallets()` against this list so only these appear.
 *
 * Albedo (pure web, no install state) is intentionally excluded so the menu
 * reflects wallets the user actually has installed.
 */
export const ENABLED_WALLET_IDS: string[] = [
  'freighter',
  'xbull',
  'lobstr',
  'rabet',
  'hana',
  'klever',
  'onekey',
  // Bitget's productId is the mixed-case "BitgetWallet" (not "bitget").
  'BitgetWallet',
  // Stellar Wallets Kit's WalletConnect module id (WALLET_CONNECT_ID).
  'wallet_connect',
]

const resolveNetwork = (passphrase?: string): Networks =>
  (passphrase as Networks) ?? Networks.PUBLIC

let initialized = false

/**
 * Initializes the (global, static) Stellar Wallets Kit with the browser-extension
 * modules plus, when a project id is configured, the WalletConnect module. SWK's
 * built-in modal is not used — the kit is driven programmatically so wallets
 * render inside LI.FI's own wallet menu. Safe to call more than once; it only
 * initializes on the first call.
 */
export function initStellarWalletsKit(config?: StellarProviderConfig): {
  networkPassphrase: string
} {
  const network = resolveNetwork(config?.networkPassphrase)
  if (initialized) {
    return { networkPassphrase: network }
  }

  const modules: ModuleInterface[] = [
    new FreighterModule(),
    new xBullModule(),
    new LobstrModule(),
    new RabetModule(),
    new HanaModule(),
    new KleverModule(),
    new OneKeyModule(),
    new BitgetModule(),
  ]

  if (config?.walletConnect?.projectId) {
    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'https://li.fi'
    modules.push(
      new WalletConnectModule({
        projectId: config.walletConnect.projectId,
        metadata: {
          name: config.walletConnect.name ?? 'LI.FI',
          description: config.walletConnect.description ?? 'LI.FI Widget',
          url: config.walletConnect.url ?? origin,
          icons: config.walletConnect.icons ?? [],
        },
        allowedChains: [
          network === Networks.TESTNET
            ? WalletConnectTargetChain.TESTNET
            : WalletConnectTargetChain.PUBLIC,
        ],
      })
    )
  }

  StellarWalletsKit.init({ modules, network })
  initialized = true

  return { networkPassphrase: network }
}
