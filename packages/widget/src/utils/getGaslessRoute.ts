import type { Route, RoutesRequest, SDKClient } from '@lifi/sdk'
import { getRoutes } from '@lifi/sdk'

export const getGaslessRoute = async (
  client: SDKClient,
  request: RoutesRequest,
  signal?: AbortSignal
): Promise<Route | null> => {
  // The backend rejects gasless with executionType 'all' or 'message'.
  const { executionType: _executionType, ...options } = request.options ?? {}
  try {
    const { routes } = await getRoutes(
      client,
      { ...request, options: { ...options, gasless: true } },
      { signal }
    )
    return routes[0] ?? null
  } catch {
    return null
  }
}
