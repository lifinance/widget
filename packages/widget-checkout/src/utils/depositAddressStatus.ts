import type { SDKClient, StatusResponse } from '@lifi/sdk'

export function getReceivingTxHash(
  status: StatusResponse | undefined | null
): string | undefined {
  if (!status || !('receiving' in status)) {
    return undefined
  }
  const receiving = status.receiving
  if (receiving && 'txHash' in receiving && receiving.txHash) {
    return receiving.txHash
  }
  return undefined
}

export interface GetDepositAddressStatusArgs {
  sdkClient: SDKClient
  depositAddress: string
  fromChain: number
  signal?: AbortSignal
}

/**
 * Polls `GET /v1/status?depositAddress=…&fromChain=…` (CORE-206). The SDK's
 * `getStatus` validates that `txHash` or `taskId` is present, so we go around
 * it with a direct fetch. Auth headers mirror the SDK's `request` util.
 */
export async function getDepositAddressStatus({
  sdkClient,
  depositAddress,
  fromChain,
  signal,
}: GetDepositAddressStatusArgs): Promise<StatusResponse> {
  const { apiUrl, apiKey, integrator } = sdkClient.config
  const params = new URLSearchParams({
    depositAddress,
    fromChain: String(fromChain),
  })
  const res = await fetch(`${apiUrl}/status?${params}`, {
    method: 'GET',
    headers: {
      ...(apiKey ? { 'x-lifi-api-key': apiKey } : {}),
      'x-lifi-integrator': integrator,
    },
    signal,
  })
  if (!res.ok) {
    throw new Error(
      `Deposit-address status request failed: ${res.status} ${res.statusText}`
    )
  }
  return (await res.json()) as StatusResponse
}
