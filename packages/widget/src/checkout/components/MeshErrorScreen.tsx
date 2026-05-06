import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineRounded'
import { Box, Button, Stack, Typography } from '@mui/material'
import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import type { OnRampFailureKind } from '../providers/OnRampProvider/types.js'

export interface MeshErrorScreenProps {
  kind: OnRampFailureKind
  /** Optional override message; falls back to the default copy for `kind`. */
  description?: string
  onRetry: () => void
  onContactSupport?: () => void
}

export function MeshErrorScreen({
  kind,
  description,
  onRetry,
  onContactSupport,
}: MeshErrorScreenProps): JSX.Element {
  const { t } = useTranslation()

  const titleKey =
    kind === 'withdrawal'
      ? 'checkout.mesh.failure.withdrawalTitle'
      : 'checkout.mesh.failure.connectionTitle'
  const descriptionKey =
    kind === 'withdrawal'
      ? 'checkout.mesh.failure.withdrawalDescription'
      : 'checkout.mesh.failure.connectionDescription'

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
          {t(titleKey)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description ?? t(descriptionKey)}
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
