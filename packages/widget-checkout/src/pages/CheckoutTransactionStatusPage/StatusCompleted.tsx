import type {
  ExtendedTransactionInfo,
  FullStatusData,
  StatusResponse,
  TokenAmount,
} from '@lifi/sdk'
import { Card, CardTitle, Token } from '@lifi/widget/shared'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import { Box, Button, Stack, Typography } from '@mui/material'
import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { StatusStepList } from './StatusStepList.js'

interface StatusCompletedProps {
  status: StatusResponse
  onSeeDetails: () => void
  onDone: () => void
}

const ICON_SIZE = 96

export function StatusCompleted({
  status,
  onSeeDetails,
  onDone,
}: StatusCompletedProps): JSX.Element {
  const { t } = useTranslation()
  const full = status as FullStatusData
  const receiving = full.receiving as ExtendedTransactionInfo
  const receivingTokenAmount: TokenAmount | undefined =
    receiving?.amount && receiving?.token
      ? ({
          ...receiving.token,
          amount: BigInt(receiving.amount),
        } as TokenAmount)
      : undefined

  return (
    <Stack spacing={1.5} sx={{ flex: 1 }}>
      <Card variant="elevation" indented sx={{ p: 3, filter: 'none' }}>
        <Stack
          spacing={2}
          sx={{ alignItems: 'center', textAlign: 'center', pb: 2 }}
        >
          <Box
            sx={(theme) => ({
              width: ICON_SIZE,
              height: ICON_SIZE,
              borderRadius: '50%',
              padding: '4px',
              border: `3px solid ${theme.vars.palette.success.main}`,
              color: theme.vars.palette.success.main,
            })}
          >
            <Box
              sx={(theme) => ({
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: `color-mix(in srgb, ${theme.vars.palette.success.main} 18%, white)`,
              })}
            >
              <CheckRoundedIcon sx={{ fontSize: 44, strokeWidth: 2 }} />
            </Box>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {t('checkout.transactionStatus.success')}
          </Typography>
        </Stack>
        <StatusStepList status={full} phase="done" />
      </Card>

      {receivingTokenAmount ? (
        <Card variant="elevation" indented sx={{ p: 3, filter: 'none' }}>
          <CardTitle sx={{ p: 0, mb: 1.5 }}>{t('header.received')}</CardTitle>
          <Token token={receivingTokenAmount} disableDescription={false} />
        </Card>
      ) : null}

      <Stack direction="row" spacing={2} sx={{ pt: 1.5 }}>
        <Button
          variant="text"
          fullWidth
          size="large"
          onClick={onSeeDetails}
          sx={{ flex: 1 }}
        >
          {t('checkout.transactionStatus.seeDetails')}
        </Button>
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={onDone}
          sx={{ flex: 1 }}
        >
          {t('button.done')}
        </Button>
      </Stack>
    </Stack>
  )
}
