import type { JumperTier } from '../../types/widget.js'
import type { JumperTab, JumperTabKey } from './types.js'

/** All jumper tabs by key. Labels are resolved from the key by a hook. */
const jumperTabs: Record<JumperTabKey, JumperTab> = {
  exchange: { key: 'exchange', mode: 'default' },
  private: { key: 'private', mode: 'split', modeOptions: { split: 'swap' } },
  gas: { key: 'gas', mode: 'refuel' },
  swap: { key: 'swap', mode: 'split', modeOptions: { split: 'swap' } },
  bridge: { key: 'bridge', mode: 'split', modeOptions: { split: 'bridge' } },
  limit: { key: 'limit', mode: 'default' },
}

/** Tab keys shown per tier, in order. */
const jumperTierKeys: Record<JumperTier, JumperTabKey[]> = {
  simple: ['exchange', 'private', 'gas'],
  advanced: ['swap', 'bridge', 'limit'],
}

export const getJumperTabs = (jumperTier?: JumperTier): JumperTab[] =>
  jumperTier ? jumperTierKeys[jumperTier].map((key) => jumperTabs[key]) : []

export const getJumperTab = (key: JumperTabKey): JumperTab => jumperTabs[key]

export const getDefaultJumperTabKey = (jumperTier: JumperTier): JumperTabKey =>
  jumperTierKeys[jumperTier][0]
