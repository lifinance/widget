import type * as LifiSdk from '@lifi/sdk'
import type { Route, RoutesRequest, SDKClient } from '@lifi/sdk'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  getRoutes: vi.fn(),
}))

vi.mock('@lifi/sdk', async (importOriginal) => ({
  ...(await importOriginal<typeof LifiSdk>()),
  getRoutes: mocks.getRoutes,
}))

import { getGaslessRoute } from './getGaslessRoute.js'

const client = {} as SDKClient
const signal = new AbortController().signal

const request: RoutesRequest = {
  fromAddress: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
  fromAmount: '50000000',
  fromChainId: 42161,
  fromTokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  toChainId: 42161,
  toTokenAddress: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  options: {
    order: 'CHEAPEST',
    slippage: 0.005,
    bridges: { deny: ['across'] },
    executionType: 'all',
  },
}

const route = (id: string): Route =>
  ({
    id,
    steps: [
      {
        estimate: {
          feeCosts: [{ name: 'LIFI Gasless Relay Fee', included: true }],
        },
      },
    ],
  }) as unknown as Route

const routeWithoutRelayFee = (id: string): Route =>
  ({ id, steps: [{ estimate: { feeCosts: [] } }] }) as unknown as Route

describe('getGaslessRoute', () => {
  beforeEach(() => {
    mocks.getRoutes.mockReset()
  })

  it('requests gasless routes with the options of the main request', async () => {
    mocks.getRoutes.mockResolvedValue({ routes: [] })

    await getGaslessRoute(client, request, signal)

    expect(mocks.getRoutes).toHaveBeenCalledWith(
      client,
      {
        ...request,
        options: {
          order: 'CHEAPEST',
          slippage: 0.005,
          bridges: { deny: ['across'] },
          gasless: true,
        },
      },
      { signal }
    )
  })

  it('sends no executionType, which the backend rejects with gasless, also when the SDK config sets one', async () => {
    // `getRoutes` puts `client.config.routeOptions` under the request options
    // and posts them as JSON, as the SDK does.
    let body: RoutesRequest | undefined
    mocks.getRoutes.mockImplementation(
      async (sdkClient: SDKClient, params: RoutesRequest) => {
        body = JSON.parse(
          JSON.stringify({
            ...params,
            options: {
              ...sdkClient.config.routeOptions,
              ...params.options,
            },
          })
        )
        return { routes: [] }
      }
    )
    const configuredClient = {
      config: { routeOptions: { executionType: 'all' } },
    } as unknown as SDKClient

    await getGaslessRoute(configuredClient, request, signal)

    expect(body?.options).not.toHaveProperty('executionType')
    expect(body?.options).toHaveProperty('gasless', true)
  })

  it('returns the first gasless route', async () => {
    mocks.getRoutes.mockResolvedValue({ routes: [route('a'), route('b')] })

    await expect(getGaslessRoute(client, request, signal)).resolves.toEqual(
      route('a')
    )
  })

  it('drops the ranking tags of the gasless-only answer', async () => {
    mocks.getRoutes.mockResolvedValue({
      routes: [{ ...route('a'), tags: ['CHEAPEST', 'FASTEST'] }],
    })

    const gaslessRoute = await getGaslessRoute(client, request, signal)

    expect(gaslessRoute).not.toHaveProperty('tags')
  })

  it('skips a route without the relay fee', async () => {
    mocks.getRoutes.mockResolvedValue({
      routes: [routeWithoutRelayFee('a'), route('b')],
    })

    await expect(getGaslessRoute(client, request, signal)).resolves.toEqual(
      route('b')
    )
  })

  it('returns null when the account cannot use gasless', async () => {
    mocks.getRoutes.mockResolvedValue({ routes: [] })

    await expect(getGaslessRoute(client, request, signal)).resolves.toBeNull()
  })

  it('returns null when the request fails', async () => {
    mocks.getRoutes.mockRejectedValue(new Error('network'))

    await expect(getGaslessRoute(client, request, signal)).resolves.toBeNull()
  })
})
