/**
 * Zcash carries `ChainType.UTXO`, the key Bitcoin already owns, so it gets no
 * entry of its own in `ProvidersByChainType`. No Zcash wallet provider exists
 * either, so this static check covers the receiver address on its own.
 */

/** Transparent addresses: `t1` is P2PKH, `t3` is P2SH. */
const transparentAddressRegex = /^t[13][a-km-zA-HJ-NP-Z1-9]{33}$/
/** Sapling shielded addresses. */
const shieldedAddressRegex = /^zs1[a-z0-9]{75,}$/
/** Unified addresses, which bundle one receiver per pool. */
const unifiedAddressRegex = /^u1[a-z0-9]{46,}$/

/** Whether the value has the shape of any Zcash wallet address. */
export const isZcashAddress = (address: string): boolean =>
  transparentAddressRegex.test(address) ||
  shieldedAddressRegex.test(address) ||
  unifiedAddressRegex.test(address)
