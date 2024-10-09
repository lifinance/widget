import { isUTXOAddress } from '@lifi/sdk'
import type { Address } from 'viem'
import { InvalidAddressError } from 'viem'

export function getAddress(address: string): Address {
  if (!isUTXOAddress(address)) {
    throw new InvalidAddressError({ address })
  }
  return address as Address
}
