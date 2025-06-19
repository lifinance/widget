import { useWallets } from '@wallet-standard/react'
import { isSWMWallet } from '../isSVMWallet'

export const useSVMWallets = () => {
  const wallets = useWallets()

  return wallets.filter(isSWMWallet)
}
