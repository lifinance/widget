import type { OnRampFailureKind } from '@lifi/widget-provider/checkout'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineRounded'
import { Box, Button, Stack, Typography } from '@mui/material'
import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'

export interface OnRampFailureScreenProps {
  kind: OnRampFailureKind
  providerName: string
  /** Optional override title; falls back to the default copy for `kind`. */
  title?: string
  /** Optional override message; falls back to the default copy for `kind`. */
  description?: string
  onRetry: () => void
  onContactSupport?: () => void
}

export function OnRampFailureScreen({
  kind,
  providerName,
  title,
  description,
  onRetry,
  onContactSupport,
}: OnRampFailureScreenProps): JSX.Element {
  const { t } = useTranslation()

  const titleKey =
    kind === 'withdrawal'
      ? 'checkout.onramp.failure.withdrawalTitle'
      : 'checkout.onramp.failure.connectionTitle'
  const descriptionKey =
    kind === 'withdrawal'
      ? 'checkout.onramp.failure.withdrawalDescription'
      : 'checkout.onramp.failure.connectionDescription'

  return (
    <Stack
      spacing={3}
      sx={{
        alignItems: 'center',
        textAlign: 'center',
        padding: 3,
        flex: 1,
      }}
    >
      <Box
        sx={(theme) => ({
          width: 64,
          height: 64,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.vars.palette.error.light,
          color: theme.vars.palette.error.main,
        })}
      >
        <ErrorOutlineIcon sx={{ fontSize: 32 }} />
      </Box>
      <Stack spacing={1} sx={{ alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {title ?? t(titleKey)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description ?? t(descriptionKey, { providerName })}
        </Typography>
      </Stack>
      <Stack spacing={1} sx={{ width: '100%', maxWidth: 320 }}>
        <Button variant="contained" fullWidth onClick={onRetry}>
          {t('button.tryAgain')}
        </Button>
        {onContactSupport ? (
          <Button variant="text" fullWidth onClick={onContactSupport}>
            {t('button.contactSupport')}
          </Button>
        ) : null}
      </Stack>
    </Stack>
  )
}
