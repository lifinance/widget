import {
  type ModuleInterface,
  Networks,
  StellarWalletsKit,
} from '@creit.tech/stellar-wallets-kit'
import {
  BITGET_WALLET_ID,
  BitgetModule,
} from '@creit.tech/stellar-wallets-kit/modules/bitget'
import {
  FREIGHTER_ID,
  FreighterModule,
} from '@creit.tech/stellar-wallets-kit/modules/freighter'
import {
  HANA_ID,
  HanaModule,
} from '@creit.tech/stellar-wallets-kit/modules/hana'
import {
  KLEVER_ID,
  KleverModule,
} from '@creit.tech/stellar-wallets-kit/modules/klever'
import {
  LOBSTR_ID,
  LobstrModule,
} from '@creit.tech/stellar-wallets-kit/modules/lobstr'
import {
  ONEKEY_ID,
  OneKeyModule,
} from '@creit.tech/stellar-wallets-kit/modules/onekey'
import {
  RABET_ID,
  RabetModule,
} from '@creit.tech/stellar-wallets-kit/modules/rabet'
import {
  WALLET_CONNECT_ID,
  WalletConnectModule,
  WalletConnectTargetChain,
} from '@creit.tech/stellar-wallets-kit/modules/wallet-connect'
import {
  XBULL_ID,
  xBullModule,
} from '@creit.tech/stellar-wallets-kit/modules/xbull'
import type { StellarProviderConfig } from '../types.js'

/**
 * The curated set of Stellar wallets surfaced in the LI.FI wallet menu:
 * browser-extension wallets (only shown when actually installed) plus
 * WalletConnect (mobile QR, always offered as a connection method). We filter
 * `refreshSupportedWallets()` against this list so only these appear.
 *
 * Albedo (pure web, no install state) is intentionally excluded so the menu
 * reflects wallets the user actually has installed.
 */
export const ENABLED_WALLET_IDS: string[] = [
  FREIGHTER_ID,
  XBULL_ID,
  LOBSTR_ID,
  RABET_ID,
  HANA_ID,
  KLEVER_ID,
  ONEKEY_ID,
  BITGET_WALLET_ID,
  WALLET_CONNECT_ID,
]

const supportedPassphrases = new Set<string>(Object.values(Networks))

const resolveNetwork = (passphrase?: string): Networks => {
  if (!passphrase) {
    return Networks.PUBLIC
  }
  if (!supportedPassphrases.has(passphrase)) {
    throw new Error(
      `Unknown Stellar network passphrase: "${passphrase}". Use one of the \`Networks\` values exported by @creit.tech/stellar-wallets-kit.`
    )
  }
  return passphrase as Networks
}

// The kit is a static singleton, so the first initialization wins. Keeping the
// resolved network here lets later callers read back what the kit actually uses
// instead of re-resolving their own (possibly absent) config.
let initializedNetwork: Networks | undefined

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
  if (initializedNetwork) {
    return { networkPassphrase: initializedNetwork }
  }

  const network = resolveNetwork(config?.networkPassphrase)

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
  initializedNetwork = network

  return { networkPassphrase: network }
}
