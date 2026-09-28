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

const bech32Charset = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l'
const bech32Generator = [
  0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3,
]
const bech32mConstant = 0x2bc830a3

const bech32Polymod = (values: number[]): number =>
  values.reduce((chk, value) => {
    const top = chk >>> 25
    const next = (((chk & 0x1ffffff) << 5) ^ value) >>> 0
    return bech32Generator.reduce(
      (acc, generator, i) => ((top >>> i) & 1 ? (acc ^ generator) >>> 0 : acc),
      next
    )
  }, 1)

/**
 * Whether the bech32m checksum holds. Unified addresses are longer than the
 * 90 characters BIP-350 allows, so no length limit applies (ZIP-316). A pasted
 * address cut short keeps the regex shape but fails here.
 */
const hasValidBech32mChecksum = (address: string): boolean => {
  const separator = address.lastIndexOf('1')
  const hrp = address.slice(0, separator)
  const data = [...address.slice(separator + 1)].map((char) =>
    bech32Charset.indexOf(char)
  )
  if (data.length < 6 || data.includes(-1)) {
    return false
  }
  const hrpExpanded = [
    ...[...hrp].map((char) => char.charCodeAt(0) >> 5),
    0,
    ...[...hrp].map((char) => char.charCodeAt(0) & 31),
  ]
  return bech32Polymod([...hrpExpanded, ...data]) === bech32mConstant
}

/** Whether the value has the shape of any Zcash wallet address. */
export const isZcashAddress = (address: string): boolean =>
  transparentAddressRegex.test(address) ||
  shieldedAddressRegex.test(address) ||
  (unifiedAddressRegex.test(address) && hasValidBech32mChecksum(address))
