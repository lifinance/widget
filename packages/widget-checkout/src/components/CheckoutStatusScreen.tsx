import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material'
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
      return t('button.seeDetails')
    case 'done':
      return t('button.done')
    case 'contactSupport':
      return t('button.contactSupport')
    case 'viewRefund':
      return t('button.viewRefund')
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
  const iconColor =
    tone === 'success'
      ? 'success.main'
      : tone === 'warning'
        ? 'warning.main'
        : tone === 'error'
          ? 'error.main'
          : 'primary.main'

  const bgColor =
    tone === 'success'
      ? 'success.light'
      : tone === 'warning'
        ? 'warning.light'
        : tone === 'error'
          ? 'error.light'
          : 'primary.light'

  return (
    <Box
      sx={{
        width: 64,
        height: 64,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bgColor,
        color: iconColor,
      }}
    >
      {icon === 'check' ? (
        <CheckCircleOutlineRoundedIcon sx={{ fontSize: 32 }} />
      ) : icon === 'spinner' ? (
        <CircularProgress size={32} color="inherit" />
      ) : icon === 'refund' ? (
        <ReplayRoundedIcon sx={{ fontSize: 32 }} />
      ) : (
        <ErrorOutlineRoundedIcon sx={{ fontSize: 32 }} />
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

  const allHandlers: ActionHandlers = { ...primaryAction, ...secondaryAction }

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
      <Stack spacing={1} sx={{ width: '100%', maxWidth: 320 }}>
        <ActionButton
          action={variant.primaryAction}
          handlers={allHandlers}
          variant="contained"
        />
        {variant.secondaryAction ? (
          <ActionButton
            action={variant.secondaryAction}
            handlers={allHandlers}
            variant="text"
          />
        ) : null}
      </Stack>
    </Stack>
  )
}
