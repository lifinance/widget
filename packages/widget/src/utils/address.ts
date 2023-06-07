import * as web3 from '@solana/web3.js';
import { isAddress } from '@ethersproject/address';

/**
 * isLiFiAddress checks if the address is a valid EVM or Solana address.
 * @param address: string
 * @returns
 */
export const isLiFiAddress = (address: string): boolean => {
  // checks if the address is EVM
  if (isAddress(address)) {
    return true;
  }

  // checks if the address is a valid Solana PublicKey
  try {
    new web3.PublicKey(address);
    return true;
  } catch (_) {}

  // exhausted, not a "valid" address
  return false;
};
