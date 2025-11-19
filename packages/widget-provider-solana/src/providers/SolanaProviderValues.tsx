import { ChainId, ChainType, isSVMAddress, Solana } from '@lifi/sdk'
import { SolanaContext } from '@lifi/widget-provider'
import { address } from '@solana/addresses'
import { fromVersionedTransaction } from '@solana/compat'
import { getTransactionCodec, type Transaction } from '@solana/transactions'
import {
  type SignerWalletAdapter,
  WalletReadyState,
} from '@solana/wallet-adapter-base'
import { useWallet, type Wallet } from '@solana/wallet-adapter-react'
import type { PublicKey } from '@solana/web3.js'
import { VersionedTransaction } from '@solana/web3.js'
import { type FC, type PropsWithChildren, useCallback, useMemo } from 'react'

interface SolanaProviderValuesProps {
  isExternalContext: boolean
}

export const SolanaProviderValues: FC<
  PropsWithChildren<SolanaProviderValuesProps>
> = ({ children, isExternalContext }) => {
  const {
    wallets,
    wallet: currentWallet,
    select: connect, // We use autoConnect on wallet selection
    disconnect,
    connected,
  } = useWallet()

  const account = currentWallet?.adapter.publicKey
    ? {
        address: currentWallet?.adapter.publicKey.toString(),
        chainId: ChainId.SOL,
        chainType: ChainType.SVM,
        connector: currentWallet?.adapter,
        isConnected: Boolean(currentWallet?.adapter.publicKey) && connected,
        isConnecting: false,
        isReconnecting: false,
        isDisconnected: !currentWallet,
        status: 'connected' as const,
      }
    : {
        chainType: ChainType.SVM,
        isConnected: false,
        isConnecting: false,
        isReconnecting: false,
        isDisconnected: true,
        status: 'disconnected' as const,
      }

  const installedWallets = useMemo(
    () =>
      wallets
        .filter(
          (wallet: Wallet) =>
            wallet.adapter.readyState === WalletReadyState.Installed ||
            wallet.adapter.readyState === WalletReadyState.Loadable
        )
        .map((wallet: Wallet) => wallet.adapter),
    [wallets]
  )

  const handleConnect = useCallback(
    async (
      connectorIdOrName: string,
      onSuccess?: (address: string, chainId: number) => void
    ) => {
      const adapter = wallets.find(
        (wallet) => wallet.adapter.name === connectorIdOrName
      )?.adapter
      if (adapter) {
        connect(adapter.name)
        adapter.once('connect', (publicKey: PublicKey) => {
          onSuccess?.(publicKey?.toString(), ChainId.SOL)
        })
      }
    },
    [connect, wallets]
  )

  return (
    <SolanaContext.Provider
      value={{
        isEnabled: true,
        account,
        sdkProvider: Solana({
          async getWallet() {
            if (!currentWallet?.adapter.publicKey) {
              throw new Error('Wallet not connected')
            }

            return {
              account: {
                address: address(currentWallet.adapter.publicKey.toString()),
                publicKey: currentWallet.adapter.publicKey.toBytes(),
              },
              async signTransaction(transaction: Transaction) {
                const transactionCodec = getTransactionCodec()
                const transactionBytes = transactionCodec.encode(transaction)

                const web3Transaction = VersionedTransaction.deserialize(
                  new Uint8Array(transactionBytes)
                )

                const signedWeb3Transaction = await (
                  currentWallet?.adapter as SignerWalletAdapter
                ).signTransaction(web3Transaction)

                return fromVersionedTransaction(signedWeb3Transaction)
              },
            }
          },
        }),
        installedWallets,
        isConnected: account.isConnected,
        connect: handleConnect,
        disconnect,
        isValidAddress: isSVMAddress,
        isExternalContext,
      }}
    >
      {children}
    </SolanaContext.Provider>
  )
}
