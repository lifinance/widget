'use client'
import {
  type OnRampError,
  type OnRampFailure,
  type OnRampHostWidgetConfig,
  type OnRampOpenArgs,
  type OnRampSession,
  type OnrampSessionRequest,
  type OnrampSessionResponse,
  postCheckoutSession,
  useCheckoutConfig,
  useRegisterOnRampSession,
} from '@lifi/widget-provider/checkout'
import { Transak } from '@transak/ui-js-sdk'
import {
  type FC,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'

// TODO(cleanup-remove-transak-native-eth-retry-hack): Remove this forced ETH fallback token
// and replace with explicit provider capability/config-driven behavior.
const NATIVE_EVM_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000'
const TRANSAK_FALLBACK_CHAIN_IDS = [1]
const TRANSAK_RETRYABLE_STATUS_CODES = [500, 502, 503, 504]

const debug = (event: string, payload?: unknown): void => {
  if (payload !== undefined) {
    console.warn(`[transak] ${event}`, payload)
  } else {
    console.warn(`[transak] ${event}`)
  }
}

export interface TransakHostProps {
  widgetConfig: OnRampHostWidgetConfig
}

/**
 * Logic-only host: holds Transak session state, runs the SDK against the
 * mount target the widget renders, and registers the session into the
 * widget's `OnRampSessionsContext`. No modal UI lives here — the widget
 * owns rendering the `<div id={session.mountTargetId}>` inside its own
 * Dialog.
 */
export const TransakHost: FC<TransakHostProps> = ({ widgetConfig }) => {
  const { integrator, onError, onSuccess, apiUrl } = useCheckoutConfig()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<OnRampError | null>(null)
  const [failure, setFailure] = useState<OnRampFailure | null>(null)
  const [widgetUrl, setWidgetUrl] = useState<string | null>(null)
  // `useId()` can return ids with colons (e.g. `:r0:`); Transak's SDK looks
  // the container up via `#${id}` selector and throws on those.
  const reactId = useId()
  const mountTargetId = useMemo(
    () => `transak-${reactId.replace(/:/g, '')}`,
    [reactId]
  )

  const onSuccessRef = useRef(onSuccess)
  useEffect(() => {
    onSuccessRef.current = onSuccess
  }, [onSuccess])

  const lastOpenArgsRef = useRef<OnRampOpenArgs | null>(null)

  const close = useCallback(() => {
    setOpen(false)
    setIsLoading(false)
    setError(null)
    setFailure(null)
    setWidgetUrl(null)
  }, [])

  const openDepositFlow = useCallback(
    async (args: OnRampOpenArgs) => {
      debug('openDepositFlow', args)
      lastOpenArgsRef.current = args
      setOpen(true)
      setError(null)
      setFailure(null)
      setWidgetUrl(null)
      setIsLoading(true)

      if (!apiUrl) {
        setError({ code: 'MISSING_API_URL' })
        onError?.({
          code: 'MISSING_API_URL',
          message:
            'Cash deposit is not configured: set sdkConfig.apiUrl on the checkout.',
          provider: 'transak',
        })
        setIsLoading(false)
        return
      }

      const chainId = args.fromChainId
      const tokenAddress = args.fromTokenAddress

      const apiKey = widgetConfig.apiKey?.trim()
      if (!apiKey) {
        setError({ code: 'MISSING_API_KEY' })
        onError?.({
          code: 'MISSING_API_KEY',
          message:
            'Cash deposit is not configured: set widget apiKey to call checkout sessions.',
          provider: 'transak',
        })
        setIsLoading(false)
        return
      }

      const body: OnrampSessionRequest = {
        walletAddress: args.depositAddress,
        tokenAddress,
        chainId,
        integrator,
        amount: args.amount,
        fiatCurrency: args.fiatCurrency,
      }

      const canRetryWithNativeEth =
        TRANSAK_FALLBACK_CHAIN_IDS.includes(chainId) &&
        tokenAddress.toLowerCase() !== NATIVE_EVM_TOKEN_ADDRESS.toLowerCase()

      try {
        let res = await postCheckoutSession<
          OnrampSessionRequest,
          OnrampSessionResponse
        >({
          baseUrl: apiUrl,
          endpointPath: '/v1/checkout/onramp/session',
          apiKey,
          integrator,
          body,
        })

        // TODO(cleanup-remove-transak-native-eth-retry-hack): Temporary retry
        // for develop instability. Replace with deterministic provider
        // capability handling.
        if (
          !res.ok &&
          TRANSAK_RETRYABLE_STATUS_CODES.includes(res.status) &&
          canRetryWithNativeEth
        ) {
          res = await postCheckoutSession<
            OnrampSessionRequest,
            OnrampSessionResponse
          >({
            baseUrl: apiUrl,
            endpointPath: '/v1/checkout/onramp/session',
            apiKey,
            integrator,
            body: {
              ...body,
              tokenAddress: NATIVE_EVM_TOKEN_ADDRESS,
            },
          })
        }

        if (!res.ok) {
          const errObj = res.apiError
          if (errObj?.error) {
            setError({ message: errObj.error })
            onError?.({
              code: errObj.code ?? 'ONRAMP_SESSION_FAILED',
              message: errObj.error,
              provider: 'transak',
            })
          } else {
            setError({
              code: 'SESSION_HTTP',
              params: { status: res.status },
            })
            onError?.({
              code: 'ONRAMP_SESSION_FAILED',
              message: `Could not start Transak session (${res.status}). Try again later.`,
              provider: 'transak',
            })
          }
          setIsLoading(false)
          return
        }

        if (!res.data.widgetUrl) {
          setError({ code: 'INVALID_RESPONSE' })
          onError?.({
            code: 'ONRAMP_INVALID_RESPONSE',
            message: 'Invalid response from onramp server (missing widgetUrl).',
            provider: 'transak',
          })
          setIsLoading(false)
          return
        }

        debug('session received', { widgetUrl: res.data.widgetUrl })
        setWidgetUrl(res.data.widgetUrl)
      } catch (e) {
        const message =
          e instanceof Error
            ? e.message
            : 'Network error starting Transak session.'
        setError(
          e instanceof Error
            ? { message: e.message }
            : { code: 'NETWORK_ERROR' }
        )
        onError?.({
          code: 'ONRAMP_NETWORK_ERROR',
          message,
          provider: 'transak',
        })
      } finally {
        setIsLoading(false)
      }
    },
    [apiUrl, integrator, onError, widgetConfig.apiKey]
  )

  useEffect(() => {
    if (!open || !widgetUrl || isLoading) {
      return
    }

    debug('sdk init', { mountTargetId })

    let transak: Transak
    try {
      transak = new Transak({
        widgetUrl,
        containerId: mountTargetId,
        widgetWidth: '100%',
        widgetHeight: '100%',
      })
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Transak SDK failed to initialise.'
      setError({ message })
      onError?.({
        code: 'ONRAMP_SDK_INIT_ERROR',
        message,
        provider: 'transak',
      })
      setOpen(false)
      setWidgetUrl(null)
      return
    }

    // `@transak/ui-js-sdk` v1.0.0 only has static `Transak.on`/no `Transak.off`,
    // and `cleanup()` clears all listeners on the shared emitter — fine for one
    // live host, not safe with concurrent Transak instances.
    const runState = { active: true, succeeded: false }

    const onOrderSuccessful = (data: unknown) => {
      debug('TRANSAK_ORDER_SUCCESSFUL', data)
      if (!runState.active) {
        debug('TRANSAK_ORDER_SUCCESSFUL ignored (already terminal)')
        return
      }
      runState.active = false
      runState.succeeded = true
      const order: Record<string, unknown> =
        data != null && typeof data === 'object'
          ? (data as Record<string, unknown>)
          : {}
      const lastArgs = lastOpenArgsRef.current
      const orderId = typeof order.id === 'string' ? order.id : undefined

      debug('order extracted', {
        orderId,
        status: order.status,
        cryptoAmount: order.cryptoAmount,
        cryptoCurrency: order.cryptoCurrency,
        chainId: order.chainId ?? order.networkId,
        walletAddress: order.walletAddress,
      })

      // Transak's SDK fires TRANSAK_ORDER_SUCCESSFUL at card-charge time
      // (status=PROCESSING) with no on-chain hash. The status page resolves
      // the real hash by polling /v1/status?depositAddress=…&fromChain=…
      onSuccessRef.current?.({
        provider: 'transak',
        transactionHash: undefined,
        amount: String(order.cryptoAmount ?? order.fiatAmount ?? ''),
        token: String(order.cryptoCurrency ?? lastArgs?.fromTokenAddress ?? ''),
        chainId: Number(
          order.chainId ?? order.networkId ?? lastArgs?.fromChainId ?? 0
        ),
      })

      debug('closing modal (preserving depositTxHash)')
      setOpen(false)
      setIsLoading(false)
      setError(null)
      setFailure(null)
      setWidgetUrl(null)
    }

    const onOrderCancelled = () => {
      debug('TRANSAK_ORDER_CANCELLED')
      if (!runState.active) {
        return
      }
      runState.active = false
      const retryArgs = lastOpenArgsRef.current
      setFailure({
        kind: 'cancelled',
        retry: retryArgs ? () => openDepositFlow(retryArgs) : close,
      })
      setOpen(false)
      setWidgetUrl(null)
    }

    const onOrderFailed = () => {
      debug('TRANSAK_ORDER_FAILED')
      if (!runState.active) {
        return
      }
      runState.active = false
      const retryArgs = lastOpenArgsRef.current
      setFailure({
        kind: 'withdrawal',
        retry: retryArgs ? () => openDepositFlow(retryArgs) : close,
      })
      setOpen(false)
      setWidgetUrl(null)
    }

    const onWidgetClose = () => {
      debug('TRANSAK_WIDGET_CLOSE', { succeeded: runState.succeeded })
      if (!runState.active) {
        return
      }
      runState.active = false
      // If no terminal event fired first, treat close as user cancellation.
      if (!runState.succeeded) {
        const retryArgs = lastOpenArgsRef.current
        setFailure({
          kind: 'cancelled',
          retry: retryArgs ? () => openDepositFlow(retryArgs) : close,
        })
        setOpen(false)
        setWidgetUrl(null)
      }
    }

    Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, onOrderSuccessful)
    Transak.on(Transak.EVENTS.TRANSAK_ORDER_CANCELLED, onOrderCancelled)
    Transak.on(Transak.EVENTS.TRANSAK_ORDER_FAILED, onOrderFailed)
    Transak.on(Transak.EVENTS.TRANSAK_WIDGET_CLOSE, onWidgetClose)

    try {
      transak.init()
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Transak SDK failed to mount.'
      runState.active = false
      transak.cleanup()
      setError({ message })
      onError?.({
        code: 'ONRAMP_SDK_INIT_ERROR',
        message,
        provider: 'transak',
      })
      setOpen(false)
      setWidgetUrl(null)
      return
    }

    return () => {
      runState.active = false
      transak.cleanup()
    }
  }, [
    close,
    isLoading,
    onError,
    open,
    mountTargetId,
    openDepositFlow,
    widgetUrl,
  ])

  const session = useMemo<OnRampSession>(
    () => ({
      open: openDepositFlow,
      close,
      isOpen: open,
      isLoading,
      error,
      failure,
      depositTxHash: null,
      acknowledgeDepositTxHash: () => {},
      mountTargetId,
    }),
    [close, error, failure, isLoading, mountTargetId, open, openDepositFlow]
  )

  useRegisterOnRampSession('transak', session)
  return null
}
