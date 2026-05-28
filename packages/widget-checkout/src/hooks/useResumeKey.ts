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
    if (wallet) {
      return `${integrator}:${wallet}`
    }
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
      if (!record.depositAddress) {
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
  if (!key) {
    return null
  }
  const record = records[key]
  if (!record || record.expiresAt <= Date.now()) {
    return null
  }
  return record
}
