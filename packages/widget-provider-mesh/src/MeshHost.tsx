'use client'
import {
  type CexSessionRequest,
  type CexSessionResponse,
  type ConnectedCexAccount,
  type ConnectedCexBrand,
  connectedCexKey,
  DEFAULT_CEX_ACCOUNT_TTL_MS,
  type OnRampError,
  type OnRampFailure,
  type OnRampHostWidgetConfig,
  type OnRampOpenArgs,
  type OnRampSession,
  postCheckoutSession,
  useCheckoutConfig,
  useCheckoutUserId,
  useConnectedCexStore,
  useRegisterOnRampSession,
} from '@lifi/widget-provider/checkout'
import type {
  IntegrationAccessToken,
  LinkEventType,
  LinkPayload,
  TransferFinishedPayload,
} from '@meshconnect/web-link-sdk'
import { createLink } from '@meshconnect/web-link-sdk'
import { type FC, useCallback, useMemo, useRef, useState } from 'react'

export interface MeshHostProps {
  widgetConfig: OnRampHostWidgetConfig
}

/**
 * Mesh Managed Tokens (MMT): store `tokenId` (stable per userId+brokerType,
 * refreshed server-side by Mesh) rather than the short-lived raw `accessToken`.
 * On reconnect, the `tokenId` is what goes in the SDK's `accessToken` field;
 * falls back to the raw token if `tokenId` is absent.
 *
 * Both logo variants are stored raw; the consumer picks one against the active
 * MUI color scheme at render time.
 */
function toConnectedAccounts(
  payload: LinkPayload,
  now: number
): ConnectedCexAccount[] {
  const at = payload.accessToken
  if (!at?.accountTokens?.length) {
    return []
  }
  const expiresAt =
    now +
    (at.expiresInSeconds
      ? at.expiresInSeconds * 1000
      : DEFAULT_CEX_ACCOUNT_TTL_MS)
  const info = at.brokerBrandInfo
  const brand: ConnectedCexBrand = {
    logoLight: info?.logoLightUrl ?? info?.iconLightUrl,
    logoDark: info?.logoDarkUrl ?? info?.iconDarkUrl,
  }
  return at.accountTokens.map((token) => ({
    accountId: token.account.accountId,
    accountName: token.account.accountName,
    accessToken: token.tokenId ?? token.accessToken,
    brokerType: at.brokerType,
    brokerName: at.brokerName,
    brand,
    connectedAt: now,
    expiresAt,
  }))
}

/**
 * Logic-only host: holds Mesh session state, runs the Mesh link SDK (which
 * provides its own overlay UI), and registers the session into the
 * widget's `OnRampSessionsContext`. `mountTargetId` is `null` because
 * Mesh manages its own modal — no hosted `<div>` from the widget is
 * required.
 */
export const MeshHost: FC<MeshHostProps> = ({ widgetConfig }) => {
  const checkoutUserId = useCheckoutUserId()
  const { integrator, onError, onSuccess, apiUrl } = useCheckoutConfig()
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

      const apiKey = widgetConfig.apiKey?.trim()
      if (!apiUrl) {
        setError({ code: 'MISSING_API_URL' })
        onError?.({
          code: 'MISSING_API_URL',
          message: 'CEX deposit is not configured: set sdkConfig.apiUrl.',
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

      const body: CexSessionRequest = {
        walletAddress: args.depositAddress,
        tokenAddress: args.fromTokenAddress,
        chainId: args.fromChainId,
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
          accessTokens: args.accessTokens?.length
            ? (args.accessTokens as IntegrationAccessToken[])
            : undefined,
          theme: widgetConfig.appearance ?? 'system',
          language: args.language,
          displayFiatCurrency: args.fiatCurrency,
          onIntegrationConnected: (payload: LinkPayload) => {
            // Persist the linked account(s) so the checkout can offer a
            // one-tap "reconnect" on a later visit (see useConnectedCexStore).
            const accounts = toConnectedAccounts(payload, Date.now())
            if (!accounts.length) {
              return
            }
            useConnectedCexStore
              .getState()
              .addConnectedAccounts(
                connectedCexKey(integrator, checkoutUserId),
                accounts
              )
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
                chainId: args.fromChainId,
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
                // Reconnect failed (likely a stale token) — drop the account so
                // the one-tap row disappears. If the user recovers in the same
                // session, onIntegrationConnected re-adds it.
                if (args.accessTokens?.length) {
                  const key = connectedCexKey(integrator, checkoutUserId)
                  const remove = useConnectedCexStore.getState().removeAccount
                  for (const token of args.accessTokens) {
                    remove(key, token.accountId)
                  }
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
              return
            }

            // No success, no tracked error, no exit error: the user dismissed
            // the modal before depositing. Surface a `cancelled` failure (not
            // an error) so the checkout returns to amount entry rather than
            // sitting on the watching screen. No `onError` — cancelling isn't
            // a failure to report.
            setFailure({
              kind: 'cancelled',
              retry: () => {
                setFailure(null)
                if (lastOpenArgsRef.current) {
                  void openDepositFlow(lastOpenArgsRef.current)
                }
              },
            })
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
      apiUrl,
      checkoutUserId,
      integrator,
      onError,
      onSuccess,
      widgetConfig.apiKey,
      widgetConfig.appearance,
    ]
  )

  const cancel = useCallback(() => {
    setIsOpen(false)
    setIsLoading(false)
    setFailure({
      kind: 'cancelled',
      retry: () => {
        setFailure(null)
        if (lastOpenArgsRef.current) {
          void openDepositFlow(lastOpenArgsRef.current)
        }
      },
    })
  }, [openDepositFlow])

  const session = useMemo<OnRampSession>(
    () => ({
      open: openDepositFlow,
      close,
      cancel,
      isOpen,
      isLoading,
      error,
      failure,
      depositTxHash,
      acknowledgeDepositTxHash,
      resolvedDepositAddress: null,
      fundingSessionId: null,
      mountTargetId: null,
    }),
    [
      acknowledgeDepositTxHash,
      cancel,
      close,
      depositTxHash,
      error,
      failure,
      isLoading,
      isOpen,
      openDepositFlow,
    ]
  )

  useRegisterOnRampSession('mesh', session)
  return null
}
