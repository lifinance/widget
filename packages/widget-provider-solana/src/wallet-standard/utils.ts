import { getWallets } from '@wallet-standard/app'
import type { Wallet, WalletAccount } from '@wallet-standard/base'
import type { AccountInfo, WalletInfo } from './types.js'

export const isSolanaWallet = (wallet: Wallet): boolean =>
  wallet.chains?.some((c) => c.includes('solana')) ?? false

export const hasFeature = (wallet: Wallet, feature: string): boolean =>
  feature in wallet.features

export const toAccountInfo = (account: WalletAccount): AccountInfo => ({
  address: account.address,
  icon: account.icon,
  raw: account,
})

export const mergeAccounts = (
  ...sources: (readonly WalletAccount[])[]
): AccountInfo[] => {
  const map = new Map<string, WalletAccount>()
  for (const account of sources.flat()) {
    map.set(account.address, account)
  }
  return Array.from(map.values()).map(toAccountInfo)
}

export const toWalletInfo = (wallet: Wallet): WalletInfo => ({
  wallet,
  name: wallet.name,
  icon: wallet.icon,
  installed: true,
  connectable:
    isSolanaWallet(wallet) &&
    hasFeature(wallet, 'standard:connect') &&
    hasFeature(wallet, 'standard:disconnect'),
})

export const discoverSolanaWallets = (): WalletInfo[] => {
  if (typeof window === 'undefined') {
    return []
  }
  const seen = new Set<string>()
  return getWallets()
    .get()
    .filter((w) => isSolanaWallet(w) && !seen.has(w.name) && seen.add(w.name))
    .map(toWalletInfo)
}
