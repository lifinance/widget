'use client'
import type { OnRampError, OnRampSession } from '@lifi/widget-provider/checkout'
import { useTransakSession } from '@lifi/widget-provider/checkout'
import type { Theme } from '@mui/material'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import { useRouter } from '@tanstack/react-router'
import type { TFunction } from 'i18next'
import { type JSX, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { modalProps } from '../../components/Dialog/Dialog.js'
import { useGetScrollableContainer } from '../../hooks/useScrollableContainer.js'

/**
 * Renders the hosted modal shell around each on-ramp provider whose session
 * exposes a `mountTargetId`. Providers stay logic-only — the widget owns the
 * `<Dialog>` chrome, translation lookups, and router-driven close behavior.
 *
 * Translation keys are static (`checkout.onramp.*`); the provider name
 * varies via `{{providerName}}` interpolation.
 */
// Only providers whose SDK is an iframe (Transak) need the hosted modal.
// Overlay-style SDKs (Mesh) set `mountTargetId: null` and never render here.
// Adding a new modal-style provider requires another `<OnRampHostedModal>`
// below — keep the list flat so rules-of-hooks stays straightforward.
export function OnRampDialogs(): JSX.Element {
  const transak = useTransakSession()
  return <OnRampHostedModal providerName="Transak" session={transak} />
}

interface OnRampHostedModalProps {
  providerName: string
  session: OnRampSession | null
}

function OnRampHostedModal({
  providerName,
  session,
}: OnRampHostedModalProps): JSX.Element | null {
  const { t } = useTranslation()
  const getScrollableContainer = useGetScrollableContainer()
  const router = useRouter()

  // Subscribe only while a hosted modal is registered (mountTargetId != null);
  // overlay-style providers don't need router-driven close handling.
  useEffect(() => {
    if (!router || !session?.mountTargetId) {
      return
    }
    return router.subscribe('onResolved', session.close)
  }, [router, session])

  if (!session?.mountTargetId) {
    return null
  }

  const errorText = formatOnRampError(session.error, providerName, t)
  const mountTargetId = session.mountTargetId

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={session.isOpen}
      onClose={session.close}
      container={getScrollableContainer}
      sx={modalProps.sx}
      slotProps={{
        backdrop: {
          sx: {
            position: 'absolute',
            backgroundColor: 'rgb(0 0 0 / 32%)',
            backdropFilter: 'blur(3px)',
          },
        },
        paper: {
          sx: (theme: Theme) => ({
            position: 'absolute',
            backgroundImage: 'none',
            backgroundColor: theme.vars.palette.background.default,
            borderTopLeftRadius: theme.vars.shape.borderRadius,
            borderTopRightRadius: theme.vars.shape.borderRadius,
            height: 'min(90dvh, 720px)',
            display: 'flex',
            flexDirection: 'column',
          }),
        },
      }}
    >
      <DialogTitle>
        {t('checkout.onramp.dialogTitle', { providerName })}
      </DialogTitle>
      <DialogContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          pt: 1,
        }}
      >
        {session.isLoading ? (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CircularProgress />
          </Box>
        ) : null}
        {!session.isLoading && errorText ? (
          <Box sx={{ py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {errorText}
            </Typography>
          </Box>
        ) : null}
        {!session.isLoading && !errorText ? (
          <Box
            id={mountTargetId}
            sx={{
              flex: 1,
              display: 'flex',
              minHeight: 480,
              minWidth: 0,
              width: '100%',
            }}
          />
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={session.close}>{t('checkout.onramp.close')}</Button>
      </DialogActions>
    </Dialog>
  )
}

export function formatOnRampError(
  error: OnRampError | null,
  providerName: string,
  t: TFunction
): string | null {
  if (!error) {
    return null
  }
  if (error.message) {
    return error.message
  }
  if (error.code) {
    // `providerName` after the spread so a stray host-supplied param can't
    // overwrite the widget-resolved provider name.
    return t(`checkout.onramp.errors.${error.code}`, {
      ...error.params,
      providerName,
    })
  }
  return null
}
