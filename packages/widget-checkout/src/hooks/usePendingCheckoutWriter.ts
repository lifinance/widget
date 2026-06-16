'use client'
import { useCheckoutConfig } from '@lifi/widget-provider/checkout'
import { useCallback, useContext } from 'react'
import { CheckoutFlowStoreContext } from '../stores/useCheckoutFlowStore.js'
import {
  buildPendingRecord,
  buildResumeKey,
  type PendingProvider,
  type PersistedFrozenQuote,
  usePendingCheckoutStore,
} from '../stores/usePendingCheckoutStore.js'
import type { SourceTxIdentifier } from '../utils/getSourceTxIdentifier.js'

interface WalletWriteArgs {
  identifier: SourceTxIdentifier
  fromChain: number
  depositAddress?: string
  // Resume reads cross-chain status hints from this route and uses it to
  // re-attach the in-flight route, so a wallet record must always carry it.
  frozenQuote: PersistedFrozenQuote
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
  markFailed: (key: string) => void
  clearForKey: (key: string | null) => void
  clearAll: () => void
}

// Display fields, lifted off the frozen route so the activity card renders
// without re-fetching or relying on a (possibly expired) quote.
function displayFields(frozenQuote?: PersistedFrozenQuote) {
  const route = frozenQuote?.route
  if (!route) {
    return {}
  }
  return {
    fromAmount: route.fromAmount,
    tokenSymbol: route.fromToken.symbol,
    tokenDecimals: route.fromToken.decimals,
    tokenLogoURI: route.fromToken.logoURI,
  }
}

export function usePendingCheckoutWriter(): PendingCheckoutWriter {
  const { integrator, resumePending } = useCheckoutConfig()
  const flowStore = useContext(CheckoutFlowStoreContext)
  const write = usePendingCheckoutStore((s) => s.write)
  const markFailed = usePendingCheckoutStore((s) => s.markFailed)
  const clearForKey = usePendingCheckoutStore((s) => s.clearForKey)
  const clearAll = usePendingCheckoutStore((s) => s.clearAll)
  const enabled = resumePending !== false

  // The deposit id is frozen on the first write of a deposit and reused by every
  // later write of the same deposit, so its record key stays stable (no collisions,
  // no duplicate cards). Reset on a new flow via CheckoutFlowStore.reset().
  const resolveDepositId = useCallback(
    (preferred: string): string => {
      const state = flowStore?.getState()
      if (state?.frozenDepositId) {
        return state.frozenDepositId
      }
      state?.setFrozenDepositId(preferred)
      return preferred
    },
    [flowStore]
  )

  const writeWallet = useCallback(
    ({
      identifier,
      fromChain,
      depositAddress,
      frozenQuote,
    }: WalletWriteArgs) => {
      if (!enabled) {
        return
      }
      const transactionHash =
        identifier.kind === 'txHash' ? identifier.value : undefined
      const taskId = identifier.kind === 'taskId' ? identifier.value : undefined
      const depositId = resolveDepositId(depositAddress ?? identifier.value)
      write(
        buildResumeKey(integrator, depositId),
        buildPendingRecord({
          depositId,
          fundingSource: 'wallet',
          transactionHash,
          taskId,
          fromChain,
          depositAddress,
          // Route id resume uses to re-attach the in-flight route.
          frozenRouteId: frozenQuote.id,
          frozenQuote,
          ...displayFields(frozenQuote),
          status: 'pending',
        })
      )
    },
    [enabled, integrator, resolveDepositId, write]
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
      const depositId = resolveDepositId(depositAddress)
      write(
        buildResumeKey(integrator, depositId),
        buildPendingRecord({
          depositId,
          fundingSource: 'transfer',
          depositAddress,
          fromChain,
          frozenRouteId,
          frozenQuote,
          ...displayFields(frozenQuote),
          status: 'pending',
        })
      )
    },
    [enabled, integrator, resolveDepositId, write]
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
      const depositId = resolveDepositId(depositAddress)
      write(
        buildResumeKey(integrator, depositId),
        buildPendingRecord({
          depositId,
          fundingSource,
          depositAddress,
          fromChain,
          provider,
          frozenQuote,
          ...displayFields(frozenQuote),
          status: 'confirmed-no-hash',
        })
      )
    },
    [enabled, integrator, resolveDepositId, write]
  )

  return {
    writeWallet,
    writeTransfer,
    writeCashSuccess,
    markFailed,
    clearForKey,
    clearAll,
  }
}
