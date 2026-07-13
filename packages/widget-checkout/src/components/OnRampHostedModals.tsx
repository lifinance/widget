'use client'
import {
  type OnRampSession,
  useOnRampSession,
} from '@lifi/widget-provider/checkout'
import CloseIcon from '@mui/icons-material/Close'
import type { Theme } from '@mui/material'
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'
import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { usePendingCheckoutWriter } from '../hooks/usePendingCheckoutWriter.js'
import { useResumeKey } from '../hooks/useResumeKey.js'
import {
  type OnRampProviderInfo,
  useOnRampProviderMetas,
} from '../providers/OnRampProvider/OnRampProvider.js'
import { ErrorBoundary } from './ErrorBoundary.js'
import { formatOnRampError } from './formatOnRampError.js'

export function OnRampHostedModals(): JSX.Element {
  const metas = useOnRampProviderMetas()
  return (
    <>
      {metas.map((meta) => (
        <OnRampHostedModal key={meta.id} meta={meta} />
      ))}
    </>
  )
}

function OnRampHostedModal({
  meta,
}: {
  meta: OnRampProviderInfo
}): JSX.Element | null {
  const session = useOnRampSession(meta.id)
  if (!session) {
    return null
  }
  return <HostedModalDialog meta={meta} session={session} />
}

interface HostedModalDialogProps {
  meta: OnRampProviderInfo
  session: OnRampSession
}

function HostedModalDialog({
  meta,
  session,
}: HostedModalDialogProps): JSX.Element | null {
  const { t } = useTranslation()
  const resumeKey = useResumeKey()
  const { clearForKey } = usePendingCheckoutWriter()

  if (!session.mountTargetId) {
    return null
  }

  const errorText = formatOnRampError(session.error, meta.name, t)
  const mountTargetId = session.mountTargetId

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={session.isOpen}
      // Provider SDK owns close (TRANSAK_WIDGET_CLOSE); backdrop + ESC are no-ops.
      onClose={() => {}}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgb(0 0 0 / 48%)',
            backdropFilter: 'blur(3px)',
          },
        },
        paper: {
          sx: (theme: Theme) => ({
            backgroundImage: 'none',
            backgroundColor: theme.vars.palette.background.default,
            borderRadius: theme.vars.shape.borderRadius,
            width: 'min(96vw, 480px)',
            height: 'min(96dvh, 600px)',
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }),
        },
      }}
    >
      {session.isOpen ? (
        <Tooltip title={t('checkout.transak.forceClose.tooltip')}>
          <IconButton
            aria-label={t('checkout.transak.forceClose.tooltip')}
            onClick={() => {
              clearForKey(resumeKey)
              session.cancel()
            }}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 1,
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ) : null}
      <DialogContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          padding: 0,
          '&:first-of-type': { paddingTop: 0 },
        }}
      >
        <ErrorBoundary
          onError={(error) =>
            console.error(
              `[LifiWidgetCheckout] ${meta.name} modal render error:`,
              error
            )
          }
          fallback={(error) => (
            <Box sx={{ py: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {t('checkout.onramp.errors.generic')}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: 'block' }}
              >
                {error.message}
              </Typography>
            </Box>
          )}
        >
          <Box
            sx={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              minHeight: 0,
              minWidth: 0,
              width: '100%',
            }}
          >
            <Box
              id={mountTargetId}
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
              }}
            />
            {session.isLoading ? (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CircularProgress />
              </Box>
            ) : null}
            {!session.isLoading && errorText ? (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  px: 2,
                  textAlign: 'center',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {errorText}
                </Typography>
              </Box>
            ) : null}
          </Box>
        </ErrorBoundary>
      </DialogContent>
    </Dialog>
  )
}
