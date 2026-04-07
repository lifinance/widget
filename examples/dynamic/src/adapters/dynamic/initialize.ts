import type { ISolana } from '@dynamic-labs/solana-core'
import { PublicKey } from '@solana/web3.js'
import { registerWallet } from './register.js'
import { TurnkeyHDWallet } from './wallet.js'
import type { TurnkeyHD } from './window.js'

function adaptToTurnkeyHD(wallet: ISolana): TurnkeyHD {
  return {
    publicKey: wallet.publicKey
      ? new PublicKey(wallet.publicKey.toBytes())
      : null,
    async connect() {
      const result = await wallet.connect()
      if (!result?.publicKey) {
        throw new Error('Failed to connect')
      }
      return { publicKey: new PublicKey(result.publicKey) }
    },
    on: (event, listener) => wallet?.on?.(event, listener),
    off: (event, listener) => wallet?.off?.(event, listener),
    signTransaction: (txn) => wallet.signTransaction(txn as any) as any,
    signMessage: (message) => wallet.signMessage(message),
    disconnect: () => wallet.disconnect(),
    signAllTransactions: (txns) =>
      wallet.signAllTransactions(txns as any) as any,
    signAndSendTransaction: (txn, options) =>
      wallet.signAndSendTransaction(txn as any, options),
  }
}

export function initialize(turnkeyHD: ISolana): void {
  registerWallet(new TurnkeyHDWallet(adaptToTurnkeyHD(turnkeyHD)))
}
