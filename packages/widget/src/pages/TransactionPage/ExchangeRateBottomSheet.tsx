import type { ExchangeRateUpdateParams } from '@lifi/sdk'
import WarningRounded from '@mui/icons-material/WarningRounded'
import { Box, Button, Typography } from '@mui/material'
import type { RefObject } from 'react'
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { BottomSheet } from '../../components/BottomSheet/BottomSheet.js'
import type { BottomSheetBase } from '../../components/BottomSheet/types.js'
import { useSetContentHeight } from '../../hooks/useSetContentHeight.js'
import { formatTokenAmount } from '../../utils/format.js'
import { CenterContainer, IconCircle } from './StatusBottomSheet.style.js'

export interface ExchangeRateBottomSheetBase {
  isOpen(): void
  open(resolver: (value: boolean) => void, data: ExchangeRateUpdateParams): void
  close(value?: boolean, bottomSheetClose?: boolean): void
}

interface ExchangeRateBottomSheetProps {
  data?: ExchangeRateUpdateParams
  onContinue?(): void
  onCancel?(): void
}

export const ExchangeRateBottomSheet = forwardRef<
  ExchangeRateBottomSheetBase,
  ExchangeRateBottomSheetProps
>(({ onContinue, onCancel }, ref) => {
  const [data, setData] = useState<ExchangeRateUpdateParams>()
  const bottomSheetRef = useRef<BottomSheetBase>(null)
  const resolverRef = useRef<(value: boolean) => void>(null)

  const handleContinue = () => {
    ;(ref as RefObject<ExchangeRateBottomSheetBase>).current?.close(true)
    onContinue?.()
  }

  const handleCancel = useCallback(() => {
    ;(ref as RefObject<ExchangeRateBottomSheetBase>).current?.close(false)
    onCancel?.()
  }, [onCancel, ref])

  const handleClose = useCallback(() => {
    ;(ref as RefObject<ExchangeRateBottomSheetBase>).current?.close(
      false,
      false
    )
    onCancel?.()
  }, [onCancel, ref])

  useImperativeHandle(
    ref,
    () => ({
      isOpen: () => bottomSheetRef.current?.isOpen(),
      open: (resolver, data) => {
        setData(data)
        resolverRef.current = resolver
        bottomSheetRef.current?.open()
      },
      close: (value = false, bottomSheetClose = true) => {
        resolverRef.current?.(value)
        if (bottomSheetClose) {
          bottomSheetRef.current?.close()
        }
      },
    }),
    []
  )

  return (
    <BottomSheet ref={bottomSheetRef} onClose={handleClose}>
      <ExchangeRateBottomSheetContent
        data={data}
        onContinue={handleContinue}
        onCancel={handleCancel}
      />
    </BottomSheet>
  )
})

const ExchangeRateBottomSheetContent: React.FC<
  ExchangeRateBottomSheetProps
> = ({ data, onCancel, onContinue }) => {
  const { t } = useTranslation()
  const ref = useRef<HTMLElement>(null)
  useSetContentHeight(ref)

  if (!data) {
    return
  }

  const oldAmount = BigInt(data.oldToAmount || 1)
  const rateChange = (
    (Number((BigInt(data.newToAmount || 0) * 1_000_000n) / oldAmount) /
      1_000_000) *
      100 -
    100
  ).toFixed(2)

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
          {t('warning.title.rateChanged')}
        </Typography>
      </CenterContainer>
      <Typography
        sx={{
          py: 1,
        }}
      >
        {t('warning.message.rateChanged')}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 1,
        }}
      >
        <Typography>{t('main.quotedAmount')}</Typography>
        <Typography
          sx={{
            fontWeight: 600,
          }}
        >
          {t('format.tokenAmount', {
            value: formatTokenAmount(
              BigInt(data.oldToAmount),
              data.toToken.decimals
            ),
          })}{' '}
          {data?.toToken.symbol}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 0.25,
        }}
      >
        <Typography>{t('main.currentAmount')}</Typography>
        <Typography
          sx={{
            fontWeight: 600,
          }}
        >
          {t('format.tokenAmount', {
            value: formatTokenAmount(
              BigInt(data?.newToAmount),
              data?.toToken.decimals
            ),
          })}{' '}
          {data?.toToken.symbol}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 0.25,
        }}
      >
        <Typography>{t('main.rateChange')}</Typography>
        <Typography
          sx={{
            fontWeight: 600,
          }}
        >
          {rateChange}%
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
