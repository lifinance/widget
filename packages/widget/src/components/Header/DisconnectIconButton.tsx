import { type Account, useAccountDisconnect } from '@lifi/wallet-management'
import { PowerSettingsNewRounded } from '@mui/icons-material'
import { IconButton } from '@mui/material'

export const DisconnectIconButton = ({ account }: { account: Account }) => {
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
