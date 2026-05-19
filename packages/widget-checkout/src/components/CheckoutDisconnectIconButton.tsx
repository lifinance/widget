import { useAccountDisconnect } from '@lifi/wallet-management'
import type { Account } from '@lifi/widget-provider'
import PowerSettingsNewRounded from '@mui/icons-material/PowerSettingsNewRounded'
import { IconButton } from '@mui/material'
import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'

export function CheckoutDisconnectIconButton({
  account,
}: {
  account: Account
}): JSX.Element {
  const { t } = useTranslation()
  const disconnect = useAccountDisconnect()
  return (
    <IconButton
      size="small"
      aria-label={t('button.disconnect')}
      sx={{
        padding: '2px',
        color: 'text.secondary',
      }}
      onClick={async (e) => {
        e.stopPropagation()
        await disconnect(account)
      }}
    >
      <PowerSettingsNewRounded sx={{ fontSize: '1.125rem' }} />
    </IconButton>
  )
}
