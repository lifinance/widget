import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import {
  Box,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { QRCodeSVG } from 'qrcode.react'
import type { JSX } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageContainer } from '../../../components/PageContainer.js'
import { useHeader } from '../../../hooks/useHeader.js'
import { useFrozenQuote } from '../../hooks/useFrozenQuote.js'
import { extractDepositAddress } from '../../utils/extractDepositAddress.js'
import { checkoutNavigationRoutes } from '../../utils/navigationRoutes.js'
import { useTransferStatusPoll } from './useTransferStatusPoll.js'

function formatRemaining(ms: number): { minutes: number; seconds: number } {
  const total = Math.max(0, Math.floor(ms / 1000))
  return { minutes: Math.floor(total / 60), seconds: total % 60 }
}

export const TransferDepositPage: React.FC = (): JSX.Element => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { frozen, expired, clear } = useFrozenQuote()
  const route = frozen?.route
  const depositAddress = useMemo(() => extractDepositAddress(route), [route])

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
    routeId: frozen?.id ?? null,
    enabled: !!frozen && !expired,
  })

  useHeader(t('header.transferCrypto'))

  const handleRegenerate = (): void => {
    clear()
    navigate({ to: checkoutNavigationRoutes.enterAmount })
  }

  if (!frozen || !depositAddress || expired) {
    return (
      <PageContainer>
        <Stack spacing={2}>
          <Typography>{t('checkout.transferDeposit.expired')}</Typography>
          <Button variant="contained" onClick={handleRegenerate}>
            {t('checkout.transferDeposit.regenerate')}
          </Button>
        </Stack>
      </PageContainer>
    )
  }

  const fromToken = (route as unknown as { fromToken?: { symbol?: string } })
    ?.fromToken
  const symbol = fromToken?.symbol ?? ''
  const fromAmount =
    (route as unknown as { fromAmount?: string })?.fromAmount ?? ''
  const chainName =
    (route as unknown as { fromToken?: { chainName?: string } })?.fromToken
      ?.chainName ?? ''

  return (
    <PageContainer>
      <Stack spacing={2} sx={{ alignItems: 'center' }}>
        <Typography variant="h6">
          {t('checkout.transferDeposit.title', {
            amount: fromAmount,
            symbol,
            chain: chainName,
          })}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('checkout.transferDeposit.instructions', { minutes, seconds })}
        </Typography>
        <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
          <QRCodeSVG value={depositAddress} size={200} />
        </Box>
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: 'center', width: '100%', maxWidth: 360 }}
        >
          <Typography variant="body2" sx={{ wordBreak: 'break-all', flex: 1 }}>
            {depositAddress}
          </Typography>
          <Tooltip title={t('checkout.transferDeposit.copyAddress')}>
            <IconButton
              size="small"
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.clipboard) {
                  void navigator.clipboard.writeText(depositAddress)
                }
              }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
        <Typography variant="caption" color="text.secondary">
          {t('checkout.transferDeposit.polling')}
        </Typography>
      </Stack>
    </PageContainer>
  )
}
