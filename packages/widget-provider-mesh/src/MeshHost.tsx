'use client'
import {
  type CexSessionRequest,
  type CexSessionResponse,
  MeshContext,
  type OnRampError,
  type OnRampFailure,
  type OnRampHostWidgetConfig,
  type OnRampOpenArgs,
  type OnRampSession,
  postCheckoutSession,
  useCheckoutConfig,
  useCheckoutUserId,
} from '@lifi/widget-provider/checkout'
import type {
  LinkEventType,
  LinkPayload,
  TransferFinishedPayload,
} from '@meshconnect/web-link-sdk'
import { createLink } from '@meshconnect/web-link-sdk'
import {
  type FC,
  type PropsWithChildren,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'

export type MeshHostProps = PropsWithChildren<{
  widgetConfig: OnRampHostWidgetConfig
}>

/**
 * Logic-only host: holds Mesh session state, runs the Mesh link SDK (which
 * provides its own overlay UI), and publishes the session via `MeshContext`.
 * `mountTargetId` is `null` because Mesh manages its own modal — no hosted
 * `<div>` from the widget is required.
 */
export const MeshHost: FC<MeshHostProps> = ({ children, widgetConfig }) => {
  const checkoutUserId = useCheckoutUserId()
  const { integrator, onError, onSuccess, onrampSessionApiUrl } =
    useCheckoutConfig()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<OnRampError | null>(null)
  const [failure, setFailure] = useState<OnRampFailure | null>(null)
  const [depositTxHash, setDepositTxHash] = useState<string | null>(null)
  // Track in-Mesh errors as they stream through onEvent so we can classify
  // the terminal close from onExit. Refs (not state) because Mesh's callbacks
  // capture the value at link-creation time.
  const lastEventErrorRef = useRef<{
    kind: 'connection' | 'withdrawal'
    message: string
  } | null>(null)
  const transferSucceededRef = useRef(false)

  const lastOpenArgsRef = useRef<OnRampOpenArgs | null>(null)

  const close = useCallback(() => {
    setIsOpen(false)
    setIsLoading(false)
    setError(null)
  }, [])

  const acknowledgeDepositTxHash = useCallback(() => {
    setDepositTxHash(null)
  }, [])

  const openDepositFlow = useCallback(
    async (args: OnRampOpenArgs) => {
      lastOpenArgsRef.current = args
      setError(null)
      setFailure(null)
      setDepositTxHash(null)
      lastEventErrorRef.current = null
      transferSucceededRef.current = false
      setIsLoading(true)

      const apiUrl = onrampSessionApiUrl?.replace(/\/$/, '')
      const apiKey = widgetConfig.apiKey?.trim()
      if (!apiUrl) {
        setError({ code: 'MISSING_API_URL' })
        onError?.({
          code: 'MISSING_API_URL',
          message: 'CEX deposit is not configured: set onrampSessionApiUrl.',
          provider: 'mesh',
        })
        setIsLoading(false)
        return
      }
      if (!apiKey) {
        setError({ code: 'MISSING_API_KEY' })
        onError?.({
          code: 'MISSING_API_KEY',
          message:
            'CEX deposit is not configured: set widget apiKey to call checkout sessions.',
          provider: 'mesh',
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
            'CEX deposit target is not configured: set widget.toChain and widget.toToken.',
          provider: 'mesh',
        })
        setIsLoading(false)
        return
      }

      const body: CexSessionRequest = {
        walletAddress: args.depositAddress,
        tokenAddress,
        chainId,
        userId: checkoutUserId,
        integrator,
        amount: args.amount,
      }

      try {
        const res = await postCheckoutSession<
          CexSessionRequest,
          CexSessionResponse
        >({
          baseUrl: apiUrl,
          integrator,
          endpointPath: '/v1/checkout/cex/session',
          apiKey,
          body,
        })
        if (!res.ok) {
          const errObj = res.apiError
          if (errObj?.error) {
            setError({ message: errObj.error })
            onError?.({
              code: errObj.code ?? 'CEX_SESSION_FAILED',
              message: errObj.error,
              provider: 'mesh',
            })
          } else {
            setError({
              code: 'SESSION_HTTP',
              params: { status: res.status },
            })
            onError?.({
              code: 'CEX_SESSION_FAILED',
              message: `Could not start Mesh session (${res.status}). Try again later.`,
              provider: 'mesh',
            })
          }
          setIsLoading(false)
          return
        }

        if (!res.data.linkToken) {
          setError({ code: 'INVALID_RESPONSE' })
          onError?.({
            code: 'ONRAMP_INVALID_RESPONSE',
            message: 'Invalid response from onramp server (missing linkToken).',
            provider: 'mesh',
          })
          setIsLoading(false)
          return
        }

        const link = createLink({
          onIntegrationConnected: (_payload: LinkPayload) => {
            // Exchange account linked — no action needed for transfer flow
          },
          onTransferFinished: (payload: TransferFinishedPayload) => {
            transferSucceededRef.current = true
            // Mesh's `txId` is an internal identifier that won't resolve via
            // LI.FI's status endpoint — only forward a real on-chain hash.
            const onChainHash = payload.txHash?.trim()
            if (onChainHash) {
              setDepositTxHash(onChainHash)
            }
            if (onSuccess) {
              onSuccess({
                provider: 'mesh',
                transactionHash: onChainHash ?? payload.txId,
                amount: String(payload.amount),
                token: payload.symbol,
                chainId: Number(widgetConfig.toChain ?? 0),
              })
            }
            // Leave the modal-state alone here; onExit fires next and is the
            // single terminal cleanup point.
          },
          onEvent: (event: LinkEventType) => {
            switch (event.type) {
              case 'transferExecutionError':
                lastEventErrorRef.current = {
                  kind: 'withdrawal',
                  message: event.payload.errorMessage,
                }
                break
              case 'integrationConnectionError':
                lastEventErrorRef.current = {
                  kind: 'connection',
                  message: event.payload.errorMessage,
                }
                break
              default:
                break
            }
          },
          onExit: (exitError?: string) => {
            // Reset transient open/loading flags but keep failure/depositTxHash
            // so the consumer can render the post-Mesh state.
            setIsOpen(false)
            setIsLoading(false)

            if (transferSucceededRef.current) {
              return
            }

            const tracked = lastEventErrorRef.current
            if (tracked) {
              setFailure({
                kind: tracked.kind,
                message: tracked.message || undefined,
                reportCode:
                  tracked.kind === 'withdrawal'
                    ? 'MESH_WITHDRAWAL_FAILED'
                    : 'MESH_CONNECTION_FAILED',
                retry: () => {
                  setFailure(null)
                  if (lastOpenArgsRef.current) {
                    void openDepositFlow(lastOpenArgsRef.current)
                  }
                },
              })
              onError?.({
                code:
                  tracked.kind === 'withdrawal'
                    ? 'MESH_WITHDRAWAL_FAILED'
                    : 'MESH_CONNECTION_FAILED',
                message: tracked.message,
                provider: 'mesh',
              })
              return
            }

            if (exitError) {
              setFailure({
                kind: 'connection',
                message: exitError,
                reportCode: 'MESH_EXIT_ERROR',
                retry: () => {
                  setFailure(null)
                  if (lastOpenArgsRef.current) {
                    void openDepositFlow(lastOpenArgsRef.current)
                  }
                },
              })
              onError?.({
                code: 'MESH_EXIT_ERROR',
                message: exitError,
                provider: 'mesh',
              })
            }
          },
        })

        setIsLoading(false)
        setIsOpen(true)
        link.openLink(res.data.linkToken)
      } catch (e) {
        const message =
          e instanceof Error
            ? e.message
            : 'Network error starting Mesh session.'
        setError(
          e instanceof Error
            ? { message: e.message }
            : { code: 'NETWORK_ERROR' }
        )
        onError?.({ code: 'ONRAMP_NETWORK_ERROR', message, provider: 'mesh' })
        setIsLoading(false)
      }
    },
    [
      checkoutUserId,
      integrator,
      onError,
      onSuccess,
      onrampSessionApiUrl,
      widgetConfig.apiKey,
      widgetConfig.toChain,
      widgetConfig.toToken,
    ]
  )

  const session = useMemo<OnRampSession>(
    () => ({
      open: openDepositFlow,
      close,
      isOpen,
      isLoading,
      error,
      failure,
      depositTxHash,
      acknowledgeDepositTxHash,
      mountTargetId: null,
    }),
    [
      acknowledgeDepositTxHash,
      close,
      depositTxHash,
      error,
      failure,
      isLoading,
      isOpen,
      openDepositFlow,
    ]
  )

  return <MeshContext.Provider value={session}>{children}</MeshContext.Provider>
}
