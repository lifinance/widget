'use client'
import {
  type OnRampSession,
  useOnRampSession,
} from '@lifi/widget-provider/checkout'
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
import { type JSX, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { modalProps } from '../../components/Dialog/Dialog.js'
import { useGetScrollableContainer } from '../../hooks/useScrollableContainer.js'
import {
  type OnRampProviderInfo,
  useOnRampProviderMetas,
} from '../providers/OnRampProvider/OnRampProvider.js'
import { formatOnRampError } from './formatOnRampError.js'

/**
 * Renders one hosted modal per registered on-ramp provider. A provider
 * opts into the hosted modal by publishing a non-null `mountTargetId` on
 * its session; providers that paint their own overlay keep
 * `mountTargetId: null` and the matching `<OnRampHostedModal>` renders
 * nothing.
 *
 * Iterating metas keeps the component provider-agnostic — adding a new
 * iframe-style provider requires no changes here.
 */
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
  const getScrollableContainer = useGetScrollableContainer()
  const router = useRouter()

  useEffect(() => {
    if (!router || !session.mountTargetId) {
      return
    }
    return router.subscribe('onResolved', session.close)
  }, [router, session.mountTargetId, session.close])

  if (!session.mountTargetId) {
    return null
  }

  const errorText = formatOnRampError(session.error, meta.name, t)
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
        {t('checkout.onramp.dialogTitle', { providerName: meta.name })}
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
