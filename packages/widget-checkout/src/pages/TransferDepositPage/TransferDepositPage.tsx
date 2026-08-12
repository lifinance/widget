import { convertQuoteToRoute } from '@lifi/sdk'
import {
  Card,
  CardIconButton,
  formatTokenAmount,
  PageContainer,
  shortenAddress,
  useChain,
  useHeader,
} from '@lifi/widget/shared'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import {
  Alert,
  Box,
  CircularProgress,
  Collapse,
  IconButton,
  Stack,
  styled,
  Tooltip,
  Typography,
} from '@mui/material'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { QRCodeSVG } from 'qrcode.react'
import type { JSX } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useFundingOrder } from '../../hooks/useFundingOrder.js'
import { checkoutNavigationRoutes } from '../../utils/navigationRoutes.js'
import { DepositUnexpectedPage } from '../DepositErrorPages/DepositErrorPages.js'
import { DepositDetails } from './DepositDetails.js'
import { shouldLeaveDepositPage } from './shouldLeaveDepositPage.js'

const QR_SIZE = 224

const QrCodeCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.vars.palette.common.white,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'content-box',
  width: QR_SIZE,
  height: QR_SIZE,
}))

const statusPath = `/${checkoutNavigationRoutes.transactionExecution}/${checkoutNavigationRoutes.transactionStatus}`

function roundUpToSignificant(value: number, significantDigits = 4): number {
  if (!Number.isFinite(value) || value === 0) {
    return value
  }
  const exponent = Math.floor(Math.log10(Math.abs(value)))
  const factor = 10 ** (significantDigits - 1 - exponent)
  return Math.ceil(value * factor) / factor
}

function DepositLoadingState(): JSX.Element {
  return (
    <PageContainer bottomGutters>
      <Stack sx={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Stack>
    </PageContainer>
  )
}

export const TransferDepositPage: React.FC = (): JSX.Element => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { orderId } = useSearch({ strict: false }) as { orderId?: string }
  const { order, phase } = useFundingOrder(orderId ?? null)
  const depositAddress = order?.depositAddress ?? null
  // convertOrderToRoute only accepts STANDARD orders; SMART_DEPOSIT reuses
  // the lower-level quote converter for display purposes only (this route is
  // never executed). A malformed quote falls back to no route rather than
  // crashing the page.
  const route = useMemo(() => {
    if (!order?.quote) {
      return undefined
    }
    try {
      const converted = convertQuoteToRoute(order.quote)
      converted.id = order.orderId
      return converted
    } catch {
      return undefined
    }
  }, [order])
  const { chain } = useChain(route?.fromChainId)

  useEffect(() => {
    if (!order) {
      return
    }
    if (shouldLeaveDepositPage({ substatus: order.substatus, phase })) {
      // Replace, not push: the deposit page is done with, and leaving it on
      // the stack traps Back on a page that immediately re-navigates forward.
      navigate({
        to: statusPath,
        search: { orderId: order.orderId },
        replace: true,
      })
    }
  }, [order, phase, navigate])

  useHeader(t('header.depositAddress'))

  const [detailsOpen, setDetailsOpen] = useState(true)
  const [copied, setCopied] = useState(false)
  const copiedTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(copiedTimer.current), [])

  if (!order) {
    return <DepositLoadingState />
  }

  if (phase === 'failed') {
    return <DepositUnexpectedPage />
  }

  if (!depositAddress) {
    return <DepositLoadingState />
  }

  const symbol = route?.fromToken.symbol ?? ''
  const rawAmount = route
    ? Number.parseFloat(
        formatTokenAmount(BigInt(route.fromAmount), route.fromToken.decimals)
      )
    : 0
  const amount = roundUpToSignificant(rawAmount)
  const chainName = chain?.name ?? ''
  const shortAddress = shortenAddress(depositAddress) ?? depositAddress

  const copyAddress = (): void => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      void navigator.clipboard.writeText(depositAddress)
      setCopied(true)
      clearTimeout(copiedTimer.current)
      copiedTimer.current = setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <PageContainer bottomGutters>
      <Stack spacing={2}>
        <Alert severity="warning" sx={{ alignItems: 'flex-start' }}>
          <Typography variant="body2">
            <Trans
              i18nKey="checkout.transferDeposit.warning"
              values={{ amount, symbol, chain: chainName }}
              components={{ b: <strong /> }}
            />
          </Typography>
        </Alert>

        <Stack spacing={1.5} sx={{ alignItems: 'center', pt: 1 }}>
          <QrCodeCard>
            <QRCodeSVG
              value={depositAddress}
              size={QR_SIZE}
              level="M"
              imageSettings={
                route?.fromToken.logoURI
                  ? {
                      src: route.fromToken.logoURI,
                      height: 40,
                      width: 40,
                      excavate: true,
                    }
                  : undefined
              }
            />
          </QrCodeCard>
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center', pt: 0.5 }}
          >
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {shortAddress}
            </Typography>
            <Tooltip
              title={t(
                copied
                  ? 'checkout.transferDeposit.addressCopied'
                  : 'checkout.transferDeposit.copyAddress'
              )}
            >
              <CardIconButton
                size="small"
                onClick={copyAddress}
                aria-label={t('checkout.transferDeposit.copyAddress')}
              >
                {copied ? (
                  <CheckRoundedIcon fontSize="inherit" color="success" />
                ) : (
                  <ContentCopyRoundedIcon fontSize="inherit" />
                )}
              </CardIconButton>
            </Tooltip>
          </Stack>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: 'center', justifyContent: 'center' }}
        >
          <CircularProgress size={16} thickness={5} />
          <Typography variant="body2" color="text.secondary">
            {t('checkout.transferDeposit.polling')}
          </Typography>
        </Stack>

        {route ? (
          <Card variant="elevation" indented>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {t('checkout.transferDeposit.detailsTitle')}
              </Typography>
              <IconButton
                size="small"
                onClick={() => setDetailsOpen((open) => !open)}
                aria-expanded={detailsOpen}
                aria-label={t('checkout.transferDeposit.detailsTitle')}
              >
                {detailsOpen ? (
                  <ExpandLessRoundedIcon />
                ) : (
                  <ExpandMoreRoundedIcon />
                )}
              </IconButton>
            </Box>
            <Collapse in={detailsOpen} timeout="auto" unmountOnExit>
              <DepositDetails route={route} />
            </Collapse>
          </Card>
        ) : null}
      </Stack>
    </PageContainer>
  )
}
