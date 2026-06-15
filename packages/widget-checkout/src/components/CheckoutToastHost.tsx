'use client'
import { Alert, Snackbar } from '@mui/material'
import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useCheckoutToastStore } from '../stores/useCheckoutToastStore.js'

const TOAST_AUTO_HIDE_MS = 8000

const TOAST_I18N_KEY: Record<string, string> = {
  resumeNotFound: 'checkout.resume.notFoundToast',
}

export function CheckoutToastHost(): JSX.Element {
  const { t } = useTranslation()
  const toast = useCheckoutToastStore((s) => s.toast)
  const dismiss = useCheckoutToastStore((s) => s.dismiss)
  const i18nKey = toast ? TOAST_I18N_KEY[toast] : null
  return (
    <Snackbar
      open={Boolean(toast)}
      autoHideDuration={TOAST_AUTO_HIDE_MS}
      onClose={dismiss}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert severity="info" onClose={dismiss} sx={{ width: '100%' }}>
        {i18nKey ? t(i18nKey) : ''}
      </Alert>
    </Snackbar>
  )
}
