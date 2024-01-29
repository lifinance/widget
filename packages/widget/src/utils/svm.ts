import { PublicKey } from '@solana/web3.js';

export const isSVMAddress = (address: string) => {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
};
