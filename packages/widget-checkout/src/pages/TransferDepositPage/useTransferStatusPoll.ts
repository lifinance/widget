import { useEffect } from 'react'

export interface UseTransferStatusPollArgs {
  depositAddress: string | null
  routeId: string | null
  enabled: boolean
}

/**
 * Stub: polls every 5 s. Replace the body with a real `/v1/status` call once
 * CORE-203 ships and the IF substatus contract is final.
 */
export function useTransferStatusPoll({
  depositAddress,
  routeId,
  enabled,
}: UseTransferStatusPollArgs): void {
  useEffect(() => {
    if (!enabled || !depositAddress || !routeId) {
      return
    }
    const id = setInterval(() => {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[checkout] mocked transfer status poll', {
          depositAddress,
          routeId,
        })
      }
    }, 5000)
    return () => clearInterval(id)
  }, [enabled, depositAddress, routeId])
}
