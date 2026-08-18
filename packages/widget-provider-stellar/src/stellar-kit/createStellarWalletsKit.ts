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
  XBULL_ID,
  xBullModule,
} from '@creit.tech/stellar-wallets-kit/modules/xbull'
import type { StellarProviderConfig } from '../types.js'

// Extension wallets shown in the LI.FI menu, matched against SWK product ids.
export const ENABLED_WALLET_IDS: string[] = [
  FREIGHTER_ID,
  XBULL_ID,
  LOBSTR_ID,
  RABET_ID,
  HANA_ID,
  KLEVER_ID,
  ONEKEY_ID,
  BITGET_WALLET_ID,
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

// First init wins; keep the network so later callers read back what the kit uses.
let initializedNetwork: Networks | undefined

let recordedConfig: StellarProviderConfig | undefined

// `StellarProvider()` runs at module scope, so it only records config; the kit is
// constructed when the store first needs it.
export function recordStellarConfig(config?: StellarProviderConfig): void {
  recordedConfig ??= config
}

// Drives SWK programmatically so wallets render in LI.FI's own menu. First call wins.
export function initStellarWalletsKit(config?: StellarProviderConfig): {
  networkPassphrase: string
} {
  if (initializedNetwork) {
    return { networkPassphrase: initializedNetwork }
  }

  const resolvedConfig = config ?? recordedConfig
  const network = resolveNetwork(resolvedConfig?.networkPassphrase)

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

  StellarWalletsKit.init({ modules, network })
  initializedNetwork = network

  return { networkPassphrase: network }
}
