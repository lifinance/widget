import type { SvgIconComponent } from '@mui/icons-material'
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import { alpha, Box, Button, Stack, Typography } from '@mui/material'
import type { JSX, ReactNode } from 'react'

export type DepositStatusVariant = 'error' | 'warning' | 'info'

export interface DepositStatusAction {
  label: string
  onClick: () => void
  variant?: 'contained' | 'text' | 'outlined'
}

export interface DepositStatusScreenProps {
  variant: DepositStatusVariant
  title: string
  description: string
  primaryAction: DepositStatusAction
  secondaryAction?: DepositStatusAction
  children?: ReactNode
}

const ICONS: Record<DepositStatusVariant, SvgIconComponent> = {
  error: ErrorRoundedIcon,
  warning: WarningAmberRoundedIcon,
  info: InfoRoundedIcon,
}

const PALETTE_KEYS: Record<DepositStatusVariant, 'error' | 'warning' | 'info'> =
  {
    error: 'error',
    warning: 'warning',
    info: 'info',
  }

export function DepositStatusScreen({
  variant,
  title,
  description,
  primaryAction,
  secondaryAction,
  children,
}: DepositStatusScreenProps): JSX.Element {
  const Icon = ICONS[variant]
  const paletteKey = PALETTE_KEYS[variant]

  return (
    <Stack
      spacing={3}
      sx={{ flex: 1, alignItems: 'center', textAlign: 'center', pt: 1 }}
    >
      <Box
        sx={(theme) => ({
          position: 'relative',
          width: 96,
          height: 96,
          borderRadius: '50%',
          backgroundColor: alpha(
            theme.palette[paletteKey].main,
            theme.palette.mode === 'dark' ? 0.24 : 0.12
          ),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        })}
      >
        <Box
          sx={(theme) => ({
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: theme.palette[paletteKey].main,
            color: theme.palette[paletteKey].contrastText,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          })}
        >
          <Icon sx={{ fontSize: 36 }} />
        </Box>
      </Box>

      <Stack spacing={1} sx={{ alignItems: 'center', maxWidth: 320 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Stack>

      {children}

      <Stack
        spacing={1}
        sx={{ width: '100%', mt: 'auto', alignSelf: 'stretch' }}
      >
        <Button
          variant={primaryAction.variant ?? 'contained'}
          fullWidth
          onClick={primaryAction.onClick}
        >
          {primaryAction.label}
        </Button>
        {secondaryAction ? (
          <Button
            variant={secondaryAction.variant ?? 'text'}
            fullWidth
            onClick={secondaryAction.onClick}
          >
            {secondaryAction.label}
          </Button>
        ) : null}
      </Stack>
    </Stack>
  )
}
