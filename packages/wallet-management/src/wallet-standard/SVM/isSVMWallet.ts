import type { UiWallet } from '@wallet-standard/react'

const SolanaSignAndSendTransaction = 'solana:signAndSendTransaction'
const SolanaSignTransaction = 'solana:signTransaction'

export function isSWMWallet(wallet: UiWallet) {
  return (
    SolanaSignAndSendTransaction in wallet.features &&
    SolanaSignTransaction in wallet.features
  )
}
