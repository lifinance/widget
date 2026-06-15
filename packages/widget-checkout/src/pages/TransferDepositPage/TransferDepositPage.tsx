import {
  Card,
  CardIconButton,
  formatTokenAmount,
  PageContainer,
  shortenAddress,
  useChain,
  useHeader,
} from '@lifi/widget/shared'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Collapse,
  IconButton,
  Stack,
  styled,
  Tooltip,
  Typography,
} from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { QRCodeSVG } from 'qrcode.react'
import type { JSX } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useCheckoutModal } from '../../CheckoutModal.js'
import { ConfirmationBottomSheet } from '../../components/ConfirmationBottomSheet.js'
import { useFrozenQuote } from '../../hooks/useFrozenQuote.js'
import { usePendingCheckoutWriter } from '../../hooks/usePendingCheckoutWriter.js'
import { useResumeKey } from '../../hooks/useResumeKey.js'
import { extractDepositAddress } from '../../utils/extractDepositAddress.js'
import { checkoutNavigationRoutes } from '../../utils/navigationRoutes.js'
import { DepositAddressExpiredPage } from '../DepositErrorPages/DepositErrorPages.js'
import { DepositDetails } from './DepositDetails.js'
import { useTransferStatusPoll } from './useTransferStatusPoll.js'

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

function formatRemaining(ms: number): { minutes: string; seconds: string } {
  const total = Math.max(0, Math.floor(ms / 1000))
  return {
    minutes: String(Math.floor(total / 60)).padStart(2, '0'),
    seconds: String(total % 60).padStart(2, '0'),
  }
}

function roundUpToSignificant(value: number, significantDigits = 4): number {
  if (!Number.isFinite(value) || value === 0) {
    return value
  }
  const exponent = Math.floor(Math.log10(Math.abs(value)))
  const factor = 10 ** (significantDigits - 1 - exponent)
  return Math.ceil(value * factor) / factor
}

export const TransferDepositPage: React.FC = (): JSX.Element => {
  const { t } = useTranslation()
  const { frozen, expired } = useFrozenQuote()
  const route = frozen?.route
  const depositAddress = useMemo(() => extractDepositAddress(route), [route])
  const { chain } = useChain(route?.fromChainId)

  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!frozen) {
      return
    }
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [frozen])

  const remainingMs = frozen ? Math.max(0, frozen.expiresAt - now) : 0
  const { minutes, seconds } = formatRemaining(remainingMs)

  useTransferStatusPoll({
    depositAddress,
    fromChain: route?.fromChainId ?? null,
    routeId: frozen?.id ?? null,
    enabled: !!frozen && !expired,
  })

  const { writeTransfer } = usePendingCheckoutWriter()
  const writtenAddressRef = useRef<string | null>(null)
  useEffect(() => {
    if (!frozen || !route || !depositAddress || expired) {
      return
    }
    if (writtenAddressRef.current === depositAddress) {
      return
    }
    writtenAddressRef.current = depositAddress
    writeTransfer({
      depositAddress,
      fromChain: route.fromChainId,
      frozenRouteId: frozen.id,
      frozenQuote: {
        id: frozen.id,
        route: frozen.route,
        expiresAt: frozen.expiresAt,
      },
    })
  }, [frozen, route, depositAddress, expired, writeTransfer])

  useHeader(t('header.depositAddress'))

  const [detailsOpen, setDetailsOpen] = useState(true)
  const [startNewOpen, setStartNewOpen] = useState(false)
  const navigate = useNavigate()
  const resumeKey = useResumeKey()
  const { clearForKey } = usePendingCheckoutWriter()
  const { clear: clearFrozen } = useFrozenQuote()
  const modalContext = useCheckoutModal()

  const handleStartNew = (): void => {
    setStartNewOpen(true)
  }
  const handleCancelStartNew = (): void => {
    setStartNewOpen(false)
  }
  const handleConfirmStartNew = (): void => {
    setStartNewOpen(false)
    clearForKey(resumeKey)
    clearFrozen()
    navigate({ to: checkoutNavigationRoutes.enterAmount, replace: true })
  }

  if (!frozen || !route || !depositAddress || expired) {
    return <DepositAddressExpiredPage />
  }

  const symbol = route.fromToken.symbol
  const rawAmount = Number.parseFloat(
    formatTokenAmount(BigInt(route.fromAmount), route.fromToken.decimals)
  )
  const amount = roundUpToSignificant(rawAmount)
  const chainName = chain?.name ?? ''
  const shortAddress = shortenAddress(depositAddress) ?? depositAddress

  const copyAddress = (): void => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      void navigator.clipboard.writeText(depositAddress)
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
                route.fromToken.logoURI
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
            <Tooltip title={t('checkout.transferDeposit.copyAddress')}>
              <CardIconButton size="small" onClick={copyAddress}>
                <ContentCopyRoundedIcon fontSize="inherit" />
              </CardIconButton>
            </Tooltip>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            {t('checkout.transferDeposit.expiresIn', { minutes, seconds })}
          </Typography>
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

        <Button variant="text" onClick={handleStartNew} fullWidth>
          {t('checkout.transferDeposit.startNew')}
        </Button>
      </Stack>
      <ConfirmationBottomSheet
        open={startNewOpen}
        onCancel={handleCancelStartNew}
        onConfirm={handleConfirmStartNew}
        container={modalContext?.panelEl ?? null}
        title={t('checkout.transferDeposit.startNewConfirmation.title')}
        body={t('checkout.transferDeposit.startNewConfirmation.body')}
        cancelLabel={t('checkout.transferDeposit.startNewConfirmation.cancel')}
        confirmLabel={t(
          'checkout.transferDeposit.startNewConfirmation.confirm'
        )}
      />
    </PageContainer>
  )
}
