'use client'
import { ChainType } from '@lifi/sdk'
import { useAccount } from '@lifi/wallet-management'
import type {
  LinkEventType,
  LinkPayload,
  TransferFinishedPayload,
} from '@meshconnect/web-link-sdk'
import { createLink } from '@meshconnect/web-link-sdk'
import {
  type FC,
  type PropsWithChildren,
  type ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import type { WidgetConfig } from '../../../../types/widget.js'
import { useCheckoutUserId } from '../../../hooks/useCheckoutUserId.js'
import type {
  CexSessionRequest,
  CexSessionResponse,
} from '../../../types/onrampSession.js'
import { useCheckoutConfig } from '../../CheckoutProvider.js'
import { postCheckoutSession } from '../sessionClient.js'
import type {
  LoadedOnRampAdapter,
  OnRampFailureState,
  OnRampProviderMeta,
} from '../types.js'
import { MeshContext } from './meshContext.js'

const meshCallbackMessages = {
  MISSING_API_URL: 'CEX deposit is not configured: set onrampSessionApiUrl.',
  ONRAMP_TARGET_NOT_CONFIGURED:
    'CEX deposit target is not configured: set widget.toChain and widget.toToken.',
  WALLET_NOT_CONNECTED:
    'An EVM wallet must be connected before starting a Mesh deposit.',
  MISSING_API_KEY:
    'CEX deposit is not configured: set widget apiKey to call checkout sessions.',
  ONRAMP_INVALID_RESPONSE:
    'Invalid response from onramp server (missing linkToken).',
  ONRAMP_NETWORK_ERROR: 'Network error starting Mesh session.',
} as const

type MeshFixedErrorCode = keyof typeof meshCallbackMessages

type MeshUiError =
  | { kind: 'fixed'; code: MeshFixedErrorCode }
  | { kind: 'http'; status: number }
  | { kind: 'text'; text: string; reportCode: string }

const meshMeta: OnRampProviderMeta = {
  id: 'mesh',
  name: 'Mesh',
  description: 'Transfer from your exchange account',
  features: ['Coinbase', 'Binance', '300+ Exchanges'],
}

export type MeshProviderProps = PropsWithChildren<{
  widgetConfig: WidgetConfig
}>

const MeshCexProvider: FC<MeshProviderProps> = ({ children, widgetConfig }) => {
  const { t } = useTranslation()
  const checkoutUserId = useCheckoutUserId()
  const { integrator, onError, onSuccess, onrampSessionApiUrl } =
    useCheckoutConfig()
  const { account } = useAccount({ chainType: ChainType.EVM })

  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [uiError, setUiError] = useState<MeshUiError | null>(null)
  const [failure, setFailure] = useState<OnRampFailureState | null>(null)
  const [depositTxHash, setDepositTxHash] = useState<string | null>(null)
  // Track in-Mesh errors as they stream through onEvent so we can classify
  // the terminal close from onExit. Refs (not state) because Mesh's callbacks
  // capture the value at link-creation time.
  const lastEventErrorRef = useRef<{
    kind: 'connection' | 'withdrawal'
    message: string
  } | null>(null)
  const transferSucceededRef = useRef(false)

  const close = useCallback(() => {
    setIsOpen(false)
    setIsLoading(false)
    setUiError(null)
  }, [])

  const acknowledgeDepositTxHash = useCallback(() => {
    setDepositTxHash(null)
  }, [])

  const openDepositFlow = useCallback(async () => {
    setUiError(null)
    setFailure(null)
    setDepositTxHash(null)
    lastEventErrorRef.current = null
    transferSucceededRef.current = false
    setIsLoading(true)

    // TODO(config-alignment): Keep `onrampSessionApiUrl` aligned with `widgetConfig.sdkConfig.apiUrl`
    // by default; only diverge when checkout session APIs are intentionally routed elsewhere.
    const apiUrl = onrampSessionApiUrl?.replace(/\/$/, '')
    const apiKey = widgetConfig.apiKey?.trim()
    if (!apiUrl) {
      setUiError({ kind: 'fixed', code: 'MISSING_API_URL' })
      onError?.({
        code: 'MISSING_API_URL',
        message: meshCallbackMessages.MISSING_API_URL,
        provider: 'mesh',
      })
      setIsLoading(false)
      return
    }
    if (!apiKey) {
      setUiError({ kind: 'fixed', code: 'MISSING_API_KEY' })
      onError?.({
        code: 'MISSING_API_KEY',
        message: meshCallbackMessages.MISSING_API_KEY,
        provider: 'mesh',
      })
      setIsLoading(false)
      return
    }

    const chainId = widgetConfig.toChain
    const tokenAddress = widgetConfig.toToken
    if (chainId === undefined || !tokenAddress) {
      setUiError({ kind: 'fixed', code: 'ONRAMP_TARGET_NOT_CONFIGURED' })
      onError?.({
        code: 'ONRAMP_TARGET_NOT_CONFIGURED',
        message: meshCallbackMessages.ONRAMP_TARGET_NOT_CONFIGURED,
        provider: 'mesh',
      })
      setIsLoading(false)
      return
    }

    const walletAddress = account.address
    if (!walletAddress) {
      setUiError({ kind: 'fixed', code: 'WALLET_NOT_CONNECTED' })
      onError?.({
        code: 'WALLET_NOT_CONNECTED',
        message: meshCallbackMessages.WALLET_NOT_CONNECTED,
        provider: 'mesh',
      })
      setIsLoading(false)
      return
    }

    const body: CexSessionRequest = {
      walletAddress,
      tokenAddress,
      chainId,
      userId: checkoutUserId,
      integrator,
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
          setUiError({
            kind: 'text',
            text: errObj.error,
            reportCode: errObj.code ?? 'CEX_SESSION_FAILED',
          })
          onError?.({
            code: errObj.code ?? 'CEX_SESSION_FAILED',
            message: errObj.error,
            provider: 'mesh',
          })
        } else {
          setUiError({ kind: 'http', status: res.status })
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
        setUiError({ kind: 'fixed', code: 'ONRAMP_INVALID_RESPONSE' })
        onError?.({
          code: 'ONRAMP_INVALID_RESPONSE',
          message: meshCallbackMessages.ONRAMP_INVALID_RESPONSE,
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
          // Only hand off a real on-chain hash. Mesh's `txId` is an internal
          // identifier that won't resolve via LI.FI's status endpoint.
          // TODO(test-mode): remove DEV override once Mesh/test backend
          // returns a /status-resolvable hash.
          const onChainHash =
            process.env.NODE_ENV === 'development'
              ? '0xed295238d734db823a5d2791fd2e55afa2b398ab66d8ec55e4be09b2ee6eec1c'
              : payload.txHash?.trim()
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
        onExit: (error?: string) => {
          // Reset transient open/loading flags but keep failure/depositTxHash
          // so the consumer can render the post-Mesh state.
          setIsOpen(false)
          setIsLoading(false)

          if (transferSucceededRef.current) {
            return
          }

          const tracked = lastEventErrorRef.current
          if (tracked) {
            const message =
              tracked.message ||
              (tracked.kind === 'withdrawal'
                ? t('checkout.mesh.failure.withdrawalDescription')
                : t('checkout.mesh.failure.connectionDescription'))
            setFailure({
              kind: tracked.kind,
              message,
              reportCode:
                tracked.kind === 'withdrawal'
                  ? 'MESH_WITHDRAWAL_FAILED'
                  : 'MESH_CONNECTION_FAILED',
              retry: () => {
                setFailure(null)
                void openDepositFlow()
              },
            })
            onError?.({
              code:
                tracked.kind === 'withdrawal'
                  ? 'MESH_WITHDRAWAL_FAILED'
                  : 'MESH_CONNECTION_FAILED',
              message,
              provider: 'mesh',
            })
            return
          }

          if (error) {
            const message = error
            setFailure({
              kind: 'connection',
              message,
              reportCode: 'MESH_EXIT_ERROR',
              retry: () => {
                setFailure(null)
                void openDepositFlow()
              },
            })
            onError?.({
              code: 'MESH_EXIT_ERROR',
              message,
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
          : meshCallbackMessages.ONRAMP_NETWORK_ERROR
      setUiError(
        e instanceof Error
          ? {
              kind: 'text',
              text: e.message,
              reportCode: 'ONRAMP_NETWORK_ERROR',
            }
          : { kind: 'fixed', code: 'ONRAMP_NETWORK_ERROR' }
      )
      onError?.({ code: 'ONRAMP_NETWORK_ERROR', message, provider: 'mesh' })
      setIsLoading(false)
    }
  }, [
    account.address,
    checkoutUserId,
    integrator,
    onError,
    onSuccess,
    onrampSessionApiUrl,
    t,
    widgetConfig.apiKey,
    widgetConfig.toChain,
    widgetConfig.toToken,
  ])

  const value = useMemo(
    () => ({
      openDepositFlow,
      close,
      isOpen,
      isLoading,
      error:
        uiError === null
          ? null
          : uiError.kind === 'fixed'
            ? t(`checkout.mesh.errors.${uiError.code}`)
            : uiError.kind === 'http'
              ? t('checkout.mesh.errors.CEX_SESSION_HTTP', {
                  status: uiError.status,
                })
              : uiError.text,
      failure,
      depositTxHash,
      acknowledgeDepositTxHash,
    }),
    [
      acknowledgeDepositTxHash,
      close,
      depositTxHash,
      failure,
      isLoading,
      isOpen,
      openDepositFlow,
      t,
      uiError,
    ]
  )

  return <MeshContext.Provider value={value}>{children}</MeshContext.Provider>
}

const MeshCexRoot: FC<{ widgetConfig: WidgetConfig; children: ReactNode }> = ({
  widgetConfig,
  children,
}) => <MeshCexProvider widgetConfig={widgetConfig}>{children}</MeshCexProvider>

export function createMeshLoadedAdapter(): LoadedOnRampAdapter {
  return {
    meta: meshMeta,
    Wrap: MeshCexRoot,
  }
}
