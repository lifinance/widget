'use client'
import { useAccount, useWalletMenu } from '@lifi/wallet-management'
import type { WidgetConfig } from '@lifi/widget'
import { ChainType } from '@lifi/widget'
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
import { useCheckoutConfig } from '../../providers/CheckoutProvider.js'
import type { OnrampSessionRequest } from '../../types/onrampSession.js'
import type { LoadedOnRampAdapter, OnRampProviderMeta } from '../types.js'
import { TransakContext } from './transakContext.js'

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
  const { integrator, onError, onrampSessionApiUrl } = useCheckoutConfig()
  const { account } = useAccount({ chainType: ChainType.EVM })
  const { openWalletMenu } = useWalletMenu()

  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [widgetUrl, setWidgetUrl] = useState<string | null>(null)
  const transakContainerId = useId()

  const close = useCallback(() => {
    setOpen(false)
    setIsLoading(false)
    setError(null)
    setWidgetUrl(null)
  }, [])

  const openDepositFlow = useCallback(async () => {
    setOpen(true)
    setError(null)
    setWidgetUrl(null)
    setIsLoading(true)

    const base = onrampSessionApiUrl?.replace(/\/$/, '')
    if (!base) {
      const message =
        'Cash deposit is not configured: set onrampSessionApiUrl on the checkout.'
      setError(message)
      onError?.({
        code: 'MISSING_ONRAMP_API',
        message,
        provider: 'transak',
      })
      setIsLoading(false)
      return
    }

    const chainId = widgetConfig.toChain
    const tokenAddress = widgetConfig.toToken
    if (chainId === undefined || !tokenAddress) {
      const message =
        'Cash deposit target is not configured: set widget.toChain and widget.toToken.'
      setError(message)
      onError?.({
        code: 'ONRAMP_TARGET_NOT_CONFIGURED',
        message,
        provider: 'transak',
      })
      setIsLoading(false)
      return
    }

    const walletAddress = account.address
    if (!walletAddress) {
      setError('Connect an Ethereum wallet to deposit with cash.')
      onError?.({
        code: 'WALLET_NOT_CONNECTED',
        message:
          'An EVM wallet must be connected before starting a Transak deposit.',
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
        const message =
          errObj?.error ??
          `Could not start Transak session (${res.status}). Try again later.`
        setError(message)
        onError?.({
          code: errObj?.code ?? 'ONRAMP_SESSION_FAILED',
          message,
          provider: 'transak',
        })
        setIsLoading(false)
        return
      }

      const ok = data as { widgetUrl?: string }
      if (!ok?.widgetUrl) {
        const message =
          'Invalid response from onramp server (missing widgetUrl).'
        setError(message)
        onError?.({
          code: 'ONRAMP_INVALID_RESPONSE',
          message,
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
          : 'Network error starting Transak session.'
      setError(message)
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

    const onOrderSuccessful = () => {
      close()
    }

    Transak.on(Transak.EVENTS.TRANSAK_WIDGET_CLOSE, onWidgetClose)
    Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, onOrderSuccessful)

    transak.init()

    return () => {
      transak.cleanup()
    }
  }, [close, isLoading, open, transakContainerId, widgetUrl])

  const value = useMemo(
    () => ({
      openDepositFlow,
      close,
      isOpen: open,
      isLoading,
      error,
    }),
    [close, error, isLoading, open, openDepositFlow]
  )

  const showWalletCta =
    error === 'Connect an Ethereum wallet to deposit with cash.'

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
        <DialogTitle>Deposit with cash</DialogTitle>
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
          {!isLoading && error ? (
            <Box sx={{ py: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {error}
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
              Connect wallet
            </Button>
          ) : null}
          <Button onClick={close}>Close</Button>
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
