'use client'
import {
  type OnRampError,
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
  const { integrator, onError, onSuccess, onrampSessionApiUrl } =
    useCheckoutConfig()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<OnRampError | null>(null)
  const [widgetUrl, setWidgetUrl] = useState<string | null>(null)
  const mountTargetId = useId()

  const onSuccessRef = useRef(onSuccess)
  useEffect(() => {
    onSuccessRef.current = onSuccess
  }, [onSuccess])

  const widgetTargetRef = useRef({
    toToken: widgetConfig.toToken,
    toChain: widgetConfig.toChain,
  })
  useEffect(() => {
    widgetTargetRef.current = {
      toToken: widgetConfig.toToken,
      toChain: widgetConfig.toChain,
    }
  }, [widgetConfig.toToken, widgetConfig.toChain])

  const close = useCallback(() => {
    setOpen(false)
    setIsLoading(false)
    setError(null)
    setWidgetUrl(null)
  }, [])

  const openDepositFlow = useCallback(
    async (args: OnRampOpenArgs) => {
      setOpen(true)
      setError(null)
      setWidgetUrl(null)
      setIsLoading(true)

      const base = onrampSessionApiUrl?.replace(/\/$/, '')
      if (!base) {
        setError({ code: 'MISSING_API_URL' })
        onError?.({
          code: 'MISSING_ONRAMP_API',
          message:
            'Cash deposit is not configured: set onrampSessionApiUrl on the checkout.',
          provider: 'transak',
        })
        setIsLoading(false)
        return
      }

      const chainId = widgetConfig.toChain
      const tokenAddress = widgetConfig.toToken
      if (chainId === undefined || !tokenAddress) {
        setError({ code: 'TARGET_NOT_CONFIGURED' })
        onError?.({
          code: 'ONRAMP_TARGET_NOT_CONFIGURED',
          message:
            'Cash deposit target is not configured: set widget.toChain and widget.toToken.',
          provider: 'transak',
        })
        setIsLoading(false)
        return
      }

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
          baseUrl: base,
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
            baseUrl: base,
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
    [
      integrator,
      onError,
      onrampSessionApiUrl,
      widgetConfig.toChain,
      widgetConfig.toToken,
      widgetConfig.apiKey,
    ]
  )

  // SDK lifecycle: init when the modal is open and we have a widgetUrl;
  // tear down on cleanup. The widget must render `<div id={mountTargetId}>`
  // inside its modal so Transak can portal its iframe into it.
  useEffect(() => {
    if (!open || !widgetUrl || isLoading) {
      return
    }

    const transak = new Transak({
      widgetUrl,
      containerId: mountTargetId,
      widgetWidth: '100%',
      widgetHeight: '100%',
    })

    // Transak emits `TRANSAK_ORDER_SUCCESSFUL` and `TRANSAK_WIDGET_CLOSE` in
    // quick succession on success, and its handlers live on a module-level
    // singleton emitter. This per-run flag guarantees `onSuccess` fires at
    // most once and prevents stale closures from running between an SDK emit
    // and effect cleanup.
    const runState = { active: true }

    const onWidgetClose = () => {
      if (!runState.active) {
        return
      }
      runState.active = false
      close()
    }

    const onOrderSuccessful = (data: unknown) => {
      if (!runState.active) {
        return
      }
      runState.active = false
      const onSuccessCb = onSuccessRef.current
      if (onSuccessCb) {
        const order =
          data != null &&
          typeof data === 'object' &&
          'status' in data &&
          data.status != null &&
          typeof data.status === 'object'
            ? (data.status as Record<string, unknown>)
            : {}
        const { toToken, toChain } = widgetTargetRef.current
        onSuccessCb({
          provider: 'transak',
          transactionHash:
            typeof order.transactionHash === 'string'
              ? order.transactionHash
              : undefined,
          amount: String(order.cryptoAmount ?? order.fiatAmount ?? ''),
          token: String(order.cryptoCurrency ?? toToken ?? ''),
          chainId: Number(order.chainId ?? order.networkId ?? toChain ?? 0),
        })
      }
      close()
    }

    Transak.on(Transak.EVENTS.TRANSAK_WIDGET_CLOSE, onWidgetClose)
    Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, onOrderSuccessful)

    transak.init()

    return () => {
      runState.active = false
      transak.cleanup()
    }
  }, [close, isLoading, open, mountTargetId, widgetUrl])

  const session = useMemo<OnRampSession>(
    () => ({
      open: openDepositFlow,
      close,
      isOpen: open,
      isLoading,
      error,
      failure: null,
      depositTxHash: null,
      acknowledgeDepositTxHash: () => {},
      mountTargetId,
    }),
    [close, error, isLoading, mountTargetId, open, openDepositFlow]
  )

  useRegisterOnRampSession('transak', session)
  return null
}
