'use client'
import { ChainType } from '@lifi/sdk'
import { useAccount, useWalletMenu } from '@lifi/wallet-management'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import { useRouter } from '@tanstack/react-router'
import { Transak } from '@transak/ui-js-sdk'
import {
  type FC,
  type PropsWithChildren,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import type { WidgetConfig } from '../../../../types/widget.js'
import type { OnrampSessionRequest } from '../../../types/onrampSession.js'
import { useCheckoutConfig } from '../../CheckoutProvider.js'
import type { LoadedOnRampAdapter, OnRampProviderMeta } from '../types.js'
import { TransakContext } from './transakContext.js'

/** English messages for `onError` callbacks (stable for logs / support). */
const transakCallbackMessages = {
  MISSING_ONRAMP_API:
    'Cash deposit is not configured: set onrampSessionApiUrl on the checkout.',
  ONRAMP_TARGET_NOT_CONFIGURED:
    'Cash deposit target is not configured: set widget.toChain and widget.toToken.',
  WALLET_NOT_CONNECTED:
    'An EVM wallet must be connected before starting a Transak deposit.',
  ONRAMP_INVALID_RESPONSE:
    'Invalid response from onramp server (missing widgetUrl).',
  ONRAMP_NETWORK_ERROR: 'Network error starting Transak session.',
} as const

type TransakFixedErrorCode = keyof typeof transakCallbackMessages

type TransakUiError =
  | { kind: 'fixed'; code: TransakFixedErrorCode }
  | { kind: 'http'; status: number }
  | { kind: 'text'; text: string; reportCode: string }

const transakMeta: OnRampProviderMeta = {
  id: 'transak',
  name: 'Transak',
  description: 'Buy crypto with card or bank transfer',
  features: ['Visa/Mastercard', 'Bank Transfer', '170+ Countries'],
  recommended: true,
}

export type TransakCashProviderProps = PropsWithChildren<{
  widgetConfig: WidgetConfig
}>

const TransakCashProvider: FC<TransakCashProviderProps> = ({
  children,
  widgetConfig,
}) => {
  const { t } = useTranslation()
  const { integrator, onError, onSuccess, onrampSessionApiUrl } =
    useCheckoutConfig()
  const { account } = useAccount({ chainType: ChainType.EVM })
  const { openWalletMenu } = useWalletMenu()

  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [uiError, setUiError] = useState<TransakUiError | null>(null)
  const [widgetUrl, setWidgetUrl] = useState<string | null>(null)
  const transakContainerId = useId()
  const router = useRouter()

  const close = useCallback(() => {
    setOpen(false)
    setIsLoading(false)
    setUiError(null)
    setWidgetUrl(null)
  }, [])

  const openDepositFlow = useCallback(async () => {
    setOpen(true)
    setUiError(null)
    setWidgetUrl(null)
    setIsLoading(true)

    const base = onrampSessionApiUrl?.replace(/\/$/, '')
    if (!base) {
      setUiError({ kind: 'fixed', code: 'MISSING_ONRAMP_API' })
      onError?.({
        code: 'MISSING_ONRAMP_API',
        message: transakCallbackMessages.MISSING_ONRAMP_API,
        provider: 'transak',
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
        message: transakCallbackMessages.ONRAMP_TARGET_NOT_CONFIGURED,
        provider: 'transak',
      })
      setIsLoading(false)
      return
    }

    const walletAddress = account.address
    if (!walletAddress) {
      setUiError({ kind: 'fixed', code: 'WALLET_NOT_CONNECTED' })
      onError?.({
        code: 'WALLET_NOT_CONNECTED',
        message: transakCallbackMessages.WALLET_NOT_CONNECTED,
        provider: 'transak',
      })
      setIsLoading(false)
      return
    }

    const body: OnrampSessionRequest = {
      walletAddress,
      tokenAddress,
      chainId,
      integrator,
    }

    try {
      const res = await fetch(`${base}/v1/path/onramp-session`, {
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
            reportCode: errObj.code ?? 'ONRAMP_SESSION_FAILED',
          })
          onError?.({
            code: errObj.code ?? 'ONRAMP_SESSION_FAILED',
            message: errObj.error,
            provider: 'transak',
          })
        } else {
          setUiError({ kind: 'http', status: res.status })
          onError?.({
            code: 'ONRAMP_SESSION_FAILED',
            message: `Could not start Transak session (${res.status}). Try again later.`,
            provider: 'transak',
          })
        }
        setIsLoading(false)
        return
      }

      const ok = data as { widgetUrl?: string }
      if (!ok?.widgetUrl) {
        setUiError({ kind: 'fixed', code: 'ONRAMP_INVALID_RESPONSE' })
        onError?.({
          code: 'ONRAMP_INVALID_RESPONSE',
          message: transakCallbackMessages.ONRAMP_INVALID_RESPONSE,
          provider: 'transak',
        })
        setIsLoading(false)
        return
      }

      setWidgetUrl(ok.widgetUrl)
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : transakCallbackMessages.ONRAMP_NETWORK_ERROR
      setUiError(
        e instanceof Error
          ? {
              kind: 'text',
              text: e.message,
              reportCode: 'ONRAMP_NETWORK_ERROR',
            }
          : { kind: 'fixed', code: 'ONRAMP_NETWORK_ERROR' }
      )
      onError?.({
        code: 'ONRAMP_NETWORK_ERROR',
        message,
        provider: 'transak',
      })
    } finally {
      setIsLoading(false)
    }
  }, [
    account.address,
    integrator,
    onError,
    onrampSessionApiUrl,
    widgetConfig.toChain,
    widgetConfig.toToken,
  ])

  useEffect(() => {
    if (!open || !widgetUrl || isLoading) {
      return
    }

    const transak = new Transak({
      widgetUrl,
      containerId: transakContainerId,
      widgetWidth: '100%',
      widgetHeight: '100%',
    })

    const onWidgetClose = () => {
      close()
    }

    const onOrderSuccessful = (data: unknown) => {
      if (onSuccess) {
        const order =
          data != null &&
          typeof data === 'object' &&
          'status' in data &&
          data.status != null &&
          typeof data.status === 'object'
            ? (data.status as Record<string, unknown>)
            : {}
        onSuccess({
          provider: 'transak',
          transactionHash:
            typeof order.transactionHash === 'string'
              ? order.transactionHash
              : undefined,
          amount: String(order.cryptoAmount ?? order.fiatAmount ?? ''),
          token: String(order.cryptoCurrency ?? widgetConfig.toToken ?? ''),
          chainId: Number(
            order.chainId ?? order.networkId ?? widgetConfig.toChain ?? 0
          ),
        })
      }
      close()
    }

    Transak.on(Transak.EVENTS.TRANSAK_WIDGET_CLOSE, onWidgetClose)
    Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, onOrderSuccessful)

    transak.init()

    return () => {
      transak.cleanup()
    }
  }, [
    close,
    isLoading,
    onSuccess,
    open,
    transakContainerId,
    widgetConfig.toChain,
    widgetConfig.toToken,
    widgetUrl,
  ])

  useEffect(() => router.subscribe('onResolved', close), [close, router])

  const value = useMemo(
    () => ({
      openDepositFlow,
      close,
      isOpen: open,
      isLoading,
      error:
        uiError === null
          ? null
          : uiError.kind === 'fixed'
            ? t(`checkout.transak.errors.${uiError.code}`)
            : uiError.kind === 'http'
              ? t('checkout.transak.errors.ONRAMP_SESSION_HTTP', {
                  status: uiError.status,
                })
              : uiError.text,
    }),
    [close, isLoading, open, openDepositFlow, t, uiError]
  )

  const showWalletCta =
    uiError?.kind === 'fixed' && uiError.code === 'WALLET_NOT_CONNECTED'

  const errorMessage = value.error

  return (
    <TransakContext.Provider value={value}>
      {children}
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={close}
        slotProps={{
          paper: {
            sx: {
              height: 'min(90dvh, 720px)',
              display: 'flex',
              flexDirection: 'column',
            },
          },
        }}
      >
        <DialogTitle>{t('checkout.transak.dialogTitle')}</DialogTitle>
        <DialogContent
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            pt: 1,
          }}
        >
          {isLoading ? (
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CircularProgress />
            </Box>
          ) : null}
          {!isLoading && errorMessage ? (
            <Box sx={{ py: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {errorMessage}
              </Typography>
            </Box>
          ) : null}
          {!isLoading && widgetUrl ? (
            <Box
              id={transakContainerId}
              sx={{
                flex: 1,
                display: 'flex',
                minHeight: 480,
                minWidth: 0,
                width: '100%',
              }}
            />
          ) : null}
        </DialogContent>
        <DialogActions>
          {showWalletCta ? (
            <Button variant="contained" onClick={() => openWalletMenu()}>
              {t('checkout.connectWallet')}
            </Button>
          ) : null}
          <Button onClick={close}>{t('checkout.transak.close')}</Button>
        </DialogActions>
      </Dialog>
    </TransakContext.Provider>
  )
}

const TransakCashRoot: FC<{
  widgetConfig: WidgetConfig
  children: ReactNode
}> = ({ widgetConfig, children }) => (
  <TransakCashProvider widgetConfig={widgetConfig}>
    {children}
  </TransakCashProvider>
)

export function createTransakLoadedAdapter(): LoadedOnRampAdapter {
  return {
    meta: transakMeta,
    Wrap: TransakCashRoot,
  }
}
