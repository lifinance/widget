'use client'
import { useAccount } from '@lifi/wallet-management'
import { useCheckoutConfig } from '@lifi/widget-provider/checkout'
import { useCallback } from 'react'
import {
  buildPendingRecord,
  buildResumeKey,
  type PendingProvider,
  type PersistedFrozenQuote,
  usePendingCheckoutStore,
} from '../stores/usePendingCheckoutStore.js'

interface WalletWriteArgs {
  transactionHash: string
  fromChain: number
  depositAddress?: string
  frozenQuote?: PersistedFrozenQuote
}

interface TransferWriteArgs {
  depositAddress: string
  fromChain: number
  frozenRouteId: string
  frozenQuote: PersistedFrozenQuote
}

interface CashSuccessWriteArgs {
  depositAddress: string
  fromChain: number
  provider: PendingProvider
  fundingSource: 'cash' | 'exchange'
  frozenQuote?: PersistedFrozenQuote
}

export interface PendingCheckoutWriter {
  writeWallet: (args: WalletWriteArgs) => void
  writeTransfer: (args: TransferWriteArgs) => void
  writeCashSuccess: (args: CashSuccessWriteArgs) => void
  clearForKey: (key: string | null) => void
  clearAll: () => void
}

export function usePendingCheckoutWriter(): PendingCheckoutWriter {
  const { integrator, resumePending } = useCheckoutConfig()
  const { accounts } = useAccount()
  const write = usePendingCheckoutStore((s) => s.write)
  const clearForKey = usePendingCheckoutStore((s) => s.clearForKey)
  const clearAll = usePendingCheckoutStore((s) => s.clearAll)
  const enabled = resumePending !== false

  const walletAddress = accounts.find(
    (a) => a.isConnected && a.address
  )?.address

  const writeWallet = useCallback(
    ({
      transactionHash,
      fromChain,
      depositAddress,
      frozenQuote,
    }: WalletWriteArgs) => {
      if (!enabled) {
        return
      }
      if (!walletAddress) {
        return
      }
      const key = buildResumeKey(integrator, walletAddress)
      write(
        key,
        buildPendingRecord({
          fundingSource: 'wallet',
          transactionHash,
          fromChain,
          depositAddress,
          frozenQuote,
          status: 'pending',
        })
      )
    },
    [enabled, integrator, walletAddress, write]
  )

  const writeTransfer = useCallback(
    ({
      depositAddress,
      fromChain,
      frozenRouteId,
      frozenQuote,
    }: TransferWriteArgs) => {
      if (!enabled) {
        return
      }
      const identifier = walletAddress ?? depositAddress
      const key = buildResumeKey(integrator, identifier)
      write(
        key,
        buildPendingRecord({
          fundingSource: 'transfer',
          depositAddress,
          fromChain,
          frozenRouteId,
          frozenQuote,
          status: 'pending',
        })
      )
    },
    [enabled, integrator, walletAddress, write]
  )

  const writeCashSuccess = useCallback(
    ({
      depositAddress,
      fromChain,
      provider,
      fundingSource,
      frozenQuote,
    }: CashSuccessWriteArgs) => {
      if (!enabled) {
        return
      }
      const identifier = walletAddress ?? depositAddress
      const key = buildResumeKey(integrator, identifier)
      write(
        key,
        buildPendingRecord({
          fundingSource,
          depositAddress,
          fromChain,
          provider,
          frozenQuote,
          status: 'confirmed-no-hash',
        })
      )
    },
    [enabled, integrator, walletAddress, write]
  )

  return {
    writeWallet,
    writeTransfer,
    writeCashSuccess,
    clearForKey,
    clearAll,
  }
}
