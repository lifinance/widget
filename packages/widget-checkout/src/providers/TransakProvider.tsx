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
import {
  createContext,
  type FC,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { OnrampSessionRequest } from '../types/onrampSession.js'
import { useCheckoutConfig } from './CheckoutProvider.js'

export interface TransakContextValue {
  openDepositFlow: () => void
  close: () => void
  isOpen: boolean
  isLoading: boolean
  error: string | null
}

const TransakContext = createContext<TransakContextValue | null>(null)

export function useTransak(): TransakContextValue {
  const ctx = useContext(TransakContext)
  if (!ctx) {
    throw new Error('useTransak must be used within TransakProvider')
  }
  return ctx
}

export type TransakProviderProps = PropsWithChildren<{
  widgetConfig: WidgetConfig
}>

export const TransakProvider: FC<TransakProviderProps> = ({
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
            <Box sx={{ flex: 1, minHeight: 0, display: 'flex' }}>
              {/* Future: listen for Transak iframe postMessage (order success / close) to navigate to progress without the SDK. */}
              <iframe
                src={widgetUrl}
                title="Transak"
                style={{
                  flex: 1,
                  width: '100%',
                  minHeight: 480,
                  border: 0,
                  borderRadius: 8,
                }}
                allow="camera; microphone; payment"
              />
            </Box>
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
