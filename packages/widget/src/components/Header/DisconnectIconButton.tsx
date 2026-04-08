import { useAccountDisconnect } from '@lifi/wallet-management'
import type { Account } from '@lifi/widget-provider'
import PowerSettingsNewRounded from '@mui/icons-material/PowerSettingsNewRounded'
import { IconButton } from '@mui/material'
import type { JSX } from 'react'

export const DisconnectIconButton = ({
  account,
}: {
  account: Account
}): JSX.Element => {
  const disconnect = useAccountDisconnect()
  return (
    <IconButton
      size="medium"
      onClick={async (e) => {
        e.stopPropagation()
        await disconnect(account)
      }}
    >
      <PowerSettingsNewRounded />
    </IconButton>
  )
}
