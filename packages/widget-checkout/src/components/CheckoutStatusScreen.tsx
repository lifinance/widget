import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded'
import {
  alpha,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material'
import type { JSX, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type {
  StatusVariant,
  StatusVariantPrimaryAction,
  StatusVariantSecondaryAction,
} from '../pages/CheckoutTransactionStatusPage/statusVariants.js'

export interface CheckoutStatusScreenProps {
  variant: StatusVariant
  /** Optional title override; falls back to the variant's titleKey. */
  title?: string
  /** Optional description override; falls back to the variant's descriptionKey. */
  description?: string
  /**
   * Optional node rendered directly under the description text — used for
   * inline links such as "View transaction details" on the failed-status
   * screen, which Figma specifies as a link, not a secondary button.
   */
  descriptionAddon?: ReactNode
  /** Handler map keyed by action name. Only the actions referenced by the variant need to be supplied. */
  primaryAction: ActionHandlers
  secondaryAction?: ActionHandlers
}

type ActionHandlers = Partial<
  Record<StatusVariantPrimaryAction | StatusVariantSecondaryAction, () => void>
>

function useActionLabel(
  action: StatusVariantPrimaryAction | StatusVariantSecondaryAction
): string {
  const { t } = useTranslation()
  switch (action) {
    case 'tryAgain':
      return t('button.tryAgain')
    case 'viewDetails':
      return t('button.viewTransferDetails')
    case 'done':
      return t('button.done')
    case 'contactSupport':
      return t('button.contactSupport')
    case 'viewRefund':
      return t('button.viewRefund')
    case 'retry':
      return t('button.tryAgain')
    default:
      return ''
  }
}

function ActionButton({
  action,
  handlers,
  variant: buttonVariant,
}: {
  action: StatusVariantPrimaryAction | StatusVariantSecondaryAction
  handlers: ActionHandlers
  variant: 'contained' | 'text'
}): JSX.Element | null {
  const label = useActionLabel(action)
  const handler = handlers[action]
  if (!handler) {
    return null
  }
  return (
    <Button variant={buttonVariant} fullWidth onClick={handler}>
      {label}
    </Button>
  )
}

function ToneIcon({
  icon,
  tone,
}: Pick<StatusVariant, 'icon' | 'tone'>): JSX.Element {
  const paletteKey: 'success' | 'warning' | 'error' | 'primary' =
    tone === 'success'
      ? 'success'
      : tone === 'warning'
        ? 'warning'
        : tone === 'error'
          ? 'error'
          : 'primary'

  // Error variants nest a solid disc inside the halo (white glyph on a
  // tone-coloured background). Success / pending / warning variants are
  // a single light halo with the tone-coloured glyph centred — matches
  // the Figma refund-states spec where only the failure case is filled.
  const Glyph =
    icon === 'check' ? (
      <CheckRoundedIcon sx={{ fontSize: tone === 'error' ? 36 : 44 }} />
    ) : icon === 'spinner' ? (
      <CircularProgress
        size={tone === 'error' ? 32 : 36}
        color="inherit"
        thickness={4.5}
      />
    ) : (
      <ErrorRoundedIcon sx={{ fontSize: tone === 'error' ? 36 : 44 }} />
    )

  return (
    <Box
      sx={(theme) => ({
        width: 96,
        height: 96,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: alpha(
          theme.palette[paletteKey].main,
          theme.palette.mode === 'dark' ? 0.24 : 0.12
        ),
        color: theme.palette[paletteKey].main,
      })}
    >
      {tone === 'error' ? (
        <Box
          sx={(theme) => ({
            width: 64,
            height: 64,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.palette[paletteKey].main,
            color: theme.palette[paletteKey].contrastText,
          })}
        >
          {Glyph}
        </Box>
      ) : (
        Glyph
      )}
    </Box>
  )
}

export function CheckoutStatusScreen({
  variant,
  title,
  description,
  descriptionAddon,
  primaryAction,
  secondaryAction,
}: CheckoutStatusScreenProps): JSX.Element {
  const { t } = useTranslation()

  const resolvedDescription = description ?? t(variant.descriptionKey)
  const resolvedTitle = title ?? t(variant.titleKey)

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
      <ToneIcon icon={variant.icon} tone={variant.tone} />
      <Stack spacing={1} sx={{ alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {resolvedTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {resolvedDescription}
        </Typography>
        {descriptionAddon}
      </Stack>
      {variant.primaryAction || variant.secondaryAction ? (
        <Stack spacing={1} sx={{ width: '100%', maxWidth: 320 }}>
          {variant.primaryAction ? (
            <ActionButton
              action={variant.primaryAction}
              handlers={primaryAction}
              variant="contained"
            />
          ) : null}
          {variant.secondaryAction && secondaryAction ? (
            <ActionButton
              action={variant.secondaryAction}
              handlers={secondaryAction}
              variant="text"
            />
          ) : null}
        </Stack>
      ) : null}
    </Stack>
  )
}
