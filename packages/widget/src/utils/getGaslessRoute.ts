import type { Route, RoutesRequest, SDKClient } from '@lifi/sdk'
import { getRoutes, isGaslessStep } from '@lifi/sdk'

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
    const route = routes.find((route) => route.steps.some(isGaslessStep))
    if (!route) {
      return null
    }
    // Its tags rank it among gasless routes only, not among the main routes.
    const { tags: _tags, ...untaggedRoute } = route
    return untaggedRoute
  } catch {
    return null
  }
}
