import {
  type ModuleInterface,
  Networks,
  selectedModuleId,
  StellarWalletsKit,
} from '@creit.tech/stellar-wallets-kit'
import {
  BITGET_WALLET_ID,
  BitgetModule,
} from '@creit.tech/stellar-wallets-kit/modules/bitget'
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
  VARIAL_ID,
  VarialModule,
} from '@creit.tech/stellar-wallets-kit/modules/varial'
import {
  XBULL_ID,
  xBullModule,
} from '@creit.tech/stellar-wallets-kit/modules/xbull'

// Extension wallets shown in the LI.FI menu, matched against SWK product ids.
export const ENABLED_WALLET_IDS: string[] = [
  VARIAL_ID,
  XBULL_ID,
  LOBSTR_ID,
  RABET_ID,
  HANA_ID,
  KLEVER_ID,
  ONEKEY_ID,
  BITGET_WALLET_ID,
]

// SWK 2.7.1 and earlier saved Varial's module under this id.
const LEGACY_FREIGHTER_ID = 'freighter'

let initialized = false

// Drives SWK programmatically so wallets render in LI.FI's own menu. Mainnet only.
export function initStellarWalletsKit(): { networkPassphrase: string } {
  if (initialized) {
    return { networkPassphrase: Networks.PUBLIC }
  }

  const modules: ModuleInterface[] = [
    new VarialModule(),
    new xBullModule(),
    new LobstrModule(),
    new RabetModule(),
    new HanaModule(),
    new KleverModule(),
    new OneKeyModule(),
    new BitgetModule(),
  ]

  StellarWalletsKit.init({ modules, network: Networks.PUBLIC })
  if (selectedModuleId.value === LEGACY_FREIGHTER_ID) {
    StellarWalletsKit.setWallet(VARIAL_ID)
  }
  initialized = true

  return { networkPassphrase: Networks.PUBLIC }
}
