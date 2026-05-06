'use client'
import { ChainType } from '@lifi/sdk'
import { useAccount, useWalletMenu } from '@lifi/wallet-management'
import type { Theme } from '@mui/material'
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
import { modalProps } from '../../../../components/Dialog/Dialog.js'
import { useGetScrollableContainer } from '../../../../hooks/useScrollableContainer.js'
import type { WidgetConfig } from '../../../../types/widget.js'
import type {
  OnrampSessionRequest,
  OnrampSessionResponse,
} from '../../../types/onrampSession.js'
import { useCheckoutConfig } from '../../CheckoutProvider.js'
import { postCheckoutSession } from '../sessionClient.js'
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
  MISSING_API_KEY:
    'Cash deposit is not configured: set widget apiKey to call checkout sessions.',
  ONRAMP_INVALID_RESPONSE:
    'Invalid response from onramp server (missing widgetUrl).',
  ONRAMP_NETWORK_ERROR: 'Network error starting Transak session.',
} as const

type TransakFixedErrorCode = keyof typeof transakCallbackMessages

type TransakUiError =
  | { kind: 'fixed'; code: TransakFixedErrorCode }
  | { kind: 'http'; status: number }
  | { kind: 'text'; text: string; reportCode: string }

// TODO(cleanup-remove-transak-native-eth-retry-hack): Remove this forced ETH fallback token
// and replace with explicit provider capability/config-driven behavior.
const NATIVE_EVM_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000'
const TRANSAK_FALLBACK_CHAIN_IDS = [1]
const TRANSAK_RETRYABLE_STATUS_CODES = [500, 502, 503, 504]

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
  const getScrollableContainer = useGetScrollableContainer()
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

    // TODO(config-alignment): Keep `onrampSessionApiUrl` aligned with `widgetConfig.sdkConfig.apiUrl`
    // by default; only diverge when checkout session APIs are intentionally routed elsewhere.
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
    const apiKey = widgetConfig.apiKey?.trim()
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
    if (!apiKey) {
      setUiError({ kind: 'fixed', code: 'MISSING_API_KEY' })
      onError?.({
        code: 'MISSING_API_KEY',
        message: transakCallbackMessages.MISSING_API_KEY,
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

      // TODO(cleanup-remove-transak-native-eth-retry-hack): This retry is a temporary workaround
      // for develop instability. Replace with deterministic provider capability handling.
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

      if (!res.data.widgetUrl) {
        setUiError({ kind: 'fixed', code: 'ONRAMP_INVALID_RESPONSE' })
        onError?.({
          code: 'ONRAMP_INVALID_RESPONSE',
          message: transakCallbackMessages.ONRAMP_INVALID_RESPONSE,
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
    widgetConfig.apiKey,
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

  useEffect(() => {
    if (!router) {
      return
    }
    return router.subscribe('onResolved', close)
  }, [close, router])

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
      failure: null,
      depositTxHash: null,
      acknowledgeDepositTxHash: () => {},
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
        container={getScrollableContainer}
        sx={modalProps.sx}
        slotProps={{
          backdrop: {
            sx: {
              position: 'absolute',
              backgroundColor: 'rgb(0 0 0 / 32%)',
              backdropFilter: 'blur(3px)',
            },
          },
          paper: {
            sx: (theme: Theme) => ({
              position: 'absolute',
              backgroundImage: 'none',
              backgroundColor: theme.vars.palette.background.default,
              borderTopLeftRadius: theme.vars.shape.borderRadius,
              borderTopRightRadius: theme.vars.shape.borderRadius,
              height: 'min(90dvh, 720px)',
              display: 'flex',
              flexDirection: 'column',
            }),
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
