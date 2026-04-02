'use client'
import { ChainType } from '@lifi/sdk'
import { useAccount } from '@lifi/wallet-management'
import type {
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
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useToken } from '../../../../hooks/useToken.js'
import type { WidgetConfig } from '../../../../types/widget.js'
import { useCheckoutUserId } from '../../../hooks/useCheckoutUserId.js'
import type { CexSessionRequest } from '../../../types/onrampSession.js'
import { useCheckoutConfig } from '../../CheckoutProvider.js'
import type { LoadedOnRampAdapter, OnRampProviderMeta } from '../types.js'
import { MeshContext } from './meshContext.js'

const meshCallbackMessages = {
  MISSING_API_URL:
    'CEX deposit is not configured: widget sdkConfig.apiUrl is not set.',
  ONRAMP_TARGET_NOT_CONFIGURED:
    'CEX deposit target is not configured: set widget.toChain and widget.toToken.',
  WALLET_NOT_CONNECTED:
    'An EVM wallet must be connected before starting a Mesh deposit.',
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
  const { integrator, onError, onSuccess } = useCheckoutConfig()
  const { account } = useAccount({ chainType: ChainType.EVM })
  const { token: toToken } = useToken(
    widgetConfig.toChain,
    widgetConfig.toToken
  )

  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [uiError, setUiError] = useState<MeshUiError | null>(null)

  const close = useCallback(() => {
    setIsOpen(false)
    setIsLoading(false)
    setUiError(null)
  }, [])

  const openDepositFlow = useCallback(async () => {
    setUiError(null)
    setIsLoading(true)

    const apiUrl = widgetConfig.sdkConfig?.apiUrl?.replace(/\/$/, '')
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

    const chainId = widgetConfig.toChain
    const tokenAddress = widgetConfig.toToken
    const tokenSymbol = toToken?.symbol
    if (chainId === undefined || !tokenAddress || !tokenSymbol) {
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
      userId: checkoutUserId,
      transactionId: crypto.randomUUID(),
      integrator,
      toAddress: {
        address: walletAddress,
        tokenAddress,
        chainId,
        symbol: tokenSymbol,
        networkId: String(chainId),
      },
    }

    try {
      const res = await fetch(`${apiUrl}/path/cex-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data: unknown = await res.json().catch(() => null)

      if (!res.ok) {
        const errObj = data as { error?: string; code?: string } | null
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

      const ok = data as { linkToken?: string }
      if (!ok?.linkToken) {
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
          if (onSuccess) {
            onSuccess({
              provider: 'mesh',
              transactionHash: payload.txHash ?? payload.txId,
              amount: String(payload.amount),
              token: payload.symbol,
              chainId: Number(widgetConfig.toChain ?? 0),
            })
          }
          close()
        },
        onExit: (error?: string) => {
          if (error) {
            onError?.({
              code: 'MESH_EXIT_ERROR',
              message: error,
              provider: 'mesh',
            })
          }
          close()
        },
      })

      setIsLoading(false)
      setIsOpen(true)
      link.openLink(ok.linkToken)
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
    close,
    integrator,
    onError,
    onSuccess,
    toToken?.symbol,
    widgetConfig.sdkConfig?.apiUrl,
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
    }),
    [close, isLoading, isOpen, openDepositFlow, t, uiError]
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
