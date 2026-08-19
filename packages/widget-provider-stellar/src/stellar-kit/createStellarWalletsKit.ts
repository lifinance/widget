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

let initialized = false

// Drives SWK programmatically so wallets render in LI.FI's own menu. Mainnet only.
export function initStellarWalletsKit(): { networkPassphrase: string } {
  if (initialized) {
    return { networkPassphrase: Networks.PUBLIC }
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

  StellarWalletsKit.init({ modules, network: Networks.PUBLIC })
  initialized = true

  return { networkPassphrase: Networks.PUBLIC }
}
