import type { Transaction } from '@solana/kit'
import {
  address,
  getTransactionDecoder,
  getTransactionEncoder,
} from '@solana/kit'
import type { SolanaSignTransactionFeature } from '@solana/wallet-standard-features'
import type { Wallet, WalletAccount } from '@wallet-standard/base'

/**
 * Signs transactions using the Wallet Standard protocol
 *
 * @param transactions - Array of transactions to sign
 * @param walletAccount - The wallet account to sign with
 * @param wallet - The wallet instance
 * @returns Signed transactions
 *
 * @example
 * ```typescript
 * const signed = await signTransactions(
 *   [transaction],
 *   account,
 *   wallet
 * )
 * ```
 */
export async function signTransactions<T extends Transaction>(
  transactions: readonly T[],
  walletAccount: WalletAccount,
  wallet: Wallet
): Promise<readonly T[]> {
  const signTransactionFeature = wallet.features['solana:signTransaction'] as
    | SolanaSignTransactionFeature['solana:signTransaction']
    | undefined

  if (!signTransactionFeature) {
    throw new Error(
      `Wallet ${wallet.name} does not support transaction signing`
    )
  }

  const signedTransactions = []

  for (const transaction of transactions) {
    // Encode transaction
    const serializedTransaction = new Uint8Array(
      getTransactionEncoder().encode(transaction)
    )

    // Sign the transaction
    const walletResults = await signTransactionFeature.signTransaction({
      account: walletAccount,
      transaction: serializedTransaction,
    })

    // Validate wallet response
    const walletResult = walletResults[0]
    if (!walletResult?.signedTransaction) {
      throw new Error('Wallet returned invalid signing result')
    }

    // Decode the signed transaction
    const decodedTransaction = getTransactionDecoder().decode(
      walletResult.signedTransaction
    )

    // The wallet may have modified the transaction, so we use the decoded message bytes
    signedTransactions.push({
      ...transaction,
      messageBytes: decodedTransaction.messageBytes,
      signatures: decodedTransaction.signatures,
    } as T)
  }

  return signedTransactions
}

/**
 * Creates a signer object for a wallet account
 * Returns an object with address and signing function
 *
 * @param walletAccount - The wallet account to create signer for
 * @param wallet - The wallet instance
 * @returns Signer object with address and modifyAndSignTransactions method
 *
 * @example
 * ```typescript
 * const signer = createWalletSigner(account, wallet)
 * console.log(signer.address) // The account address
 * const signed = await signer.modifyAndSignTransactions([transaction])
 * ```
 */
export function createWalletSigner(
  walletAccount: WalletAccount,
  wallet: Wallet
) {
  const signerAddress = address(walletAccount.address)

  return {
    address: signerAddress,
    modifyAndSignTransactions: async <T extends Transaction>(
      transactions: readonly T[]
    ): Promise<readonly T[]> => {
      return signTransactions(transactions, walletAccount, wallet)
    },
  }
}

/**
 * Type definition for wallet signer object
 */
export type WalletSigner = ReturnType<typeof createWalletSigner>
