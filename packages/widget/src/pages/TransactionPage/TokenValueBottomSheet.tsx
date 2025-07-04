import type { Route } from '@lifi/sdk'
import { isRelayerStep } from '@lifi/sdk'
import WarningRounded from '@mui/icons-material/WarningRounded'
import { Box, Button, Typography } from '@mui/material'
import type { RefObject } from 'react'
import { forwardRef, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { BottomSheet } from '../../components/BottomSheet/BottomSheet.js'
import type { BottomSheetBase } from '../../components/BottomSheet/types.js'
import { FeeBreakdownTooltip } from '../../components/FeeBreakdownTooltip.js'
import { useSetContentHeight } from '../../hooks/useSetContentHeight.js'
import { getAccumulatedFeeCostsBreakdown } from '../../utils/fees.js'
import { CenterContainer, IconCircle } from './StatusBottomSheet.style.js'
import { calculateValueLossPercentage } from './utils.js'

interface TokenValueBottomSheetProps {
  route: Route
  onContinue(): void
  onCancel?(): void
}

export const TokenValueBottomSheet = forwardRef<
  BottomSheetBase,
  TokenValueBottomSheetProps
>(({ route, onContinue, onCancel }, ref) => {
  const handleCancel = () => {
    ;(ref as RefObject<BottomSheetBase>).current?.close()
    onCancel?.()
  }

  return (
    <BottomSheet ref={ref} onClose={onCancel}>
      <TokenValueBottomSheetContent
        route={route}
        onContinue={onContinue}
        onCancel={handleCancel}
      />
    </BottomSheet>
  )
})

const TokenValueBottomSheetContent: React.FC<TokenValueBottomSheetProps> = ({
  route,
  onCancel,
  onContinue,
}) => {
  const { t } = useTranslation()
  const ref = useRef<HTMLElement>(null)
  useSetContentHeight(ref)
  const { gasCosts, feeCosts, gasCostUSD, feeCostUSD } =
    getAccumulatedFeeCostsBreakdown(route)
  const fromAmountUSD = Number.parseFloat(route.fromAmountUSD)
  const toAmountUSD = Number.parseFloat(route.toAmountUSD)
  const hasRelayerSupport = route.steps.every(isRelayerStep)
  return (
    <Box
      ref={ref}
      sx={{
        p: 3,
      }}
    >
      <CenterContainer>
        <IconCircle status="warning" mb={1}>
          <WarningRounded color="warning" />
        </IconCircle>
        <Typography
          sx={{
            py: 1,
            fontSize: 18,
            fontWeight: 700,
          }}
        >
          {t('warning.title.highValueLoss')}
        </Typography>
      </CenterContainer>
      <Typography
        sx={{
          py: 1,
        }}
      >
        {t('warning.message.highValueLoss')}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 1,
        }}
      >
        <Typography>{t('main.sending')}</Typography>
        <Typography
          sx={{
            fontWeight: 600,
          }}
        >
          {t('format.currency', { value: route.fromAmountUSD })}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 0.25,
        }}
      >
        <Typography>{t('main.fees.network')}</Typography>
        <FeeBreakdownTooltip
          gasCosts={gasCosts}
          relayerSupport={hasRelayerSupport}
        >
          <Typography
            sx={{
              fontWeight: 600,
            }}
          >
            {hasRelayerSupport
              ? t('main.fees.free')
              : t('format.currency', { value: gasCostUSD })}
          </Typography>
        </FeeBreakdownTooltip>
      </Box>
      {feeCostUSD ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: 0.25,
          }}
        >
          <Typography>{t('main.fees.provider')}</Typography>
          <FeeBreakdownTooltip feeCosts={feeCosts}>
            <Typography
              sx={{
                fontWeight: 600,
              }}
            >
              {t('format.currency', { value: feeCostUSD })}
            </Typography>
          </FeeBreakdownTooltip>
        </Box>
      ) : null}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 0.25,
        }}
      >
        <Typography>{t('main.receiving')}</Typography>
        <Typography
          sx={{
            fontWeight: 600,
          }}
        >
          {t('format.currency', { value: route.toAmountUSD })}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 0.25,
        }}
      >
        <Typography>{t('main.valueLoss')}</Typography>
        <Typography
          sx={{
            fontWeight: 600,
          }}
        >
          {calculateValueLossPercentage(
            fromAmountUSD,
            toAmountUSD,
            gasCostUSD,
            feeCostUSD
          )}
          %
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          mt: 3,
        }}
      >
        <Button variant="text" onClick={onCancel} fullWidth>
          {t('button.cancel')}
        </Button>
        <Box
          sx={{
            display: 'flex',
            p: 1,
          }}
        />
        <Button variant="contained" onClick={onContinue} fullWidth>
          {t('button.continue')}
        </Button>
      </Box>
    </Box>
  )
}
