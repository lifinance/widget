'use client'
import { useAccount } from '@lifi/wallet-management'
import { useCheckoutConfig } from '@lifi/widget-provider/checkout'
import { useMemo } from 'react'
import {
  type PendingRecord,
  usePendingCheckoutStore,
} from '../stores/usePendingCheckoutStore.js'

export function useResumeKey(): string | null {
  const { integrator } = useCheckoutConfig()
  const { accounts } = useAccount()
  const records = usePendingCheckoutStore((s) => s.records)

  return useMemo(() => {
    const wallet = accounts.find((a) => a.isConnected && a.address)?.address
    const walletKey = wallet ? `${integrator}:${wallet}` : null
    const prefix = `${integrator}:`
    const now = Date.now()
    let bestKey: string | null = null
    let bestCreatedAt = -1
    for (const [key, record] of Object.entries(records)) {
      if (!key.startsWith(prefix)) {
        continue
      }
      if (record.expiresAt <= now) {
        continue
      }
      // Resumable when the record carries a deposit address (transfer/cash)
      // or it is the connected wallet's own record (wallet/relayer deposits
      // may be keyed by wallet with only a tx hash). Scanning unconditionally
      // keeps a deposit-keyed record visible after a wallet later connects,
      // instead of being hidden behind the wallet key.
      if (!record.depositAddress && key !== walletKey) {
        continue
      }
      if (record.createdAt > bestCreatedAt) {
        bestKey = key
        bestCreatedAt = record.createdAt
      }
    }
    return bestKey
  }, [integrator, accounts, records])
}

export function useResumeRecord(): PendingRecord | null {
  const key = useResumeKey()
  const records = usePendingCheckoutStore((s) => s.records)
  return useMemo(() => {
    if (!key) {
      return null
    }
    const record = records[key]
    if (!record || record.expiresAt <= Date.now()) {
      return null
    }
    return record
  }, [key, records])
}
