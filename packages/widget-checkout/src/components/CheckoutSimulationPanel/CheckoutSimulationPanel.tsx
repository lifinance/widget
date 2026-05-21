import type { Route } from '@lifi/sdk'
import BugReportRoundedIcon from '@mui/icons-material/BugReportRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded'
import {
  alpha,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  Fab,
  IconButton,
  Portal,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { type JSX, useState } from 'react'
import { useFrozenQuote } from '../../hooks/useFrozenQuote.js'

// Bundlers replace this at build time, so the entire panel — including its
// MUI imports — dead-code-eliminates in production consumer bundles.
const IS_DEV = process.env.NODE_ENV !== 'production'

const STATUS_PATH = '/transaction-execution/transaction-status'
const TRANSFER_DEPOSIT_PATH = '/transfer-deposit'
const HOME_PATH = '/'

const PENDING_HOLD_MS = '99999'
const MOCK_DEPOSIT_ADDRESS = '0x74890864d2a135b98eae5f90c5e6bf96c7283929'

/** All known dev-simulation query keys — cleared on every preset apply. */
const SIM_PARAM_KEYS = [
  'mockDepositAddress',
  'simulatePendingDuration',
  'simulateTransferReceipt',
  'simulateTransferReceiptAfter',
  'simulateSubstatus',
  'simulateOnRampFailure',
  'simulateFundingSource',
] as const

type Tone = 'success' | 'pending' | 'warning' | 'error' | 'neutral'

interface SimPresetBase {
  label: string
  /** Tone hint that drives the chip color so variants are scannable. */
  tone: Tone
  /** Optional sub-label (e.g. funding-source variant). */
  subtitle?: string
  /** Query params to write to window.location.search (read by helpers). */
  windowParams?: Record<string, string>
  /** Router search to apply (read by useLocation in components). */
  routerSearch?: Record<string, string | number | boolean>
}

interface SimPresetSearch extends SimPresetBase {
  to: typeof STATUS_PATH | typeof TRANSFER_DEPOSIT_PATH | typeof HOME_PATH
  params?: undefined
}

interface SimPresetParamPath extends SimPresetBase {
  to: '/deposit-error/$kind'
  params: { kind: string }
}

type SimPreset = SimPresetSearch | SimPresetParamPath

const STATUS_PRESETS: SimPreset[] = [
  {
    label: 'Watching',
    tone: 'pending',
    to: STATUS_PATH,
    routerSearch: { simulateTransactionStatus: 'watching' },
  },
  {
    label: 'Executing',
    subtitle: 'pending',
    tone: 'pending',
    windowParams: { simulatePendingDuration: PENDING_HOLD_MS },
    to: STATUS_PATH,
    routerSearch: { simulateTransactionStatus: 'pending' },
  },
  {
    label: 'Success',
    subtitle: 'completed',
    tone: 'success',
    to: STATUS_PATH,
    routerSearch: { simulateTransactionStatus: 'done' },
  },
  {
    label: 'Success — refunded',
    subtitle: 'wallet',
    tone: 'success',
    windowParams: {
      simulateSubstatus: 'REFUNDED',
      simulateFundingSource: 'wallet',
    },
    to: STATUS_PATH,
    routerSearch: { simulateTransactionStatus: 'done' },
  },
  {
    label: 'Success — refunded',
    subtitle: 'cash',
    tone: 'success',
    windowParams: {
      simulateSubstatus: 'REFUNDED',
      simulateFundingSource: 'cash',
    },
    to: STATUS_PATH,
    routerSearch: { simulateTransactionStatus: 'done' },
  },
  {
    label: 'Pending — refund',
    subtitle: 'wallet',
    tone: 'pending',
    windowParams: {
      simulateSubstatus: 'REFUND_IN_PROGRESS',
      simulateFundingSource: 'wallet',
      simulatePendingDuration: PENDING_HOLD_MS,
    },
    to: STATUS_PATH,
    routerSearch: { simulateTransactionStatus: 'pending' },
  },
  {
    label: 'Pending — refund',
    subtitle: 'cash',
    tone: 'pending',
    windowParams: {
      simulateSubstatus: 'REFUND_IN_PROGRESS',
      simulateFundingSource: 'cash',
      simulatePendingDuration: PENDING_HOLD_MS,
    },
    to: STATUS_PATH,
    routerSearch: { simulateTransactionStatus: 'pending' },
  },
  {
    label: 'Pending — retrying',
    subtitle: 'intent failed',
    tone: 'warning',
    windowParams: {
      simulateSubstatus: 'INTENT_FAILED_RETRYABLE',
      simulatePendingDuration: PENDING_HOLD_MS,
    },
    to: STATUS_PATH,
    routerSearch: { simulateTransactionStatus: 'pending' },
  },
  {
    label: 'Pending — retrying',
    subtitle: 'simulation failure',
    tone: 'warning',
    windowParams: {
      simulateSubstatus: 'INTENT_SIMULATION_FAILURE',
      simulatePendingDuration: PENDING_HOLD_MS,
    },
    to: STATUS_PATH,
    routerSearch: { simulateTransactionStatus: 'pending' },
  },
  {
    label: 'Failed — generic',
    subtitle: 'wallet',
    tone: 'error',
    windowParams: { simulateFundingSource: 'wallet' },
    to: STATUS_PATH,
    routerSearch: { simulateTransactionStatus: 'failed' },
  },
  {
    label: 'Failed — generic',
    subtitle: 'cash',
    tone: 'error',
    windowParams: { simulateFundingSource: 'cash' },
    to: STATUS_PATH,
    routerSearch: { simulateTransactionStatus: 'failed' },
  },
  {
    label: 'Failed — expired',
    subtitle: 'wallet',
    tone: 'error',
    windowParams: {
      simulateSubstatus: 'EXPIRED',
      simulateFundingSource: 'wallet',
    },
    to: STATUS_PATH,
    routerSearch: { simulateTransactionStatus: 'failed' },
  },
  {
    label: 'Failed — expired',
    subtitle: 'transfer',
    tone: 'error',
    windowParams: {
      simulateSubstatus: 'EXPIRED',
      simulateFundingSource: 'transfer',
    },
    to: STATUS_PATH,
    routerSearch: { simulateTransactionStatus: 'failed' },
  },
  {
    label: 'Wallet disconnected',
    tone: 'error',
    windowParams: { simulateFundingSource: 'wallet' },
    to: STATUS_PATH,
    routerSearch: { walletDisconnected: true },
  },
]

const ON_RAMP_FAILURE_PRESETS: SimPreset[] = [
  {
    label: 'Withdrawal',
    subtitle: 'cash',
    tone: 'error',
    windowParams: {
      simulateOnRampFailure: 'withdrawal',
      simulateFundingSource: 'cash',
    },
    to: STATUS_PATH,
  },
  {
    label: 'Withdrawal',
    subtitle: 'exchange',
    tone: 'error',
    windowParams: {
      simulateOnRampFailure: 'withdrawal',
      simulateFundingSource: 'exchange',
    },
    to: STATUS_PATH,
  },
  {
    label: 'Withdrawal',
    subtitle: 'generic',
    tone: 'error',
    windowParams: { simulateOnRampFailure: 'withdrawal' },
    to: STATUS_PATH,
  },
  {
    label: 'Cancelled',
    subtitle: 'cash',
    tone: 'warning',
    windowParams: {
      simulateOnRampFailure: 'cancelled',
      simulateFundingSource: 'cash',
    },
    to: STATUS_PATH,
  },
  {
    label: 'Cancelled',
    subtitle: 'generic',
    tone: 'warning',
    windowParams: {
      simulateOnRampFailure: 'cancelled',
      simulateFundingSource: 'exchange',
    },
    to: STATUS_PATH,
  },
  {
    label: 'Unavailable',
    subtitle: 'cash',
    tone: 'error',
    windowParams: {
      simulateOnRampFailure: 'unavailable',
      simulateFundingSource: 'cash',
    },
    to: STATUS_PATH,
  },
  {
    label: 'Unavailable',
    subtitle: 'generic',
    tone: 'error',
    windowParams: { simulateOnRampFailure: 'unavailable' },
    to: STATUS_PATH,
  },
  {
    label: 'Connection',
    subtitle: 'exchange',
    tone: 'error',
    windowParams: {
      simulateOnRampFailure: 'connection',
      simulateFundingSource: 'exchange',
    },
    to: STATUS_PATH,
  },
  {
    label: 'Connection',
    subtitle: 'generic',
    tone: 'error',
    windowParams: { simulateOnRampFailure: 'connection' },
    to: STATUS_PATH,
  },
]

const DEPOSIT_ERROR_PRESETS: SimPreset[] = [
  {
    label: 'Unexpected',
    tone: 'error',
    to: '/deposit-error/$kind',
    params: { kind: 'unexpected' },
  },
  {
    label: 'Amount low — threshold',
    tone: 'warning',
    to: '/deposit-error/$kind',
    params: { kind: 'amount-low-threshold' },
  },
  {
    label: 'Amount low — top-up',
    tone: 'warning',
    to: '/deposit-error/$kind',
    params: { kind: 'amount-low-top-up' },
  },
  {
    label: 'Amount low — expired',
    tone: 'warning',
    to: '/deposit-error/$kind',
    params: { kind: 'amount-low-expired' },
  },
  {
    label: 'Excess held',
    tone: 'neutral',
    to: '/deposit-error/$kind',
    params: { kind: 'excess-held' },
  },
  {
    label: 'Late arrival',
    tone: 'warning',
    to: '/deposit-error/$kind',
    params: { kind: 'late-arrival' },
  },
  {
    label: 'Address expired',
    tone: 'error',
    to: '/deposit-error/$kind',
    params: { kind: 'address-expired' },
  },
  {
    label: 'Market moved',
    tone: 'error',
    to: '/deposit-error/$kind',
    params: { kind: 'market-moved' },
  },
]

const TRANSFER_FLOW_PRESETS: SimPreset[] = [
  {
    label: 'QR + auto receipt',
    subtitle: 'done in 3s',
    tone: 'success',
    windowParams: {
      mockDepositAddress: MOCK_DEPOSIT_ADDRESS,
      simulateTransferReceipt: 'done',
      simulateTransferReceiptAfter: '3000',
    },
    to: TRANSFER_DEPOSIT_PATH,
  },
  {
    label: 'QR + auto receipt',
    subtitle: 'pending in 3s',
    tone: 'pending',
    windowParams: {
      mockDepositAddress: MOCK_DEPOSIT_ADDRESS,
      simulateTransferReceipt: 'pending',
      simulateTransferReceiptAfter: '3000',
      simulatePendingDuration: PENDING_HOLD_MS,
    },
    to: TRANSFER_DEPOSIT_PATH,
  },
  {
    label: 'QR + auto receipt',
    subtitle: 'failed in 3s',
    tone: 'error',
    windowParams: {
      mockDepositAddress: MOCK_DEPOSIT_ADDRESS,
      simulateTransferReceipt: 'failed',
      simulateTransferReceiptAfter: '3000',
    },
    to: TRANSFER_DEPOSIT_PATH,
  },
  {
    label: 'QR only',
    subtitle: 'no auto-advance',
    tone: 'neutral',
    windowParams: { mockDepositAddress: MOCK_DEPOSIT_ADDRESS },
    to: TRANSFER_DEPOSIT_PATH,
  },
]

const TABS: { id: string; label: string; presets: SimPreset[] }[] = [
  { id: 'status', label: 'Status', presets: STATUS_PRESETS },
  { id: 'onramp', label: 'On-ramp', presets: ON_RAMP_FAILURE_PRESETS },
  { id: 'deposit', label: 'Deposit', presets: DEPOSIT_ERROR_PRESETS },
  { id: 'transfer', label: 'Transfer', presets: TRANSFER_FLOW_PRESETS },
]

function buildSimulatedRoute(depositAddress: string): Route {
  const usdt = {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    chainId: 1,
    symbol: 'USDT',
    decimals: 6,
    name: 'USDT',
    coinKey: 'USDT',
    logoURI: '',
    priceUSD: '1',
  }
  return {
    id: 'sim-route',
    fromChainId: 1,
    fromAmount: '1000000',
    fromAmountUSD: '1.00',
    fromToken: usdt,
    fromAddress: depositAddress,
    toChainId: 1,
    toAmount: '1000000',
    toAmountMin: '1000000',
    toAmountUSD: '1.00',
    toToken: usdt,
    toAddress: depositAddress,
    gasCostUSD: '0',
    containsSwitchChain: false,
    steps: [],
    insurance: { state: 'NOT_INSURABLE', feeAmountUsd: '0' },
    depositAddress,
  } as unknown as Route
}

function clearSimParams(url: URL): void {
  for (const key of SIM_PARAM_KEYS) {
    url.searchParams.delete(key)
  }
}

function toneColor(
  tone: Tone
): 'success' | 'info' | 'warning' | 'error' | 'default' {
  switch (tone) {
    case 'success':
      return 'success'
    case 'pending':
      return 'info'
    case 'warning':
      return 'warning'
    case 'error':
      return 'error'
    default:
      return 'default'
  }
}

function PresetButton({
  preset,
  onPick,
}: {
  preset: SimPreset
  onPick: (preset: SimPreset) => void
}): JSX.Element {
  const color = toneColor(preset.tone)
  return (
    <Button
      onClick={() => onPick(preset)}
      variant="text"
      fullWidth
      sx={(theme) => {
        const base =
          color === 'default'
            ? theme.palette.text.primary
            : theme.palette[color].main
        return {
          justifyContent: 'space-between',
          textTransform: 'none',
          alignItems: 'center',
          px: 1.25,
          py: 0.75,
          borderRadius: 1.5,
          color: theme.palette.text.primary,
          backgroundColor: alpha(base, 0.06),
          border: `1px solid ${alpha(base, 0.18)}`,
          transition: theme.transitions.create(
            ['background-color', 'border-color', 'transform'],
            { duration: 120 }
          ),
          '&:hover': {
            backgroundColor: alpha(base, 0.14),
            borderColor: alpha(base, 0.32),
            transform: 'translateY(-1px)',
          },
        }
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: 'center', minWidth: 0, flex: 1 }}
      >
        <Box
          sx={(theme) => ({
            width: 8,
            height: 8,
            borderRadius: '50%',
            flexShrink: 0,
            backgroundColor:
              color === 'default'
                ? theme.palette.text.disabled
                : theme.palette[color].main,
          })}
        />
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {preset.label}
        </Typography>
      </Stack>
      {preset.subtitle ? (
        <Chip
          label={preset.subtitle}
          size="small"
          sx={(theme) => ({
            height: 18,
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: 0.2,
            textTransform: 'uppercase',
            color: theme.palette.text.secondary,
            backgroundColor: alpha(theme.palette.text.primary, 0.06),
            '& .MuiChip-label': { px: 0.75 },
          })}
        />
      ) : null}
    </Button>
  )
}

export function CheckoutSimulationPanel(): JSX.Element | null {
  const navigate = useNavigate()
  const { freeze, clear } = useFrozenQuote()
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState(0)
  if (!IS_DEV) {
    return null
  }

  const applyPreset = (preset: SimPreset): void => {
    const url = new URL(window.location.href)
    clearSimParams(url)
    if (preset.windowParams) {
      for (const [k, v] of Object.entries(preset.windowParams)) {
        url.searchParams.set(k, v)
      }
    }
    window.history.replaceState({}, '', url.toString())
    if (preset.to === TRANSFER_DEPOSIT_PATH) {
      const mock = preset.windowParams?.mockDepositAddress
      if (mock) {
        freeze(buildSimulatedRoute(mock))
      }
    }
    if (preset.params) {
      navigate({
        to: preset.to,
        params: preset.params,
        search: preset.routerSearch ?? {},
      })
    } else {
      navigate({
        to: preset.to,
        search: preset.routerSearch ?? {},
      })
    }
  }

  const resetAll = (): void => {
    const url = new URL(window.location.href)
    clearSimParams(url)
    window.history.replaceState({}, '', url.toString())
    clear()
    navigate({ to: HOME_PATH })
  }

  const activePresets = TABS[tab].presets

  return (
    <Portal>
      <Tooltip title="Simulation panel (dev)" placement="left">
        <Fab
          size="small"
          onClick={() => setOpen(true)}
          aria-label="Open simulation panel"
          sx={(theme) => ({
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 2147483600,
            backgroundColor: alpha(theme.palette.background.paper, 0.92),
            color: theme.palette.text.primary,
            border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
            backdropFilter: 'blur(10px)',
            boxShadow: theme.shadows[6],
            transition: theme.transitions.create(
              ['transform', 'box-shadow', 'background-color'],
              { duration: 160 }
            ),
            '&:hover': {
              backgroundColor: theme.palette.background.paper,
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows[10],
            },
          })}
        >
          <BugReportRoundedIcon fontSize="small" />
        </Fab>
      </Tooltip>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        variant="persistent"
        sx={{ zIndex: 2147483601 }}
        slotProps={{
          paper: {
            sx: (theme) => ({
              width: 360,
              borderTopLeftRadius: 16,
              borderBottomLeftRadius: 16,
              background:
                theme.palette.mode === 'dark'
                  ? `linear-gradient(180deg, ${theme.palette.background.paper}, ${alpha(theme.palette.background.default, 0.96)})`
                  : `linear-gradient(180deg, ${theme.palette.background.paper}, ${alpha(theme.palette.grey[50], 0.96)})`,
            }),
          },
        }}
      >
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            pt: 2,
            pb: 1.5,
          }}
        >
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
            <Box
              sx={(theme) => ({
                width: 28,
                height: 28,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: alpha(theme.palette.primary.main, 0.12),
                color: theme.palette.primary.main,
              })}
            >
              <BugReportRoundedIcon fontSize="small" />
            </Box>
            <Stack sx={{ lineHeight: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Simulation
              </Typography>
              <Typography variant="caption" color="text.secondary">
                dev only · drives status & error flows
              </Typography>
            </Stack>
          </Stack>
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Reset sim params + home">
              <IconButton size="small" onClick={resetAll}>
                <RestartAltRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <IconButton
              size="small"
              onClick={() => setOpen(false)}
              aria-label="Close simulation panel"
            >
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="fullWidth"
          sx={(theme) => ({
            minHeight: 36,
            borderBottom: `1px solid ${theme.palette.divider}`,
            '& .MuiTab-root': {
              minHeight: 36,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: 12,
            },
          })}
        >
          {TABS.map((t) => (
            <Tab key={t.id} label={t.label} />
          ))}
        </Tabs>
        <Box sx={{ p: 1.5, overflowY: 'auto', flex: 1 }}>
          <Stack spacing={0.75}>
            {activePresets.map((p, i) => (
              <PresetButton
                key={`${p.to}-${p.label}-${p.subtitle ?? ''}-${i}`}
                preset={p}
                onPick={applyPreset}
              />
            ))}
          </Stack>
        </Box>
        <Divider />
        <Box sx={{ p: 1.5 }}>
          <Typography variant="caption" color="text.secondary">
            Each preset rewrites the URL and routes you to the relevant page.
            Reset clears all sim params and returns home.
          </Typography>
        </Box>
      </Drawer>
    </Portal>
  )
}
