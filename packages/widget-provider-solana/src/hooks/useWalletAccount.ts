import { useSolanaWalletStandard } from '../wallet-standard/useSolanaWalletStandard.js'
import type { AccountInfo } from '../wallet-standard/wallet-standard-client.js'

export interface UseWalletAccountReturn {
  /** Currently selected account address */
  address: string | null
  /** All available accounts from connected wallet */
  accounts: AccountInfo[]
  /** Currently selected account full info */
  account: AccountInfo | null
  /** Switch to a different account */
  selectAccount: (address: string) => Promise<void>
}

/**
 * Hook to access wallet account information
 *
 * @example
 * ```tsx
 * function AccountSelector() {
 *   const { address, accounts, selectAccount } = useWalletAccount()
 *
 *   if (!address) return null
 *
 *   return (
 *     <div>
 *       <p>Current: {address}</p>
 *       {accounts.length > 1 && (
 *         <select value={address} onChange={(e) => selectAccount(e.target.value)}>
 *           {accounts.map(acc => (
 *             <option key={acc.address} value={acc.address}>
 *               {acc.address.slice(0, 8)}...
 *             </option>
 *           ))}
 *         </select>
 *       )}
 *     </div>
 *   )
 * }
 * ```
 */
export function useWalletAccount(): UseWalletAccountReturn {
  const { accounts, selectAccount, selectedAccount } = useSolanaWalletStandard()

  return {
    address: selectedAccount,
    accounts,
    account: selectedAccount
      ? accounts.find((acc) => acc.address === selectedAccount) || null
      : null,
    selectAccount,
  }
}
